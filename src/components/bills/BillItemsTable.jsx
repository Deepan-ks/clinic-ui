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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-32">
                Quantity
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-40">
                Price
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-40">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, index) => (
              <tr
                key={`${item.id ?? item.name ?? "item"}-${index}`}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {item.name || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 text-center">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 text-right tabular-nums">
                  {fmt(item.price)}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right tabular-nums">
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
