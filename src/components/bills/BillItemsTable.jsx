import { fmt } from "../../utils/formatters";
import TableSkeleton from "../common/TableSkeleton";

export default function BillItemsTable({ items, loading }) {
  if (loading) {
    return <TableSkeleton columns={4} rows={6} />;
  }

  if (!items.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-sm font-semibold text-gray-700">No line items found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Service
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Quantity
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Total
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <tbody>
            {items.map((item, index) => (
              <tr
                key={`${item.id ?? item.name ?? "item"}-${index}`}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-4 py-3 text-sm text-gray-700">{item.name || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">{fmt(item.price)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800 text-right">
                  {fmt(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

