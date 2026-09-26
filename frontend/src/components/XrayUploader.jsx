import { useRef } from "react";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE_MB = 10;

export default function XrayUploader({ onFileSelected, onError }) {
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  function validateAndEmit(file) {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError("Unsupported image format. Please upload a JPG, PNG, or WEBP file.");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      onError(`File too large. Please upload an image under ${MAX_SIZE_MB} MB.`);
      return;
    }

    onFileSelected(file);
  }

  function handleGalleryChange(event) {
    const file = event.target.files?.[0];
    validateAndEmit(file);
    event.target.value = "";
  }

  function handleCameraChange(event) {
    const file = event.target.files?.[0];
    validateAndEmit(file);
    event.target.value = "";
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <div className="mx-auto w-14 h-14 rounded-xl bg-clinical-50 border border-clinical-100 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-clinical-700" fill="none">
          <path
            d="M12 16V4m0 0L7 9m5-5l5 5M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">Upload X-Ray</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
        Select an X-ray image from your device or use your camera.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full bg-clinical-700 text-white text-sm font-medium px-5 py-2.5 hover:bg-clinical-800 transition-colors"
        >
          Upload from Gallery
        </button>

        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 text-slate-700 text-sm font-medium px-5 py-2.5 hover:border-clinical-400 hover:text-clinical-700 transition-colors"
        >
          Take X-Ray Photo
        </button>
      </div>

      <p className="mt-4 text-xs text-slate-400">JPG, PNG, or WEBP — up to {MAX_SIZE_MB} MB</p>

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleGalleryChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        capture="environment"
        className="hidden"
        onChange={handleCameraChange}
      />
    </div>
  );
}
