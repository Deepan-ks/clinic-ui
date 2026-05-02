import PatientRow from "./PatientRow";
import TableSkeleton from "../common/TableSkeleton";
import { Text } from "../ui/Typography";

/** Small sort-indicator arrow */
function SortIcon({ active, dir }) {
  return (
    <span
      className={`ml-1 inline-flex flex-col leading-none transition-colors ${active ? "text-blue-600" : "text-gray-300"
        }`}
    >
      <svg
        className={`w-3 h-3 -mb-0.5 transition-transform ${active && dir === "asc" ? "text-blue-600" : ""
          }`}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 0L10 6H0z" />
      </svg>
      <svg
        className={`w-3 h-3 transition-transform ${active && dir === "desc" ? "text-blue-600" : ""
          }`}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 6L0 0h10z" />
      </svg>
    </span>
  );
}

/** Clickable sortable column header */
function SortTh({ label, field, sort, sortDir, onSort }) {
  const active = sort === field;
  return (
    <th
      className="px-4 py-3 text-left select-none"
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-0.5 hover:text-gray-800 transition-colors"
      >
        <Text variant="xs" as="span" className="inherit">{label}</Text>
        <SortIcon active={active} dir={sortDir} />
      </button>
    </th>
  );
}

export default function PatientsTable({
  patients,
  loading,
  sort,
  sortDir,
  onSort,
  onEdit,
}) {
  if (loading) {
    return <TableSkeleton columns={7} rows={8} />;
  }

  if (!patients.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
        <div className="flex justify-center mb-3">
          <svg
            className="w-10 h-10 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.3}
              d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z"
            />
          </svg>
        </div>
        <Text variant="label-md" className="text-gray-700">No patients found</Text>
        <Text variant="helper" className="mt-1">
          Try a different search, or add a new patient.
        </Text>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full border-collapse table-fixed">
        {/* Explicit column widths so the browser doesn't guess */}
        <colgroup>
          <col style={{ width: "26%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "7%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "7%" }} />
        </colgroup>

        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {/* Sortable: Name */}
            <SortTh
              label="PATIENT NAME"
              field="name"
              sort={sort}
              sortDir={sortDir}
              onSort={onSort}
            />

            <th className="px-4 py-3 text-left">
              <Text variant="xs">Phone</Text>
            </th>
            <th className="px-4 py-3 text-left">
              <Text variant="xs">Age</Text>
            </th>
            <th className="px-4 py-3 text-left">
              <Text variant="xs">Gender</Text>
            </th>

            {/* Sortable: Registered On */}
            <SortTh
              label="REGISTERED ON"
              field="createdDate"
              sort={sort}
              sortDir={sortDir}
              onSort={onSort}
            />

            <th className="px-4 py-3 text-left">
              <Text variant="xs">Last Updated</Text>
            </th>

            <th className="px-4 py-3 text-left">
              <Text variant="xs">Actions</Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, idx) => (
            <PatientRow
              key={patient.id ?? patient.patientId ?? `patient-${idx}`}
              patient={patient}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
