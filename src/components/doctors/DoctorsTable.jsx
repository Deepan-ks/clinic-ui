import TableSkeleton from "../common/TableSkeleton";
import { Avatar } from "../ui/Avatar";

function PencilIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.232 5.232l3.536 3.536M9 11l6.5-6.5a2 2 0 012.828 2.828L11.828 13.828a2 2 0 01-.707.464l-3.121 1.04 1.04-3.121A2 2 0 019 11z" />
    </svg>
  );
}

export default function DoctorsTable({ doctors, loading, onEdit }) {
  if (loading) return <TableSkeleton columns={5} rows={8} />;

  if (!doctors.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
        <div className="flex justify-center mb-3">
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-700">No doctors found</p>
        <p className="text-xs text-gray-400 mt-1">Click "Add Doctor" to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full border-collapse table-fixed">
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "24%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "8%" }} />
        </colgroup>
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Doctor
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Specialization
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Phone
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
          {doctors.map((doc, idx) => {
            const name = doc.doctorName ?? "—";
            const specName =
              doc.specializationName ?? doc.specialization?.name ?? "—";
            const phone =
              doc.phone ?? doc.phoneNumber ?? "—";
            const active = doc.active ?? doc.isActive ?? true;

            return (
              <tr
                key={doc.id ?? `doc-${idx}`}
                className="border-b border-gray-100 last:border-none hover:bg-blue-50/40 transition-colors group"
              >
                {/* Avatar + Name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={name} size="sm" />
                    <span className="text-sm font-medium text-gray-900 truncate">{name}</span>
                  </div>
                </td>

                {/* Specialization */}
                <td className="px-4 py-3 text-sm text-gray-600 truncate">{specName}</td>

                {/* Phone */}
                <td className="px-4 py-3 text-sm text-gray-600 tabular-nums">{phone}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onEdit(doc)}
                    aria-label={`Edit ${name}`}
                    title="Edit doctor"
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
