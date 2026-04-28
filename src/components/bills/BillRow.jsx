import { fmt } from "../../utils/formatters";
import LoadingButton from "../common/LoadingButton";

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
  const createdAt = bill.createdAt ?? bill.billDate ?? bill.date;
  const total = bill.totalAmount ?? bill.total ?? bill.netAmount ?? 0;
  const isDownloading = Boolean(id && downloadingId === id);

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-4 py-3 text-sm text-gray-700 font-medium">{billNumber}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{patientName}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{phone}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(createdAt)}</td>
      <td className="px-4 py-3 text-sm text-gray-700 font-semibold">{fmt(total)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(id)}
            disabled={!id || isDownloading}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400"
          >
            View
          </button>
          <LoadingButton
            onClick={() => onDownload(id, billNumber)}
            isLoading={isDownloading}
            disabled={!id}
            label="Download PDF"
            loadingLabel="Downloading..."
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
          />
        </div>
      </td>
    </tr>
  );
}

