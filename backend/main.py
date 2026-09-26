"""
FractureAI backend.

Run with:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

import base64
import io
import logging
from contextlib import asynccontextmanager
from typing import Optional

import cv2
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from gradcam import (
    GradCAMEngine,
    GradCAMError,
    draw_region_box,
    heatmap_to_bounding_box,
)


# --------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------

MODEL_PATH = "models/fracture_model.keras"

IMG_SIZE = (224, 224)

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

MAX_UPLOAD_BYTES = 10 * 1024 * 1024

# Production Vercel frontend
FRONTEND_ORIGIN = "https://fracture-ai-xi.vercel.app"

# Actual test accuracy of the trained model
MODEL_ACCURACY_TEXT = "91.2%"


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("fracture-ai")


# --------------------------------------------------------------------
# Model state
# --------------------------------------------------------------------

state: dict = {
    "model": None,
    "engine": None,
}


# --------------------------------------------------------------------
# Load model
# --------------------------------------------------------------------

def load_model() -> None:
    logger.info("Loading model from %s ...", MODEL_PATH)

    model = tf.keras.models.load_model(MODEL_PATH)

    # Warm up the model so the first real request is faster.
    dummy = np.zeros(
        (1, IMG_SIZE[0], IMG_SIZE[1], 3),
        dtype=np.float32,
    )

    model.predict(dummy, verbose=0)

    engine = GradCAMEngine(model)

    state["model"] = model
    state["engine"] = engine

    logger.info(
        "Model loaded successfully. Ready to serve predictions."
    )


# --------------------------------------------------------------------
# FastAPI lifespan
# --------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        load_model()
    except Exception:
        logger.exception(
            "Failed to load model at startup. "
            "/predict will return an error until a valid model "
            "is placed at %s.",
            MODEL_PATH,
        )

    yield


# --------------------------------------------------------------------
# FastAPI app
# --------------------------------------------------------------------

app = FastAPI(
    title="FractureAI Backend",
    lifespan=lifespan,
)


# --------------------------------------------------------------------
# CORS
# --------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_ORIGIN,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------

def encode_image_to_base64(image_rgb: np.ndarray) -> str:
    """Encode an RGB numpy image as a base64 JPEG data URL."""

    image_bgr = cv2.cvtColor(
        image_rgb,
        cv2.COLOR_RGB2BGR,
    )

    success, buffer = cv2.imencode(
        ".jpg",
        image_bgr,
        [int(cv2.IMWRITE_JPEG_QUALITY), 90],
    )

    if not success:
        raise RuntimeError("Failed to encode image.")

    b64 = base64.b64encode(buffer).decode("utf-8")

    return f"data:image/jpeg;base64,{b64}"


def classify(
    not_fractured_probability: float,
) -> tuple[str, float]:
    """
    Apply the training-time label convention.

    Sigmoid output:
    - probability >= 0.5 -> NOT FRACTURED
    - probability < 0.5 -> FRACTURED
    """

    if not_fractured_probability >= 0.5:
        return (
            "NOT FRACTURED",
            not_fractured_probability,
        )

    return (
        "FRACTURED",
        1.0 - not_fractured_probability,
    )


# --------------------------------------------------------------------
# Health route
# --------------------------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": state["model"] is not None,
    }


# --------------------------------------------------------------------
# Prediction route
# --------------------------------------------------------------------

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
):

    # ---------------------------------------------------------------
    # Check model
    # ---------------------------------------------------------------

    if state["engine"] is None:
        raise HTTPException(
            status_code=503,
            detail=(
                f"Model is not loaded. Place your trained model at "
                f"'{MODEL_PATH}' and restart the server."
            ),
        )

    # ---------------------------------------------------------------
    # Check file type
    # ---------------------------------------------------------------

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Please upload a JPG, PNG, or WEBP image."
            ),
        )

    # ---------------------------------------------------------------
    # Read uploaded file
    # ---------------------------------------------------------------

    raw_bytes = await file.read()

    if len(raw_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=400,
            detail=(
                "File too large. "
                "Please upload an image under 10 MB."
            ),
        )

    # ---------------------------------------------------------------
    # Validate image
    # ---------------------------------------------------------------

    try:
        pil_image = Image.open(
            io.BytesIO(raw_bytes)
        )

        pil_image.verify()

        pil_image = Image.open(
            io.BytesIO(raw_bytes)
        ).convert("RGB")

    except (
        UnidentifiedImageError,
        OSError,
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to read this file as an image. "
                "Please try another X-ray."
            ),
        )

    # ---------------------------------------------------------------
    # Prepare image
    # ---------------------------------------------------------------

    original_rgb = np.array(pil_image)

    original_height, original_width = (
        original_rgb.shape[:2]
    )

    resized = cv2.resize(
        original_rgb,
        IMG_SIZE,
    ).astype(np.float32)

    # ---------------------------------------------------------------
    # Prediction + Grad-CAM
    # ---------------------------------------------------------------

    try:
        (
            not_fractured_probability,
            heatmap_224,
        ) = state["engine"].predict_and_gradcam(
            resized
        )

    except GradCAMError as exc:
        logger.warning(
            "Grad-CAM failed: %s",
            exc,
        )

        not_fractured_probability = None
        heatmap_224 = None

    except Exception:
        logger.exception(
            "Model prediction failed."
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "The model could not process this image. "
                "Please try another X-ray."
            ),
        )

    if not_fractured_probability is None:
        raise HTTPException(
            status_code=500,
            detail=(
                "The model could not process this image. "
                "Please try another X-ray."
            ),
        )

    # ---------------------------------------------------------------
    # Classification
    # ---------------------------------------------------------------

    prediction_label, confidence = classify(
        not_fractured_probability
    )

    confidence_pct = round(
        confidence * 100,
        2,
    )

    # ---------------------------------------------------------------
    # Possible fracture region
    # ---------------------------------------------------------------

    possible_region: Optional[dict] = None
    analyzed_rgb = original_rgb

    try:
        box = heatmap_to_bounding_box(
            heatmap_224,
            original_width,
            original_height,
        )

    except Exception:
        logger.exception(
            "Bounding box extraction failed."
        )

        box = None

    if box is not None:

        x, y, w, h = box

        possible_region = {
            "x": x,
            "y": y,
            "width": w,
            "height": h,
        }

        original_bgr = cv2.cvtColor(
            original_rgb,
            cv2.COLOR_RGB2BGR,
        )

        analyzed_bgr = draw_region_box(
            original_bgr,
            box,
        )

        analyzed_rgb = cv2.cvtColor(
            analyzed_bgr,
            cv2.COLOR_BGR2RGB,
        )

        message = (
            "Possible fracture region identified "
            "by model attention."
        )

    else:

        message = (
            "Model did not identify a clear "
            "attention region."
        )

    # ---------------------------------------------------------------
    # Response
    # ---------------------------------------------------------------

    response = {
        "prediction": prediction_label,
        "confidence": confidence_pct,
        "possible_region": possible_region,
        "message": message,
        "original_image": encode_image_to_base64(
            original_rgb
        ),
        "analyzed_image": encode_image_to_base64(
            analyzed_rgb
        ),
        "model_accuracy": MODEL_ACCURACY_TEXT,
    }

    return response
