import { useServiceSearch } from "../../hooks/useServiceSearch";
import { SearchIcon } from "../icons";
import { StepStatus } from "../ui/StepStatus";

export default function ServiceSearch({
  specializationId,
  onSelect,
  cart = [],
}) {
  const { query, setQuery, filtered, frequent } =
    useServiceSearch(specializationId);

  const showSearchResults = query.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <StepStatus active completed={false} />
        <p className="font-semibold text-sm">Add Services</p>
      </div>

      <div className="p-4">
        {/* Search Input */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </span>

          <input
            type="text"
            placeholder={
              specializationId
                ? "Search services..."
                : "Select department first"
            }
            value={query}
            disabled={!specializationId}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Frequent */}
        {!showSearchResults && frequent.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-2">Frequently used</p>

            <div className="flex flex-wrap gap-2">
              {frequent.map((s) => (
                <Chip
                  key={s.id}
                  service={s}
                  onSelect={onSelect}
                  selected={cart.some((c) => c.id === s.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Search Results */}
        {showSearchResults && (
          <div className="flex flex-wrap gap-2">
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <Chip
                  key={s.id}
                  service={s}
                  onSelect={onSelect}
                  selected={cart.some((c) => c.id === s.id)}
                />
              ))
            ) : (
              <p className="text-xs text-gray-400">No results found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ service, onSelect, selected }) {
  return (
    <div
      onClick={() => onSelect(service)}
      className={`
        px-3 py-1.5 text-sm rounded-full cursor-pointer transition
        ${
          selected
            ? "bg-blue-600 text-white scale-105"
            : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }
      `}
    >
      {service.name}
    </div>
  );
}
