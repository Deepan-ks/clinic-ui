import { SearchIcon } from "../icons";

export default function SearchBar({
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <SearchIcon className="w-4 h-4" />
      </span>

      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="
          w-full h-11
          border border-gray-200
          rounded-lg
          pl-10 pr-3
          text-sm text-gray-800
          placeholder:text-gray-400
          bg-white
          focus:outline-none
          focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-50 disabled:text-gray-400
          transition
        "
      />
    </div>
  );
}
