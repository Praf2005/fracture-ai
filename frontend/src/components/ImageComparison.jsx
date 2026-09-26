import { useState } from "react";

function Panel({ title, imageSrc, badge, onZoom }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{title}</span>
        {badge}
      </div>
      <button
        type="button"
        onClick={onZoom}
        className="block w-full aspect-square bg-slate-900 cursor-zoom-in"
        aria-label={`Zoom ${title}`}
      >
        <img src={imageSrc} alt={title} className="w-full h-full object-contain" />
      </button>
    </div>
  );
}

export default function ImageComparison({ originalImage, analyzedImage, hasRegion }) {
  const [zoomedImage, setZoomedImage] = useState(null);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Image Comparison</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <Panel
          title="Original X-Ray"
          imageSrc={originalImage}
          onZoom={() => setZoomedImage(originalImage)}
        />
        <Panel
          title="AI Analysis"
          imageSrc={analyzedImage}
          badge={
            hasRegion ? (
              <span className="text-[11px] font-medium text-clinical-700 bg-clinical-50 border border-clinical-100 rounded-full px-2 py-0.5">
                Possible Fracture Region
              </span>
            ) : null
          }
          onZoom={() => setZoomedImage(analyzedImage)}
        />
      </div>

      <p className="mt-3 text-xs text-slate-400">Tap an image to zoom.</p>

      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="Zoomed X-ray"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            type="button"
            onClick={() => setZoomedImage(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white"
            aria-label="Close zoom"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
