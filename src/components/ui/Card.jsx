// ── CARD SECTION ─────────────────────────────────────────────────

export function Card({ label, complete, children }) {
  return (
    <div
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all ${
        complete ? "border-emerald-200" : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            complete ? "bg-emerald-500" : "bg-gray-200"
          }`}
        >
          {complete && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <h3
          className={`text-sm font-bold tracking-tight ${
            complete ? "text-emerald-700" : "text-gray-700"
          }`}
        >
          {label}
        </h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
