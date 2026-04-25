import { useServiceSearch } from "../../hooks/useServiceSearch";

export default function ServiceSearch({ specializationId, onSelect }) {
  const { query, setQuery, filtered, frequent } =
    useServiceSearch(specializationId);

  const showSearchResults = query.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <p className="text-sm font-semibold mb-2">Search & Add Services</p>

      {/* Input */}
      <input
        type="text"
        placeholder={
          specializationId ? "Search services..." : "Select department first"
        }
        value={query}
        disabled={!specializationId}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 mb-3"
      />

      {/* Frequent services */}
      {!showSearchResults && frequent.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">Frequently used</p>
          <div className="flex flex-wrap gap-2">
            {frequent.map((s) => (
              <Chip key={s.id} service={s} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}

      {/* Search results */}
      {showSearchResults && (
        <div className="flex flex-wrap gap-2">
          {filtered.length > 0 ? (
            filtered.map((s) => (
              <Chip key={s.id} service={s} onSelect={onSelect} />
            ))
          ) : (
            <p className="text-xs text-gray-400">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}

function Chip({ service, onSelect }) {
  return (
    <div
      onClick={() => onSelect(service)}
      className="cursor-pointer px-3 py-1.5 text-sm rounded-full 
                 bg-blue-50 text-blue-700 
                 hover:bg-blue-100 
                 transition"
    >
      {service.name}
    </div>
  );
}
