export default function Disclaimer() {
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-16 md:pb-20">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8 flex gap-4">
        <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0 text-amber-600 mt-0.5" fill="none">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86l-8.4 14.56A1.5 1.5 0 003.17 21h17.66a1.5 1.5 0 001.28-2.58l-8.4-14.56a1.5 1.5 0 00-2.56 0z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <h3 className="font-semibold text-amber-900">Important Disclaimer</h3>
          <p className="mt-1.5 text-sm text-amber-800 leading-relaxed">
            This tool is for educational and research purposes only. It is not
            a medical diagnostic system. The results shown, including any
            prediction, confidence score, or highlighted region, are not a
            medical diagnosis and should not replace evaluation by a
            qualified doctor or radiologist. Always consult a qualified
            healthcare professional for interpretation of X-ray images.
          </p>
        </div>
      </div>
    </section>
  );
}
