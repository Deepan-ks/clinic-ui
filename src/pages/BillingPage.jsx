import { useEffect, useState, useRef } from "react";
import { api } from "../api/api";

// ── ICONS ────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
    />
  </svg>
);
const XIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const SpinIcon = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);
const CheckIcon = ({ className = "w-3 h-3" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M5 13l4 4L19 7"
    />
  </svg>
);
const ReceiptIcon = () => (
  <svg
    className="w-10 h-10"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4"
    />
  </svg>
);

// ── HELPERS ──────────────────────────────────────────────────────
const fmt = (n) => "₹" + Number(n || 0).toFixed(2);
const initials = (name = "") =>
  name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

// ── AVATAR ───────────────────────────────────────────────────────
function Avatar({ name = "", size = "md" }) {
  const color = AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sz} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
    >
      {initials(name)}
    </div>
  );
}

// ── CARD SECTION ─────────────────────────────────────────────────
function Card({ label, complete, children }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all ${complete ? "border-emerald-200" : "border-gray-200"}`}
    >
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${complete ? "bg-emerald-500" : "bg-gray-200"}`}
        >
          {complete && <CheckIcon className="w-3 h-3 text-white" />}
        </div>
        <h3
          className={`text-sm font-bold tracking-tight ${complete ? "text-emerald-700" : "text-gray-700"}`}
        >
          {label}
        </h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ── STEP DOTS ────────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ["Patient", "Doctor", "Services", "Payment"];
  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                done
                  ? "bg-emerald-100 text-emerald-700"
                  : active
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {done ? (
                <CheckIcon className="w-3 h-3 text-emerald-600" />
              ) : (
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${active ? "bg-white/30" : "bg-gray-200 text-gray-400"}`}
                >
                  {i + 1}
                </span>
              )}
              {s}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-5 h-px mx-0.5 ${i < current ? "bg-emerald-300" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── SUMMARY ROW ──────────────────────────────────────────────────
function SummaryRow({ label, value, placeholder, done }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs text-gray-400 font-medium flex-shrink-0">
        {label}
      </span>
      <span
        className={`text-xs font-semibold text-right leading-snug ${done ? "text-gray-800" : "text-gray-300"}`}
      >
        {value || placeholder}
      </span>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────
export default function BillingPage() {
  const searchRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [searching, setSearching] = useState(false);
  const [patient, setPatient] = useState(null);

  const [specs, setSpecs] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);

  const [servicesList, setServicesList] = useState([]);
  const [cart, setCart] = useState([]);

  const [discountAmt, setDiscountAmt] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const step = !patient ? 0 : !doctor ? 1 : cart.length === 0 ? 2 : 3;
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const discountVal =
    discountPct > 0 ? (subtotal * discountPct) / 100 : Number(discountAmt || 0);
  const total = Math.max(0, subtotal - discountVal);
  const canSubmit = !!(patient && doctor && cart.length > 0);

  // load specs
  useEffect(() => {
    api.get("/specializations").then(setSpecs).catch(console.error);
  }, []);

  // load doctors + services
  useEffect(() => {
    if (!selectedSpec) return;
    setDoctor(null);
    setCart([]);
    Promise.all([
      api.get(`/doctors?specializationId=${selectedSpec}`),
      api.get(`/services?specializationId=${selectedSpec}`),
    ])
      .then(([d, s]) => {
        setDoctors(d);
        setServicesList(s);
      })
      .catch(console.error);
  }, [selectedSpec]);

  // debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowDrop(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await api.get(
          `/patients/search?query=${encodeURIComponent(query)}`,
        );
        setResults(Array.isArray(res) ? res : []);
        setShowDrop(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // close dropdown outside click
  useEffect(() => {
    const h = (e) => {
      if (!searchRef.current?.contains(e.target)) setShowDrop(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const pickPatient = (p) => {
    setPatient(p);
    setQuery(p.name || p.patientName || "");
    setShowDrop(false);
  };
  const clearPatient = () => {
    setPatient(null);
    setQuery("");
    setResults([]);
  };

  const addToCart = (s) => {
    const exists = cart.find((x) => x.id === s.serviceId);
    if (exists)
      setCart((c) =>
        c.map((x) => (x.id === s.serviceId ? { ...x, qty: x.qty + 1 } : x)),
      );
    else
      setCart((c) => [
        ...c,
        { id: s.serviceId, name: s.serviceName, price: s.price, qty: 1 },
      ]);
  };
  const setQty = (id, qty) => {
    if (qty < 1) setCart((c) => c.filter((x) => x.id !== id));
    else setCart((c) => c.map((x) => (x.id === id ? { ...x, qty } : x)));
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.post("/bills", {
        patientId: patient.patientId,
        doctorId: doctor,
        specializationId: selectedSpec,
        paymentMode,
        discountAmount: Number(discountAmt || 0),
        discountPercent: Number(discountPct || 0),
        items: cart.map((x) => ({ serviceId: x.id, quantity: x.qty })),
      });
      setSuccessMsg(res?.billNumber || "Bill created successfully");
      setCart([]);
      setDiscountAmt("");
      setDiscountPct("");
      setPatient(null);
      setQuery("");
      setDoctor(null);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const doctorName = doctor
    ? doctors.find((d) => d.doctorId === doctor)?.doctorName
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* TOP BAR */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between w-full">
        <div>
          <h1 className="text-xl font-bold text-gray-900 ">New Bill</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Complete all steps to generate invoice
          </p>
        </div>
        <Steps current={step} />
      </div>

      {/* SUCCESS */}
      {successMsg && (
        <div className="flex-shrink-0 mx-8 mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-2.5 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
            <CheckIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              Invoice generated — {successMsg}
            </p>
            <p className="text-xs text-emerald-600">Bill saved successfully.</p>
          </div>
        </div>
      )}

      {/* BODY */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full flex gap-6 items-start px-12 py-4 overflow-auto">
          {/* LEFT — INPUTS */}
          <div className="flex-1 min-w-[800px] px-4 py-6 space-y-4">
            {/* PATIENT */}
            <Card label="1  Patient" complete={!!patient}>
              <div ref={searchRef} className="relative space-y-2">
                <div className="flex items-center gap-2.5 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                  <span className="text-gray-400 flex-shrink-0">
                    {searching ? <SpinIcon /> : <SearchIcon />}
                  </span>
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (patient) clearPatient();
                    }}
                    placeholder="Search patient by name or phone..."
                    className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
                  />
                  {query && (
                    <button
                      onClick={clearPatient}
                      className="text-gray-300 hover:text-gray-500 flex-shrink-0 transition-colors"
                    >
                      <XIcon />
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {showDrop && !patient && results.length > 0 && (
                  <div className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                    {results.map((p) => (
                      <button
                        key={p.patientId}
                        onMouseDown={() => pickPatient(p)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-0 text-left transition-colors"
                      >
                        <Avatar name={p.name || p.patientName} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {p.name || p.patientName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {p.phone} · {p.age}y · {p.gender}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {showDrop &&
                  results.length === 0 &&
                  !searching &&
                  query.length >= 2 && (
                    <div className="absolute z-30 top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl px-4 py-4 text-center">
                      <p className="text-sm font-medium text-gray-500">
                        No patients found
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Try a different name or number
                      </p>
                    </div>
                  )}
              </div>

              {patient && (
                <div className="mt-2 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 shadow-sm">
                  <Avatar
                    name={patient.name || patient.patientName}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">
                      {patient.name || patient.patientName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {patient.phone} · Age {patient.age} · {patient.gender}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full uppercase tracking-wide flex-shrink-0">
                    Selected
                  </span>
                  <button
                    onClick={clearPatient}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                  >
                    <XIcon />
                  </button>
                </div>
              )}
            </Card>

            {/* DOCTOR */}
            <Card label="2  Department & Doctor" complete={!!doctor}>
              <div className="grid grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Department
                  </p>

                  <select
                    value={selectedSpec || ""}
                    onChange={(e) => {
                      setSelectedSpec(Number(e.target.value) || null);
                      setDoctor(null);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select department</option>
                    {specs.map((s) => (
                      <option
                        key={s.specializationId}
                        value={s.specializationId}
                      >
                        {s.specializationName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Doctor
                  </p>

                  <select
                    value={doctor || ""}
                    onChange={(e) => setDoctor(Number(e.target.value) || null)}
                    disabled={!selectedSpec}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {selectedSpec
                        ? "Select doctor"
                        : "Select department first"}
                    </option>

                    {doctors.map((d) => (
                      <option key={d.doctorId} value={d.doctorId}>
                        {d.doctorName}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedSpec && !doctor && (
                  <p className="text-xs text-gray-400 mt-1">
                    Select a doctor for this department
                  </p>
                )}
              </div>
            </Card>

            {/* SERVICES */}
            <Card label="3  Services" complete={cart.length > 0}>
              <div className="space-y-3">
                {servicesList.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Click to add
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {servicesList.map((s) => {
                        const inCart = cart.find((x) => x.id === s.serviceId);
                        return (
                          <button
                            key={s.serviceId}
                            onClick={() => addToCart(s)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                              inCart
                                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                                : "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                            }`}
                          >
                            <span>{s.serviceName}</span>
                            <span
                              className={`text-xs ${inCart ? "text-blue-200" : "text-gray-400"}`}
                            >
                              ₹{s.price}
                            </span>
                            {inCart && (
                              <span className="ml-0.5 bg-white/25 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {inCart.qty}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : selectedSpec ? (
                  <p className="text-sm text-gray-400">
                    No services for this department.
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">
                    Select a department to see services.
                  </p>
                )}

                {/* Cart table */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-12 px-5 py-2.5 bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    <span className="col-span-5">Service</span>
                    <span className="col-span-2 text-right">Rate</span>
                    <span className="col-span-3 text-center">Qty</span>
                    <span className="col-span-2 text-right">Total</span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 bg-white">
                      <ReceiptIcon />
                      <p className="text-sm font-medium mt-3 text-gray-400">
                        No services added
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        Add from the buttons above
                      </p>
                    </div>
                  ) : (
                    <>
                      {cart.map((s) => (
                        <div
                          key={s.id}
                          className="grid grid-cols-12 px-5 py-2.5 border-b border-gray-100 last:border-0 items-center group bg-white hover:bg-gray-50 transition-colors"
                        >
                          <p className="col-span-5 text-sm font-medium text-gray-800">
                            {s.name}
                          </p>
                          <p className="col-span-2 text-right text-sm text-gray-400">
                            ₹{s.price}
                          </p>
                          <div className="col-span-3 flex items-center justify-center gap-2.5">
                            <button
                              onClick={() => setQty(s.id, s.qty - 1)}
                              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-600 flex items-center justify-center font-bold text-sm transition-all"
                            >
                              −
                            </button>
                            <span className="text-sm font-bold text-gray-900 w-4 text-center">
                              {s.qty}
                            </span>
                            <button
                              onClick={() => setQty(s.id, s.qty + 1)}
                              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-600 flex items-center justify-center font-bold text-sm transition-all"
                            >
                              +
                            </button>
                          </div>
                          <div className="col-span-2 flex items-center justify-end gap-2">
                            <span className="text-sm font-bold text-gray-900">
                              ₹{(s.price * s.qty).toFixed(2)}
                            </span>
                            <button
                              onClick={() => setQty(s.id, 0)}
                              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                            >
                              <XIcon />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="grid grid-cols-12 px-5 py-2.5 bg-gray-50 border-t border-gray-200">
                        <span className="col-span-10 text-sm font-bold text-gray-600 text-right pr-4">
                          Subtotal
                        </span>
                        <span className="col-span-2 text-right text-sm font-bold text-gray-900">
                          {fmt(subtotal)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
          {/* RIGHT — SUMMARY PANEL */}
          <div className="w-[600px] max-w-[420px] flex-shrink-0 bg-white border border-gray-200 rounded-xl h-fit sticky top-6 shadow-sm">
            <div className="p-6 space-y-5 flex flex-col min-h-full">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                Bill Summary
              </h2>

              {/* Status rows */}
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
                    cart.length > 0
                      ? `${cart.length} type${cart.length > 1 ? "s" : ""} · ${cart.reduce((s, x) => s + x.qty, 0)} item${cart.reduce((s, x) => s + x.qty, 0) > 1 ? "s" : ""}`
                      : null
                  }
                  placeholder="None added"
                  done={cart.length > 0}
                />
              </div>

              <div className="border-t border-gray-100" />

              {/* Mini cart */}
              {cart.length > 0 && (
                <div className="space-y-1.5">
                  {cart.map((s) => (
                    <div
                      key={s.id}
                      className="flex justify-between items-baseline"
                    >
                      <span className="text-xs text-gray-500 truncate max-w-[160px]">
                        {s.name} <span className="text-gray-400">×{s.qty}</span>
                      </span>
                      <span className="text-xs font-semibold text-gray-700 flex-shrink-0">
                        {fmt(s.price * s.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-800">
                  {fmt(subtotal)}
                </span>
              </div>

              {/* Discount */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Discount (optional)
                </p>
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
                  <div className="flex justify-between text-xs text-emerald-600 font-semibold mt-1.5">
                    <span>Discount</span>
                    <span>−{fmt(discountVal)}</span>
                  </div>
                )}
              </div>

              {/* Payment mode */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Payment Mode
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["CASH", "UPI", "CARD", "INSURANCE"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setPaymentMode(m)}
                      className={`py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                        paymentMode === m
                          ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-gray-200" />

              {/* Grand total */}
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-gray-600">
                  Grand Total
                </span>
                <span className="text-2xl font-semibold text-gray-900 tracking-tight">
                  {fmt(total)}
                </span>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                  canSubmit && !submitting
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <SpinIcon /> Generating...
                  </span>
                ) : (
                  "Generate Invoice"
                )}
              </button>

              {/* What's missing */}
              {!canSubmit && (
                <div className="space-y-1.5">
                  {[
                    [!patient, "Select a patient"],
                    [!doctor, "Select a doctor"],
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
        </div>
      </div>
    </div>
  );
}
