
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* FractureAI Logo */}
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-clinical-700 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
              >
                <path
                  d="M4 9h4l1.5-3 2 6 2-4 1.5 3H20"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span className="text-sm font-semibold text-slate-800">
              FractureAI
            </span>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-slate-400 text-center sm:text-right max-w-md">
            Educational / research project. Not a certified medical device.
            Always consult a qualified healthcare professional.
          </p>
        </div>

        {/* Developer Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">

          <div className="text-center">
            <p className="text-xs text-slate-400">
              Designed & Developed by 
            </p>

            <p className="mt-1 text-base font-semibold text-slate-800">
              Praful Patil
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Lead Developer
            </p>
          </div>

          {/* Social / Contact Icons */}
          <div className="flex items-center gap-3">

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/praful-patil09?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-clinical-700 hover:border-clinical-300 hover:bg-slate-50 transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="currentColor"
              >
                <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2 2 0 1 0 5.25 7 2 2 0 0 0 5.25 3ZM20.44 13.41c0-3.47-1.87-5.09-4.36-5.09-2.01 0-2.91 1.11-3.41 1.89V8.5H9.29V20h3.38v-5.69c0-1.5.28-2.95 2.14-2.95 1.83 0 1.86 1.72 1.86 3.05V20h3.37v-6.59Z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/prafulpatil_3"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-clinical-700 hover:border-clinical-300 hover:bg-slate-50 transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:prafulpatil84593@gmail.com"
              aria-label="Email"
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-clinical-700 hover:border-clinical-300 hover:bg-slate-50 transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </a>

          </div>

          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} Praful Patil. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
