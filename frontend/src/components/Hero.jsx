export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-clinical-100 blur-3xl opacity-70" />
        <div className="absolute top-40 -left-24 w-72 h-72 rounded-full bg-clinical-50 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-medium text-clinical-700 bg-clinical-50 border border-clinical-100 rounded-full px-3 py-1">
            Research &amp; education tool
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 leading-[1.1]">
            AI-Powered X-Ray Fracture Detection
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-md leading-relaxed">
            Upload an X-ray image and use an AI model to analyze it for
            possible fracture patterns and visualize the region receiving
            the model's attention.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#analyze"
              className="inline-flex items-center rounded-full bg-clinical-700 text-white font-medium px-6 py-3 hover:bg-clinical-800 transition-colors"
            >
              Analyze X-Ray
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center rounded-full border border-slate-300 text-slate-700 font-medium px-6 py-3 hover:border-clinical-400 hover:text-clinical-700 transition-colors"
            >
              How It Works
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="aspect-square rounded-xl bg-slate-900 relative overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 opacity-90">
                <rect x="70" y="10" width="20" height="180" rx="6" fill="#e2e8f0" />
                <rect x="60" y="30" width="80" height="14" rx="4" fill="#e2e8f0" />
                <rect x="60" y="150" width="80" height="14" rx="4" fill="#e2e8f0" />
                <rect
                  x="72"
                  y="92"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="2.5"
                  rx="3"
                />
              </svg>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 bg-slate-900/60 backdrop-blur rounded-lg px-3 py-1.5">
                <span>Model attention</span>
                <span className="text-clinical-300 font-medium">active</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Confidence</span>
              <span className="font-semibold text-slate-900">94.52%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-[95%] bg-clinical-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
