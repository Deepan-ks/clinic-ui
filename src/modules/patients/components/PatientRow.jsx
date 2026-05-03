import { Avatar } from "@/shared/ui/Avatar";
import { Text } from "@/shared/ui/Typography";

const GENDER_BADGE = {
  MALE: "bg-blue-50 text-blue-700",
  FEMALE: "bg-pink-50 text-pink-700",
  OTHER: "bg-gray-100 text-gray-600",
};

// Pencil / edit icon
function PencilIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536M9 11l6.5-6.5a2 2 0 012.828 2.828L11.828 13.828a2 2 0 01-.707.464l-3.121 1.04 1.04-3.121A2 2 0 019 11z"
      />
    </svg>
  );
}

/** Resolve phone number regardless of which field name the API returns */
function resolvePhone(p) {
  return (
    p.patientPhone ||
    p.phone ||
    "—"
  );
}

/** Format a date string / ISO timestamp into a readable short date */
function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PatientRow({ patient, onEdit }) {
  const name = patient.name || patient.patientName || "—";
  const phone = resolvePhone(patient);
  const age = patient.age != null ? `${patient.age} yrs` : "—";
  const gender = patient.gender || null;
  const badgeCls =
    gender ? (GENDER_BADGE[gender] ?? "bg-gray-100 text-gray-600") : "";

  const registered = formatDate(patient.createdDate ?? null);
  const lastUpdated = formatDate(patient.updatedDate ?? patient.updatedAt ?? null);

  return (
    <tr className="border-b border-gray-100 last:border-none hover:bg-blue-50/40 transition-colors group">
      {/* Avatar + Name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={name} size="sm" />
          <Text variant="label-md" as="span" className="text-gray-900">{name}</Text>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 py-3">
        <Text variant="number-sm">{phone}</Text>
      </td>

      {/* Age */}
      <td className="px-4 py-3">
        <Text variant="sm">{age}</Text>
      </td>

      {/* Gender */}
      <td className="px-4 py-3">
        {gender ? (
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${badgeCls}`}
          >
            {gender.charAt(0) + gender.slice(1).toLowerCase()}
          </span>
        ) : (
          <Text variant="sm" className="text-gray-400">—</Text>
        )}
      </td>

      {/* Registered date */}
      <td className="px-4 py-3 whitespace-nowrap">
        <Text variant="number-sm" className="text-gray-500">{registered}</Text>
      </td>

      {/* Last updated date */}
      <td className="px-4 py-3 whitespace-nowrap">
        <Text variant="number-sm" className="text-gray-500">{lastUpdated}</Text>
      </td>

      {/* Actions — icon always visible, highlights on row hover */}
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => onEdit(patient)}
          aria-label={`Edit ${name}`}
          title="Edit patient"
          className="
            inline-flex items-center justify-center
            w-7 h-7 rounded-md
            text-gray-400
            group-hover:text-blue-600 group-hover:bg-blue-100
            hover:!text-blue-700 hover:!bg-blue-200
            focus:outline-none focus:ring-2 focus:ring-blue-400
            transition-colors duration-150
          "
        >
          <PencilIcon />
        </button>
      </td>
    </tr>
  );
}
