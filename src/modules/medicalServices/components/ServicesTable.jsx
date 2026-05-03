import TableSkeleton from "@/shared/ui/TableSkeleton";

function PencilIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.232 5.232l3.536 3.536M9 11l6.5-6.5a2 2 0 012.828 2.828L11.828 13.828a2 2 0 01-.707.464l-3.121 1.04 1.04-3.121A2 2 0 019 11z" />
    </svg>
  );
}

function fmt(n) {
  return "₹" + Number(n || 0).toFixed(2);
}

export default function ServicesTable({ services, loading, onEdit, specializations = [] }) {
  // Build a quick-lookup map id → name so we can resolve names even when
  // the API only returns specializationId (not specializationName)
  const specMap = Object.fromEntries(
    specializations.map((s) => [String(s.id), s.name]),
  );

  if (loading) return <TableSkeleton columns={5} rows={8} />;

  if (!services.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
        <p className="text-sm font-semibold text-gray-700">No services found</p>
        <p className="text-xs text-gray-400 mt-1">Try a different filter, or add a new service.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full border-collapse table-fixed">
        <colgroup>
          <col style={{ width: "32%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "24%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "8%" }} />
        </colgroup>
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Service Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Specialization
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {services.map((svc, idx) => {
            const specName =
              svc.specializationName ||
              svc.specialization?.name ||
              specMap[String(svc.specializationId)] ||
              "—";
            const active = svc.active ?? svc.isActive ?? true;

            return (
              <tr
                key={svc.id ?? `svc-${idx}`}
                className="border-b border-gray-100 last:border-none hover:bg-blue-50/40 transition-colors group"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900 truncate">
                  {svc.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 tabular-nums">
                  {fmt(svc.price)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 truncate">
                  {specName}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onEdit(svc)}
                    aria-label={`Edit ${svc.name}`}
                    title="Edit service"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md
                      text-gray-400
                      group-hover:text-blue-600 group-hover:bg-blue-100
                      hover:!text-blue-700 hover:!bg-blue-200
                      focus:outline-none focus:ring-2 focus:ring-blue-400
                      transition-colors duration-150"
                  >
                    <PencilIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
