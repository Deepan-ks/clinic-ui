import SearchBar from "@/shared/ui/SearchBar";

export default function PatientsFilterBar({
  search,
  onSearchChange,
  onAdd,
  disabled = false,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="w-full sm:max-w-md">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">
          Search (Name / Phone)
        </label>
        <SearchBar
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Type patient name or phone…"
          loading={disabled}
        />
      </div>

      <button
        id="add-patient-btn"
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Patient
      </button>
    </div>
  );
}
