import { useState } from "react";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Analyze X-Ray", href: "#analyze" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-clinical-700 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none">
              <path
                d="M4 9h4l1.5-3 2 6 2-4 1.5 3H20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            FractureAI
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 hover:text-clinical-700 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#analyze"
          className="hidden md:inline-flex items-center rounded-full bg-clinical-700 text-white text-sm font-medium px-4 py-2 hover:bg-clinical-800 transition-colors"
        >
          Analyze X-Ray
        </a>

        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-5 py-4 flex flex-col gap-4">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-slate-700"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
