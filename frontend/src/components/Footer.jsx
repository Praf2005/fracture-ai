export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-clinical-700 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <path
                d="M4 9h4l1.5-3 2 6 2-4 1.5 3H20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-sm font-semibold text-slate-800">FractureAI</span>
        </div>
        <p className="text-xs text-slate-400 text-center sm:text-right max-w-md">
          Educational / research project. Not a certified medical device.
          Always consult a qualified healthcare professional.
        </p>
      </div>
    </footer>
  );
}
