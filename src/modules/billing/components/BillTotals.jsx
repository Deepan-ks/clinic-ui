import { fmt } from "@/lib/utils/formatters";

export default function BillTotals({ subtotal, discount, total }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Totals</h2>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Subtotal</span>
        <span className="font-semibold text-gray-800">{fmt(subtotal)}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Discount</span>
        <span className="font-semibold text-emerald-700">-{fmt(discount)}</span>
      </div>

      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700">Final Total</span>
        <span className="text-2xl font-bold text-gray-900">{fmt(total)}</span>
      </div>
    </div>
  );
}
