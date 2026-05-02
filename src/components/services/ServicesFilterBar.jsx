import SearchBar from "../ui/SearchBar";

export default function ServicesFilterBar({
  search,
  onSearchChange,
  specializationId,
  onSpecializationChange,
  specializations,
  onAdd,
  disabled = false,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        {/* Search */}
        <div className="w-full sm:max-w-xs">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            Search
          </label>
          <SearchBar
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Service name…"
            loading={disabled}
          />
        </div>

        {/* Specialization filter */}
        <div className="w-full sm:w-52">
          <label htmlFor="svc-spec-filter" className="block text-xs font-semibold text-gray-500 mb-1.5">
            Specialization
          </label>
          <select
            id="svc-spec-filter"
            value={specializationId}
            onChange={(e) => onSpecializationChange(e.target.value)}
            disabled={disabled}
            className="w-full h-11 border border-gray-200 rounded-lg px-3 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 transition"
          >
            <option value="">All Specializations</option>
            {specializations.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        id="add-service-btn"
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 whitespace-nowrap"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Add Service
      </button>
    </div>
  );
}
