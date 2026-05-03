function PencilIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.232 5.232l3.536 3.536M9 11l6.5-6.5a2 2 0 012.828 2.828L11.828 13.828a2 2 0 01-.707.464l-3.121 1.04 1.04-3.121A2 2 0 019 11z" />
    </svg>
  );
}

export default function SpecializationList({ specializations, loading, onEdit }) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-5 py-3.5 flex items-center justify-between">
            <div className="h-3.5 w-40 bg-gray-200 rounded" />
            <div className="h-7 w-7 bg-gray-100 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (!specializations.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
        <p className="text-sm font-semibold text-gray-700">No specializations yet</p>
        <p className="text-xs text-gray-400 mt-1">Click "Add Specialization" to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <ul className="divide-y divide-gray-100">
        {specializations.map((spec) => (
          <li
            key={spec.id}
            className="flex items-center justify-between px-5 py-3.5 group hover:bg-blue-50/40 transition-colors"
          >
            <span className="text-sm font-medium text-gray-800">{spec.name}</span>
            <button
              type="button"
              onClick={() => onEdit(spec)}
              aria-label={`Edit ${spec.name}`}
              title="Edit"
              className="inline-flex items-center justify-center w-7 h-7 rounded-md
                text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100
                hover:!text-blue-700 hover:!bg-blue-200
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition-colors duration-150"
            >
              <PencilIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
