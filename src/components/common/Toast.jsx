export default function Toast({ type = "info", message, onClose }) {
  const toneClass = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  }[type] || "border-gray-200 bg-white text-gray-800";

  return (
    <div className={`w-80 border rounded-xl shadow-sm px-4 py-3 ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium leading-snug">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          x
        </button>
      </div>
    </div>
  );
}

