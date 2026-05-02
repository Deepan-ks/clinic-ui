// ── BILL SUMMARY COMPONENT ─────────────────────────────────────

import LoadingButton from "../common/LoadingButton";
import { fmt, PAYMENT_MODES } from "../../utils/formatters";
import { Heading, Text } from "../ui/Typography";

function SummaryRow({ label, value, placeholder, done }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <Text variant="label-sm" className="flex-shrink-0">
        {label}
      </Text>
      <Text
        variant="label-sm"
        className={`text-right leading-snug ${
          done ? "text-gray-800" : "text-gray-300"
        }`}
      >
        {value || placeholder}
      </Text>
    </div>
  );
}

export function BillSummary({
  patient,
  doctorName,
  cart,
  subtotal,
  discountAmt,
  setDiscountAmt,
  discountPct,
  setDiscountPct,
  discountVal,
  total,
  paymentMode,
  setPaymentMode,
  canSubmit,
  submitting,
  handleSubmit,
  totalItems,
}) {
  const serviceCount = cart.length;
  const itemCount = totalItems;

  return (
    <div className="w-full xl:w-[420px] xl:flex-shrink-0 bg-white border border-gray-200 rounded-xl h-fit xl:sticky xl:top-6 shadow-sm">
      <div className="p-6 space-y-5 flex flex-col min-h-full">
        <Heading level={3}>
          Bill Summary
        </Heading>

        {/* Status Rows */}
        <div className="space-y-3">
          <SummaryRow
            label="Patient"
            value={patient ? patient.name || patient.patientName : null}
            placeholder="Not selected"
            done={!!patient}
          />
          <SummaryRow
            label="Doctor"
            value={doctorName ? `Dr. ${doctorName}` : null}
            placeholder="Not selected"
            done={!!doctorName}
          />
          <SummaryRow
            label="Services"
            value={
              serviceCount > 0
                ? `${serviceCount} type${serviceCount > 1 ? "s" : ""} · ${itemCount} item${itemCount > 1 ? "s" : ""}`
                : null
            }
            placeholder="None added"
            done={serviceCount > 0}
          />
        </div>

        <div className="border-t border-gray-100" />

        {/* Mini Cart */}
        {cart.length > 0 && (
          <div className="space-y-1.5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-baseline"
              >
                <Text variant="sm" className="text-gray-500 truncate max-w-[160px]">
                  {item.name} <span className="text-gray-400">×{item.qty}</span>
                </Text>
                <Text variant="number-sm" className="flex-shrink-0">
                  {fmt(item.price * item.qty)}
                </Text>
              </div>
            ))}
          </div>
        )}

        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <Text variant="sm" className="text-gray-500">Subtotal</Text>
          <Text variant="number-sm" className="font-semibold text-gray-800">{fmt(subtotal)}</Text>
        </div>

        {/* Discount */}
        <div>
          <Text variant="xs" className="mb-2">
            Discount (optional)
          </Text>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={discountAmt}
                disabled={Number(discountPct) > 0}
                onChange={(e) => {
                  setDiscountAmt(e.target.value);
                  setDiscountPct("");
                }}
                className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-300 transition-all"
              />
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={discountPct}
                disabled={Number(discountAmt) > 0}
                onChange={(e) => {
                  setDiscountPct(e.target.value);
                  setDiscountAmt("");
                }}
                className="w-full pl-3 pr-7 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-300 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none">
                %
              </span>
            </div>
          </div>
          {discountVal > 0 && (
            <div className="flex justify-between mt-1.5">
              <Text variant="label-sm" className="text-emerald-600">Discount</Text>
              <Text variant="number-sm" className="text-emerald-600">−{fmt(discountVal)}</Text>
            </div>
          )}
        </div>

        {/* Payment Mode */}
        <div>
          <Text variant="xs" className="mb-2">
            Payment Mode
          </Text>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_MODES.map((mode) => (
              <button
                key={mode}
                onClick={() => setPaymentMode(mode)}
                className={`py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  paymentMode === mode
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-gray-200" />

        {/* Grand Total */}
        <div className="flex items-baseline justify-between">
          <Text variant="label-md" className="text-gray-600">Grand Total</Text>
          <Text variant="number-lg">
            {fmt(total)}
          </Text>
        </div>

        {/* Submit Button */}
        <LoadingButton
          onClick={handleSubmit}
          isLoading={submitting}
          disabled={!canSubmit}
          label="Generate Invoice"
          loadingLabel="Generating..."
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
            canSubmit && !submitting
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        />

        {/* Missing Items */}
        {!canSubmit && (
          <div className="space-y-1.5">
            {[
              [!patient, "Select a patient"],
              [!doctorName, "Select a doctor"],
              [cart.length === 0, "Add at least one service"],
            ]
              .filter(([cond]) => cond)
              .map(([, msg]) => (
                <p
                  key={msg}
                  className="text-xs text-amber-600 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {msg}
                </p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
