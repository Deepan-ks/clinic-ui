// ── BILLING PAGE ────────────────────────────────────────────────

import { useBilling } from "../hooks/useBilling";
import { StepIndicator } from "../components/billing/StepIndicator";
import { PatientSearch } from "../components/billing/PatientSearch";
import { DoctorSelect } from "../components/billing/DoctorSelect";
import { ServiceCart } from "../components/billing/ServiceCart";
import { BillSummary } from "../components/billing/BillSummary";
import ServiceSearch from "../components/billing/ServiceSearch";
import { CheckIcon } from "../components/icons";

export default function BillingPage() {
  const billing = useBilling();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between w-full">
        <div>
          <h1 className="text-xl font-bold text-gray-900">New Bill</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Complete all steps to generate invoice
          </p>
        </div>
        <StepIndicator current={billing.step} />
      </div>

      {/* Success Message */}
      {billing.successMsg && (
        <div className="flex-shrink-0 mx-8 mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-2.5 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
            <CheckIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              Invoice generated — {billing.successMsg}
            </p>
            <p className="text-xs text-emerald-600">Bill saved successfully.</p>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full flex gap-6 items-start px-12 py-4 overflow-auto">
          {/* Left Panel - Input Forms */}
          <div className="flex-1 min-w-[800px] px-4 py-6 space-y-4">
            <PatientSearch
              patient={billing.patient}
              onSelect={billing.setPatient}
            />
            <DoctorSelect
              selectedSpec={billing.selectedSpec}
              onSpecChange={billing.setSelectedSpec}
              doctor={billing.doctor}
              onDoctorChange={billing.setDoctor}
              specs={billing.specs}
              doctors={billing.doctors}
            />

            <ServiceSearch
              specializationId={billing.selectedSpec}
              onSelect={billing.addToCart}
              cart={billing.cart}
            />

            <ServiceCart cart={billing.cart} setQty={billing.setQty} />
          </div>

          {/* Right Panel - Summary */}
          <BillSummary
            patient={billing.patient}
            doctorName={billing.doctorName}
            cart={billing.cart}
            subtotal={billing.subtotal}
            discountAmt={billing.discountAmt}
            setDiscountAmt={billing.setDiscountAmt}
            discountPct={billing.discountPct}
            setDiscountPct={billing.setDiscountPct}
            discountVal={billing.discountVal}
            total={billing.total}
            paymentMode={billing.paymentMode}
            setPaymentMode={billing.setPaymentMode}
            canSubmit={billing.canSubmit}
            submitting={billing.submitting}
            handleSubmit={billing.handleSubmit}
            totalItems={billing.totalItems}
          />
        </div>
      </div>
    </div>
  );
}
