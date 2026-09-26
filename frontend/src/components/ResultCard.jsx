export default function ResultCard({ result }) {
  const isFractured = result.prediction === "FRACTURED";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">AI Result</p>
          <p
            className={`mt-1 text-3xl font-semibold tracking-tight ${
              isFractured ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {result.prediction}
          </p>
        </div>

        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            isFractured
              ? "bg-red-50 text-red-700 border border-red-100"
              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
          }`}
        >
          {isFractured ? "Possible fracture detected" : "No fracture pattern detected"}
        </span>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-slate-600 font-medium">Confidence</span>
          <span className="text-slate-900 font-semibold">{result.confidence.toFixed(2)}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full ${isFractured ? "bg-red-500" : "bg-emerald-500"}`}
            style={{ width: `${Math.min(result.confidence, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Model confidence is not equivalent to clinical certainty.
        </p>
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
        <p className="text-sm font-medium text-slate-800">
          {result.possible_region ? "Possible Fracture Region" : "No clear attention region was identified"}
        </p>
        <p className="mt-1 text-sm text-slate-500 leading-relaxed">
          {result.possible_region
            ? "The highlighted area represents the region receiving strong attention from the AI model. It is not a confirmed fracture boundary."
            : "The model did not identify a clear attention region for this image."}
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="rounded-lg border border-slate-200 p-3">
          <dt className="text-slate-500">Prediction</dt>
          <dd className="mt-1 font-semibold text-slate-900">{result.prediction}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <dt className="text-slate-500">Confidence</dt>
          <dd className="mt-1 font-semibold text-slate-900">{result.confidence.toFixed(2)}%</dd>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <dt className="text-slate-500">Attention</dt>
          <dd className="mt-1 font-semibold text-slate-900">
            {result.possible_region ? "Region identified" : "No region found"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
