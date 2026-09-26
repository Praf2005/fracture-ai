const SPECS = [
  { label: "Framework", value: "TensorFlow / Keras" },
  { label: "Base architecture", value: "MobileNetV2 (transfer learning)" },
  { label: "Input size", value: "224 × 224" },
  { label: "Task", value: "Binary classification" },
  { label: "Explainability", value: "Grad-CAM visualization" },
];

export default function AboutModel() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 grid md:grid-cols-[1fr_1px_1fr] gap-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">About the Model</h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            FractureAI uses a MobileNetV2-based convolutional neural network,
            fine-tuned via transfer learning to classify X-ray images as
            fractured or not fractured. Grad-CAM is used to visualize which
            regions of the image most influenced the model's prediction.
          </p>

          <dl className="mt-6 space-y-3">
            {SPECS.map((spec) => (
              <div key={spec.label} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                <dt className="text-slate-500">{spec.label}</dt>
                <dd className="font-medium text-slate-800">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hidden md:block bg-slate-100" />

        <div className="flex flex-col justify-center">
          <p className="text-sm text-slate-500">Model Accuracy</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            [ADD ACTUAL TEST ACCURACY HERE]
          </p>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Replace this value with your model's measured test-set accuracy
            once evaluation is complete. This project does not display an
            invented or estimated accuracy figure.
          </p>
        </div>
      </div>
    </section>
  );
}
