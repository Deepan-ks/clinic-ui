import SearchBar from "../ui/SearchBar";
import DateFilter from "./DateFilter";

export default function BillsFilterBar({
  search,
  onSearchChange,
  onRangeChange,
  disabled = false,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col md:flex-row md:items-center gap-4">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <SearchBar
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search patient or phone..."
          loading={disabled}
        />
      </div>

      {/* Date filter */}
      <div className="flex items-center gap-2">
        <DateFilter onRangeChange={onRangeChange} disabled={disabled} />
      </div>
    </div>
  );
}
