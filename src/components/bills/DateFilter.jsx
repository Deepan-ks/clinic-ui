// DateFilter — preset + custom range picker for Bills
import { useState, useEffect } from "react";

const today = () => new Date().toISOString().slice(0, 10);

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function monthsAgo(n) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().slice(0, 10);
}

const PRESETS = [
  { label: "Today",        value: "today",    getRange: () => ({ from: today(),        to: today() }) },
  { label: "Last 7 Days",  value: "7d",       getRange: () => ({ from: daysAgo(6),     to: today() }) },
  { label: "Last 30 Days", value: "30d",      getRange: () => ({ from: daysAgo(29),    to: today() }) },
  { label: "Last 6 Months",value: "6m",       getRange: () => ({ from: monthsAgo(6),   to: today() }) },
  { label: "Custom Range", value: "custom",   getRange: null },
];

const DEFAULT_PRESET = "7d";

export default function DateFilter({ onRangeChange, disabled = false }) {
  const [preset, setPreset] = useState(DEFAULT_PRESET);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo]     = useState("");

  // Fire on mount with default preset
  useEffect(() => {
    const p = PRESETS.find((p) => p.value === DEFAULT_PRESET);
    if (p?.getRange) {
      const { from, to } = p.getRange();
      onRangeChange(from, to);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePreset = (p) => {
    setPreset(p.value);
    if (p.getRange) {
      const { from, to } = p.getRange();
      setCustomFrom("");
      setCustomTo("");
      onRangeChange(from, to);
    }
  };

  const handleCustomFrom = (val) => {
    setCustomFrom(val);
    if (val && customTo) onRangeChange(val, customTo);
  };

  const handleCustomTo = (val) => {
    setCustomTo(val);
    if (customFrom && val) onRangeChange(customFrom, val);
  };

  const activeLabel = PRESETS.find((p) => p.value === preset)?.label ?? "";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            disabled={disabled}
            onClick={() => handlePreset(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition whitespace-nowrap ${
              preset === p.value
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex items-center gap-2 mt-1">
          <input
            type="date"
            value={customFrom}
            max={customTo || today()}
            onChange={(e) => handleCustomFrom(e.target.value)}
            disabled={disabled}
            className="h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="date"
            value={customTo}
            min={customFrom}
            max={today()}
            onChange={(e) => handleCustomTo(e.target.value)}
            disabled={disabled}
            className="h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
      )}

      {preset !== "custom" && (
        <p className="text-xs text-gray-400">
          Showing: <span className="font-medium text-gray-600">{activeLabel}</span>
        </p>
      )}
    </div>
  );
}
