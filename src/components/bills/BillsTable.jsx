import BillRow from "./BillRow";
import TableSkeleton from "../common/TableSkeleton";

export default function BillsTable({
  bills,
  loading,
  downloadingId,
  onView,
  onDownload,
}) {
  if (loading) {
    return <TableSkeleton columns={6} rows={7} />;
  }

  if (!bills.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-sm font-semibold text-gray-700">No bills found</p>
        <p className="text-xs text-gray-500 mt-1">
          Try changing search text or date filter.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Bill #
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Patient
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Phone
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill, index) => (
            <BillRow
              key={bill.id ?? bill.billId ?? `${bill.billNumber ?? "bill"}-${index}`}
              bill={bill}
              downloadingId={downloadingId}
              onView={onView}
              onDownload={onDownload}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

