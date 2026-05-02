export default function TableSkeleton({ columns = 5, rows = 5 }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div
        className="grid gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <div key={`h-${index}`} className="h-3 bg-gray-200 rounded" />
        ))}
      </div>

      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={`r-${rowIdx}`}
            className="grid gap-3 px-4 py-4"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((__, colIdx) => (
              <div key={`c-${rowIdx}-${colIdx}`} className="h-3 bg-gray-100 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

