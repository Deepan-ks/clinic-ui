// ── BILLING PAGE ────────────────────────────────────────────────

import { useBilling } from "../hooks/useBilling";
import { StepIndicator } from "../components/billing/StepIndicator";
import { PatientSearch } from "../components/billing/PatientSearch";
import { DoctorSelect } from "../components/billing/DoctorSelect";
import { ServiceCart } from "../components/billing/ServiceCart";
import { BillSummary } from "../components/billing/BillSummary";
import ServiceSearch from "../components/billing/ServiceSearch";
import { Heading, Text } from "../components/ui/Typography";

export default function BillingPage() {
  const billing = useBilling();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 overflow-x-hidden">
      {/* Top Bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between w-full">
        <div>
          <Heading level={1}>New Bill</Heading>
          <Text variant="helper" className="mt-0.5">
            Complete all steps to generate invoice
          </Text>
        </div>
        <StepIndicator current={billing.step} />
      </div>

      {/* Body */}
      <div className="flex-1 flex min-w-0 overflow-hidden">
        <div className="w-full min-w-0 flex flex-col xl:flex-row gap-6 xl:items-start px-4 md:px-6 xl:px-12 py-4 overflow-y-auto overflow-x-hidden">
          {/* Left Panel - Input Forms */}
          <div className="flex-1 min-w-0 xl:min-w-[680px] py-4 xl:py-6 space-y-4">
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
