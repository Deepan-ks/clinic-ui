import { fmt } from "@/lib/utils/formatters";
import LoadingButton from "@/shared/ui/LoadingButton";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export default function BillRow({ bill, downloadingId, onView, onDownload }) {
  const id = bill.id ?? bill.billId;
  const billNumber = bill.billNumber ?? bill.invoiceNumber ?? "-";
  const patientName = bill.patientName ?? bill.patient?.name ?? "-";
  const phone = bill.patientPhone ?? bill.phone ?? bill.patient?.phone ?? "-";
  const createdAt = bill.createdTime ?? "-";
  const total = bill.grandTotal ?? 0;
  const isDownloading = Boolean(id && downloadingId === id);

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-4 py-3 text-sm text-gray-700 font-medium">
        {billNumber}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{patientName}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{phone}</td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {formatDate(createdAt)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 font-semibold">
        {fmt(total)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {/* View Icon Button */}
          <button
            type="button"
            onClick={() => onView(id)}
            disabled={!id || isDownloading}
            title="View/Edit Bill"
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:text-gray-300 disabled:bg-transparent"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>

          {/* Download Icon Button */}
          <button
            type="button"
            onClick={() => onDownload(id, billNumber)}
            disabled={!id || isDownloading}
            title="Download Invoice PDF"
            className={`p-2 rounded-lg transition-colors ${
              isDownloading
                ? "text-gray-400 bg-gray-50 cursor-wait"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            } disabled:text-gray-300 disabled:bg-transparent`}
          >
            {isDownloading ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
