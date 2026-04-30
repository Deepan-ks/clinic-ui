import SearchBar from "../ui/SearchBar";
import DateFilter from "./DateFilter";

export default function BillsFilterBar({
  search,
  onSearchChange,
  onRangeChange,
  disabled = false,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      {/* Search */}
      <div className="w-full lg:max-w-sm">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">
          Search (Patient Name / Phone)
        </label>
        <SearchBar
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Type patient name or phone"
          disabled={disabled}
        />
      </div>

      {/* Date filter */}
      <div className="flex flex-col gap-1">
        <label className="block text-xs font-semibold text-gray-500 mb-0.5">
          Date Range
        </label>
        <DateFilter onRangeChange={onRangeChange} disabled={disabled} />
      </div>
    </div>
  );
}
