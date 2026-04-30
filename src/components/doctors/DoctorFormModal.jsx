import { useMemo, useState, useEffect } from "react";
import { api } from "../../api/api";
import LoadingButton from "../common/LoadingButton";
import FormError from "../common/FormError";
import { useToast } from "../../hooks/useToast";

const INITIAL_FORM = {
  name: "",
  phone: "",
  specializationId: "",
  active: true,
};

export default function DoctorFormModal({
  open,
  doctor,           // null → add, object → edit
  specializations,  // list for dropdown
  onClose,
  onSaved,
}) {
  const { addToast } = useToast();
  const isEdit = Boolean(doctor);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (doctor) {
        setForm({
          name: doctor.doctorName ?? "",
          phone: doctor.phone ?? "",
          specializationId: doctor.specializationId ?? "",
          active: doctor.active ?? doctor.isActive ?? true,
        });
      } else {
        setForm(INITIAL_FORM);
      }
      setErrors({});
    }
  }, [open, doctor]);

  const canSubmit = useMemo(() => Boolean(form.name.trim()), [form.name]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Doctor name is required";
    if (
      form.phone.trim() &&
      !/^\d{7,15}$/.test(form.phone.trim())
    )
      nextErrors.phone = "Enter a valid phone number (7–15 digits)";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        specializationId: form.specializationId || null,
        active: form.active,
      };
      let saved;
      if (isEdit) {
        saved = await api.put(`/doctors/${doctor.id}`, payload);
        addToast({ type: "success", message: "Doctor updated successfully." });
      } else {
        saved = await api.post("/doctors", payload);
        addToast({ type: "success", message: "Doctor added successfully." });
      }
      onSaved(saved, isEdit);
      handleClose();
    } catch {
      addToast({
        type: "error",
        message: isEdit
          ? "Unable to update doctor."
          : "Unable to add doctor.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const inputCls = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors[field] ? "border-rose-400" : "border-gray-200"
    }`;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/30 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit Doctor" : "Add Doctor"}
    >
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Doctor" : "Add Doctor"}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4" noValidate>
          {/* Name */}
          <div>
            <label htmlFor="doc-name" className="block text-xs font-semibold text-gray-500 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="doc-name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputCls("name")}
              placeholder="Dr. Name"
              autoFocus
              autoComplete="off"
            />
            <FormError message={errors.name} />
          </div>

          {/* Specialization */}
          <div>
            <label htmlFor="doc-spec" className="block text-xs font-semibold text-gray-500 mb-1">
              Specialization{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <select
              id="doc-spec"
              value={form.specializationId}
              onChange={(e) => handleChange("specializationId", e.target.value)}
              className={`${inputCls("specializationId")} bg-white`}
            >
              <option value="">None</option>
              {specializations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="doc-phone" className="block text-xs font-semibold text-gray-500 mb-1">
              Phone{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="doc-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={inputCls("phone")}
              placeholder="Phone number"
              autoComplete="off"
            />
            <FormError message={errors.phone} />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              id="doc-active-toggle"
              type="button"
              role="switch"
              aria-checked={form.active}
              onClick={() => handleChange("active", !form.active)}
              className={`relative rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${form.active ? "bg-blue-600" : "bg-gray-300"
                }`}
              style={{ width: "36px", height: "20px" }}
            >
              <span
                className="absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform"
                style={{
                  width: "16px",
                  height: "16px",
                  transform: form.active ? "translateX(16px)" : "translateX(0)",
                }}
              />
            </button>
            <span className="text-sm text-gray-700 font-medium">
              {form.active ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              isLoading={submitting}
              disabled={!canSubmit}
              label={isEdit ? "Save Changes" : "Add Doctor"}
              loadingLabel={isEdit ? "Saving…" : "Adding…"}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
