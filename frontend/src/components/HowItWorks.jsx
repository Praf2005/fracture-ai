const STEPS = [
  {
    title: "Upload X-Ray",
    description: "Choose an X-ray image from your device or camera.",
  },
  {
    title: "AI Analysis",
    description: "The TensorFlow/Keras model processes the X-ray.",
  },
  {
    title: "Fracture Prediction",
    description: "The model predicts fractured or not fractured.",
  },
  {
    title: "Region Visualization",
    description: "Grad-CAM highlights the region receiving strong model attention.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <div className="max-w-xl">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">How It Works</h2>
        <p className="mt-3 text-slate-600">
          From image upload to model attention visualization, in four steps.
        </p>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-clinical-200 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-clinical-50 border border-clinical-100 flex items-center justify-center text-clinical-700 font-semibold text-sm">
              {index + 1}
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
