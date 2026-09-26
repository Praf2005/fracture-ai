function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImagePreview({ file, previewUrl, onRemove, onAnalyze, loading }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid sm:grid-cols-[220px_1fr] gap-6">
        <div className="rounded-xl overflow-hidden bg-slate-900 aspect-square">
          <img src={previewUrl} alt="Selected X-ray preview" className="w-full h-full object-contain" />
        </div>

        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-slate-900">Ready to analyze</h3>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex gap-2">
              <dt className="text-slate-500 w-20 shrink-0">File name</dt>
              <dd className="text-slate-800 break-all">{file.name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500 w-20 shrink-0">File size</dt>
              <dd className="text-slate-800">{formatFileSize(file.size)}</dd>
            </div>
          </dl>

          <div className="mt-auto pt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onAnalyze}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-clinical-700 text-white text-sm font-medium px-6 py-2.5 hover:bg-clinical-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Analyze X-Ray"}
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 text-slate-600 text-sm font-medium px-5 py-2.5 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
