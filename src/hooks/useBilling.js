// ── BILLING HOOK ────────────────────────────────────────────────

import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "../api/api";
import { useCart } from "./useCart";

export function useBilling() {
  const [patient, setPatient] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [doctor, setDoctor] = useState(null);
  
  const [specs, setSpecs] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  
  const [discountAmt, setDiscountAmt] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const { cart, setCart, addToCart, setQty, clearCart, subtotal, totalItems } = useCart();

  // Load specializations on mount
  useEffect(() => {
    api.get("/specializations")
      .then(setSpecs)
      .catch(console.error);
  }, []);

  // Load doctors + services when specialization changes
  useEffect(() => {
    if (!selectedSpec) return;
    
    setDoctor(null);
    clearCart();
    
    Promise.all([
      api.get(`/doctors?specializationId=${selectedSpec}`),
      api.get(`/services?specializationId=${selectedSpec}`),
    ])
      .then(([doctorsData, servicesData]) => {
        setDoctors(doctorsData);
        setServicesList(servicesData);
      })
      .catch(console.error);
  }, [selectedSpec, clearCart]);

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
    const found = doctors.find((d) => d.doctorId === doctor);
    return found?.doctorName || null;
  }, [doctor, doctors]);

  // Submit bill
  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitting) return;
    
    setSubmitting(true);
    try {
      const res = await api.post("/bills", {
        patientId: patient.patientId,
        doctorId: doctor,
        doctorName: doctorName,
        specializationId: selectedSpec,
        paymentMode,
        discountAmount: Number(discountAmt || 0),
        discountPercent: Number(discountPct || 0),
        items: cart.map((item) => ({ serviceId: item.id, quantity: item.qty })),
      });

      // Download PDF
      const billId = res.id;
      const pdfResponse = await fetch(
        `http://localhost:8080/api/v1/bills/${billId}/invoice`
      );
      const blob = await pdfResponse.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${res.billNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Reset form
      setSuccessMsg(res?.billNumber || "Bill created successfully");
      clearCart();
      setSelectedSpec(null);
      setDiscountAmt("");
      setDiscountPct("");
      setPatient(null);
      setDoctor(null);
      
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, submitting, patient, doctor, doctorName, selectedSpec, paymentMode, discountAmt, discountPct, cart, clearCart, setPatient, setDoctor]);

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
    discountAmt,
    setDiscountAmt,
    discountPct,
    setDiscountPct,
    paymentMode,
    setPaymentMode,
    submitting,
    successMsg,
    // Computed
    step,
    subtotal,
    discountVal,
    total,
    totalItems,
    canSubmit,
    doctorName,
    // Actions
    handleSubmit,
  };
}