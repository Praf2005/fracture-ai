"""
Grad-CAM utilities for the fracture classification model.

The trained model is a Keras Sequential model with this shape
(as produced by the training notebook):

    Input(224, 224, 3)
    Rescaling(1/127.5, offset=-1)   <- optional, detected automatically
    MobileNetV2 (frozen, sub-model)  <- detected automatically
    GlobalAveragePooling2D
    Dropout
    Dense(1, activation="sigmoid")

Label convention (from image_dataset_from_directory with class folders
"fractured" and "not fractured", sorted alphabetically):
    0 = fractured
    1 = not fractured
So the sigmoid output is P(not fractured). Fracture score = 1 - output.

This module does NOT hardcode any layer name. It walks the loaded
model's layers to find the MobileNetV2 sub-model and its last Conv2D
layer at runtime, so it keeps working even if the notebook/model is
retrained or restructured slightly.
"""

from typing import Optional, Tuple

import numpy as np
import tensorflow as tf
import cv2


class GradCAMError(Exception):
    """Raised when Grad-CAM cannot be computed for a given model."""


def find_base_submodel(model: tf.keras.Model) -> tf.keras.Model:
    """Find the first layer of `model` that is itself a Keras Model
    (this is the frozen MobileNetV2 feature extractor)."""
    for layer in model.layers:
        if isinstance(layer, tf.keras.Model):
            return layer
    raise GradCAMError(
        "Could not locate a MobileNetV2 sub-model inside the loaded model. "
        "Expected one of the top-level layers to be a nested Keras Model."
    )


def find_last_conv_layer(sub_model: tf.keras.Model) -> tf.keras.layers.Layer:
    """Find the last Conv2D layer inside the base feature extractor."""
    for layer in reversed(sub_model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer
    raise GradCAMError(
        "Could not find a Conv2D layer inside the base feature extractor."
    )


def find_preprocessing_layer(
    model: tf.keras.Model, base_model: tf.keras.Model
) -> Optional[tf.keras.layers.Layer]:
    """If a Rescaling layer sits before the base model in the top-level
    model, return it so we can replicate its scale/offset manually when
    feeding the base model directly (Grad-CAM bypasses the top-level
    model's own forward pass in order to keep a gradient tape on the
    conv output)."""
    base_index = model.layers.index(base_model)
    for layer in reversed(model.layers[:base_index]):
        if isinstance(layer, tf.keras.layers.Rescaling):
            return layer
    return None


class GradCAMEngine:
    """Wraps a loaded fracture-classification model and exposes a
    single `analyze()` call that returns the prediction plus a Grad-CAM
    bounding box on the original image."""

    def __init__(self, model: tf.keras.Model):
        self.model = model
        self.base_model = find_base_submodel(model)
        self.last_conv_layer = find_last_conv_layer(self.base_model)
        self.rescaling_layer = find_preprocessing_layer(model, self.base_model)
        self.base_index = model.layers.index(self.base_model)
        self.post_base_layers = model.layers[self.base_index + 1 :]

        # Feature extractor: base model input -> (last conv output, base model output)
        self.feature_extractor = tf.keras.models.Model(
            inputs=self.base_model.input,
            outputs=[self.last_conv_layer.output, self.base_model.output],
        )

    def _apply_rescaling(self, img: tf.Tensor) -> tf.Tensor:
        if self.rescaling_layer is not None:
            scale = self.rescaling_layer.scale
            offset = self.rescaling_layer.offset
            return img * scale + offset
        # Fall back to the standard MobileNetV2 preprocessing if no
        # explicit Rescaling layer was found in the model.
        return img / 127.5 - 1.0

    def predict_and_gradcam(
        self, img_224: np.ndarray
    ) -> Tuple[float, np.ndarray]:
        """
        img_224: float32 array, shape (224, 224, 3), RAW pixel values
                 in [0, 255] (not yet normalized).

        Returns:
            not_fractured_probability: float, the raw sigmoid output
            heatmap: float32 array, shape (224, 224), values in [0, 1]
        """
        img = tf.convert_to_tensor(img_224, dtype=tf.float32)
        img = tf.expand_dims(img, axis=0)  # (1, 224, 224, 3)
        processed = self._apply_rescaling(img)

        with tf.GradientTape() as tape:
            conv_output, base_output = self.feature_extractor(
                processed, training=False
            )
            x = base_output
            for layer in self.post_base_layers:
                x = layer(x, training=False) if _accepts_training(layer) else layer(x)

            prediction = x[:, 0]  # P(not fractured)
            fracture_score = 1.0 - prediction

        gradients = tape.gradient(fracture_score, conv_output)
        if gradients is None:
            raise GradCAMError(
                "Gradients could not be computed; the model graph may be "
                "incompatible with this Grad-CAM implementation."
            )

        pooled_gradients = tf.reduce_mean(gradients, axis=(1, 2))[0]
        conv_output = conv_output[0]

        heatmap = tf.reduce_sum(conv_output * pooled_gradients, axis=-1)
        heatmap = tf.maximum(heatmap, 0)
        heatmap = heatmap / (tf.reduce_max(heatmap) + 1e-8)

        return float(prediction[0]), heatmap.numpy()


def _accepts_training(layer) -> bool:
    try:
        import inspect

        return "training" in inspect.signature(layer.call).parameters
    except (TypeError, ValueError):
        return False


def heatmap_to_bounding_box(
    heatmap_224: np.ndarray,
    original_width: int,
    original_height: int,
    threshold_ratio: float = 0.60,
) -> Optional[Tuple[int, int, int, int]]:
    """
    Resize the 224x224 heatmap to the original image size, threshold it,
    and return the bounding box (x, y, width, height) of the strongest
    contour. Returns None if no suitable region is found.
    """
    heatmap_resized = cv2.resize(heatmap_224, (original_width, original_height))
    heatmap_uint8 = np.uint8(np.clip(heatmap_resized, 0, 1) * 255)

    threshold_value = int(threshold_ratio * 255)
    _, binary = cv2.threshold(
        heatmap_uint8, threshold_value, 255, cv2.THRESH_BINARY
    )

    contours, _ = cv2.findContours(
        binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    if not contours:
        return None

    contour = max(contours, key=cv2.contourArea)
    if cv2.contourArea(contour) < 1:
        return None

    x, y, w, h = cv2.boundingRect(contour)
    return int(x), int(y), int(w), int(h)


def draw_region_box(
    original_image_bgr: np.ndarray,
    box: Optional[Tuple[int, int, int, int]],
) -> np.ndarray:
    """Draw the possible-fracture-region rectangle on a copy of the
    original (BGR) image. Returns the image unchanged if box is None."""
    output = original_image_bgr.copy()
    if box is None:
        return output

    x, y, w, h = box
    color = (0, 76, 255)  # BGR: a clear medical-style red/orange
    thickness = max(2, int(round(min(output.shape[0], output.shape[1]) * 0.006)))
    cv2.rectangle(output, (x, y), (x + w, y + h), color, thickness)

    label = "Possible Fracture Region"
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = max(0.5, min(output.shape[1] / 900, 1.0))
    (text_w, text_h), baseline = cv2.getTextSize(label, font, font_scale, 2)

    label_y = y - 10 if y - 10 - text_h > 0 else y + h + text_h + 10
    cv2.rectangle(
        output,
        (x, label_y - text_h - 6),
        (x + text_w + 10, label_y + baseline),
        color,
        -1,
    )
    cv2.putText(
        output,
        label,
        (x + 5, label_y),
        font,
        font_scale,
        (255, 255, 255),
        2,
        cv2.LINE_AA,
    )
    return output
