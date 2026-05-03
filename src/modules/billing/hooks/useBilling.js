// ── BILLING HOOK ────────────────────────────────────────────────

import { useState, useEffect, useMemo, useCallback } from "react";
import * as billingApi from "../api";
import { useCart } from "./useCart";
import { useToast } from "@/shared/hooks/useToast";
import { API_BASE_URL } from "@/lib/config/env";

export function useBilling() {
  const { addToast } = useToast();
  const [patient, setPatient] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [doctor, setDoctor] = useState(null);
  
  const [specs, setSpecs] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  
  const [discountAmt, setDiscountAmt] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { cart, addToCart, setQty, clearCart, subtotal, totalItems } = useCart();

  // Load specializations on mount
  useEffect(() => {
    setLoadingData(true);
    billingApi.getSpecializations()
      .then(setSpecs)
      .catch((error) => {
        addToast({
          type: "error",
          message: error.message || "Unable to load departments. Please refresh.",
        });
      })
      .finally(() => setLoadingData(false));
  }, [addToast]);

  // Load doctors + services when specialization changes
  useEffect(() => {
    if (!selectedSpec) return;
    
    setDoctor(null);
    clearCart();
    
    setLoadingData(true);
    Promise.all([
      billingApi.getDoctors(selectedSpec),
      billingApi.getServices(selectedSpec),
    ])
      .then(([doctorsData, servicesData]) => {
        setDoctors(doctorsData);
        setServicesList(servicesData);
      })
      .catch((error) => {
        addToast({
          type: "error",
          message: error.message || "Unable to load doctors or services for this department.",
        });
      })
      .finally(() => setLoadingData(false));
  }, [selectedSpec, clearCart, addToast]);

  // Compute current step
  const step = useMemo(() => {
    if (!patient) return 0;
    if (!doctor) return 1;
    if (cart.length === 0) return 2;
    return 3;
  }, [patient, doctor, cart.length]);

  // Compute totals
  const discountVal = useMemo(() => {
    if (discountPct > 0) {
      return (subtotal * discountPct) / 100;
    }
    return Number(discountAmt || 0);
  }, [discountPct, discountAmt, subtotal]);

  const total = useMemo(() => Math.max(0, subtotal - discountVal), [subtotal, discountVal]);
  const canSubmit = !!(patient && doctor && cart.length > 0);

  // Get doctor name
  const doctorName = useMemo(() => {
    if (!doctor) return null;
    const found = doctors.find((d) => (d.id ?? d.doctorId) === doctor);
    return found?.doctorName ?? found?.name ?? null;
  }, [doctor, doctors]);

  // Submit bill
  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitting) return;
    
    setSubmitting(true);
    try {
      const res = await billingApi.createBill({
        patientId: patient.id ?? patient.patientId,      // normalised or raw
        doctorId: doctor,
        doctorName: doctorName,
        specializationId: selectedSpec,
        paymentMode,
        discountAmount: Number(discountAmt || 0),
        discountPercent: Number(discountPct || 0),
        items: cart.map((item) => ({
          serviceId: item.id ?? item.serviceId,           // normalised or raw
          quantity: item.qty,
        })),
      });

      // Download PDF
      const billId = res.id ?? res.billId;
      const billNumber = res.billNumber ?? res.invoiceNumber ?? billId;
      if (billId) {
        const pdfResponse = await fetch(
          `${API_BASE_URL}/bills/${billId}/invoice`
        );

        if (pdfResponse.ok) {
          const blob = await pdfResponse.blob();
          const url = globalThis.URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = `invoice-${billNumber}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          globalThis.URL.revokeObjectURL(url);
        } else {
          addToast({
            type: "error",
            message: "Bill created, but invoice download failed.",
          });
        }
      }

      // Reset form
      addToast({
        type: "success",
        message: `Invoice generated - ${res?.billNumber || "Bill created successfully"}`,
      });
      clearCart();
      setSelectedSpec(null);
      setDiscountAmt("");
      setDiscountPct("");
      setPatient(null);
      setDoctor(null);

    } catch (error) {
      addToast({
        type: "error",
        message: error.message || "Unable to create bill. Please retry.",
      });
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, submitting, patient, doctor, doctorName, selectedSpec, paymentMode, discountAmt, discountPct, cart, clearCart, addToast]);

  return {
    // State
    patient,
    setPatient,
    selectedSpec,
    setSelectedSpec,
    doctor,
    setDoctor,
    specs,
    doctors,
    servicesList,
    cart,
    addToCart,
    setQty,
    clearCart,
    subtotal,
    discountAmt,
    setDiscountAmt,
    discountPct,
    setDiscountPct,
    paymentMode,
    setPaymentMode,
    loadingData,
    submitting,
    // Computed
    step,
    discountVal,
    total,
    totalItems,
    canSubmit,
    doctorName,
    // Actions
    handleSubmit,
  };
}
