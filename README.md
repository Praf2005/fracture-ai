# FractureAI

An educational/research web app for AI-based X-ray fracture detection with
Grad-CAM "possible fracture region" visualization.

**This is not a medical diagnostic system.** Predictions and highlighted
regions are model attention visualizations, not confirmed fracture
boundaries. Always consult a qualified healthcare professional.

## Structure

```
fracture-ai/
├── frontend/   React + Vite + Tailwind (JavaScript, no TypeScript)
└── backend/    FastAPI + TensorFlow/Keras + OpenCV
```

## 1. Add your trained model

Copy your trained `.keras` file to:

```
backend/models/fracture_model.keras
```

(Rename in `MODEL_PATH` inside `backend/main.py` if your filename differs.)

## 2. Run the backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Visit `http://localhost:8000/health` — it should report `model_loaded: true`.

## 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`.

The frontend reads the backend URL from `frontend/.env`
(`VITE_API_URL=http://localhost:8000`) — change it if your backend runs
elsewhere.

## How prediction + Grad-CAM work together

1. The uploaded image is resized to 224×224 and sent to the loaded Keras
   model exactly as it was trained (raw pixel values — the model's own
   `Rescaling` layer normalizes them).
2. The model outputs a sigmoid value: because training used class folders
   `fractured` (label 0) and `not fractured` (label 1), this value is
   `P(not fractured)`.
3. For Grad-CAM, the backend automatically locates the MobileNetV2
   sub-model inside the loaded model and its last `Conv2D` layer (no
   hardcoded layer names), then computes gradients of the fracture score
   (`1 - prediction`) with respect to that layer's output.
4. The resulting heatmap is resized to the original image size,
   thresholded, and the largest contour becomes the "Possible Fracture
   Region" bounding box. If no contour clears the threshold, no box is
   drawn and the UI shows "No clear attention region was identified."

## Notes

- The model loads once at server startup, not on every request.
- Uploaded images are processed in memory only — nothing is written to disk.
- CORS is restricted to the frontend's local dev origin.
