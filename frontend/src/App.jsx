import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import XrayUploader from "./components/XrayUploader.jsx";
import ImagePreview from "./components/ImagePreview.jsx";
import ResultCard from "./components/ResultCard.jsx";
import ImageComparison from "./components/ImageComparison.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import AboutModel from "./components/AboutModel.jsx";
import Disclaimer from "./components/Disclaimer.jsx";
import Footer from "./components/Footer.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LOADING_MESSAGES = [
  "Analyzing X-ray...",
  "Running fracture detection model...",
  "Generating attention map...",
];

function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 flex flex-col items-center text-center shadow-sm">
      <div className="w-12 h-12 rounded-full border-4 border-clinical-100 border-t-clinical-700 animate-spin" />
      <p className="mt-5 font-medium text-slate-800">{LOADING_MESSAGES[messageIndex]}</p>
      <p className="mt-1 text-sm text-slate-400">This usually takes a few seconds.</p>
    </div>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function handleFileSelected(selectedFile) {
    setError(null);
    setResult(null);

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(selectedFile);
    objectUrlRef.current = url;

    setFile(selectedFile);
    setPreviewUrl(url);
  }

  function handleRemove() {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  }

  function handleAnalyzeAnother() {
    handleRemove();
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let detail = "Unable to analyze this image. Please try another X-ray.";
        try {
          const data = await response.json();
          if (data?.detail) detail = data.detail;
        } catch {
          // ignore JSON parse failure, use default message
        }
        throw new Error(detail);
      }

      const data = await response.json();

      if (
        typeof data.prediction !== "string" ||
        typeof data.confidence !== "number" ||
        typeof data.original_image !== "string" ||
        typeof data.analyzed_image !== "string"
      ) {
        throw new Error("Received an unexpected response from the server.");
      }

      setResult(data);
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Could not reach the analysis server. Make sure the backend is running and try again."
        );
      } else {
        setError(err.message || "Unable to analyze this image. Please try another X-ray.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />

        <section id="analyze" className="max-w-4xl mx-auto px-5 sm:px-8 py-16 md:py-20">
          <div className="max-w-xl mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Analyze X-Ray
            </h2>
            <p className="mt-3 text-slate-600">
              Select an X-ray image from your device or use your camera.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {!file && (
              <XrayUploader onFileSelected={handleFileSelected} onError={setError} />
            )}

            {file && !loading && !result && (
              <ImagePreview
                file={file}
                previewUrl={previewUrl}
                onRemove={handleRemove}
                onAnalyze={handleAnalyze}
                loading={loading}
              />
            )}

            {loading && <LoadingState />}

            {result && !loading && (
              <div className="space-y-6">
                <ResultCard result={result} />
                <ImageComparison
                  originalImage={result.original_image}
                  analyzedImage={result.analyzed_image}
                  hasRegion={Boolean(result.possible_region)}
                />
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleAnalyzeAnother}
                    className="inline-flex items-center rounded-full border border-slate-300 text-slate-700 text-sm font-medium px-6 py-2.5 hover:border-clinical-400 hover:text-clinical-700 transition-colors"
                  >
                    Analyze Another X-Ray
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <HowItWorks />
        <AboutModel />
        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
}
