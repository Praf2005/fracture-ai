# FractureAI Backend

FastAPI service that loads your trained MobileNetV2-based fracture
classifier once at startup and serves Grad-CAM-based predictions.

## 1. Place your model

Copy your trained model file to:

```
backend/models/fracture_model.keras
```

If your file has a different name, edit `MODEL_PATH` at the top of
`main.py`.

## 2. Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

## 3. Run

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.
Check `http://localhost:8000/health` to confirm the model loaded.

## Endpoint

`POST /predict` — multipart/form-data with a `file` field (JPG/PNG/WEBP).

Returns JSON:

```json
{
  "prediction": "FRACTURED",
  "confidence": 94.52,
  "possible_region": { "x": 120, "y": 80, "width": 250, "height": 180 },
  "message": "Possible fracture region identified by model attention.",
  "original_image": "data:image/jpeg;base64,...",
  "analyzed_image": "data:image/jpeg;base64,...",
  "model_accuracy": "[ADD ACTUAL TEST ACCURACY HERE]"
}
```

`possible_region` is `null` when Grad-CAM did not find a strong
attention region — the frontend shows "No clear attention region was
identified" in that case.

## Notes

- The model is loaded once in `load_model()` at server startup, not
  per-request.
- Images are processed in memory only; nothing is written to disk.
- Grad-CAM automatically finds the MobileNetV2 sub-model and its last
  Conv2D layer at runtime — no layer names are hardcoded.
- This tool is for educational/research purposes only and does not
  provide a medical diagnosis.
