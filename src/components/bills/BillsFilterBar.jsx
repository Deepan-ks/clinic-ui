import SearchBar from "../ui/SearchBar";

export default function BillsFilterBar({
  search,
  date,
  onSearchChange,
  onDateChange,
  disabled = false,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="w-full md:max-w-md">
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

      <div className="w-full md:w-56">
        <label
          htmlFor="bill-date"
          className="block text-xs font-semibold text-gray-500 mb-1.5"
        >
          Date
        </label>
        <input
          id="bill-date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          disabled={disabled}
          className="w-full h-11 border border-gray-200 rounded-lg px-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
        />
      </div>
    </div>
  );
}

