import { useMemo, useState, useEffect } from "react";
import { api } from "../../api/api";
import LoadingButton from "../common/LoadingButton";
import FormError from "../common/FormError";
import { useToast } from "../../hooks/useToast";
import {
  validateRequiredName,
  validatePhone,
  validateAge,
  validateEmail,
  validateRequired,
  digitsOnly,
  runValidations,
} from "../../utils/validators";

const INITIAL_FORM = {
  name: "",
  phone: "",
  age: "",
  gender: "",
  address: "",
  email: "",
};

function buildPayload(form) {
  return {
    name: form.name.trim(),
    phone: form.phone.trim(),
    age: form.age !== "" ? Number(form.age) : null,
    gender: form.gender,           // @NotBlank — never send null
    address: form.address.trim(),
    email: form.email.trim() || null,
  };
}

export default function PatientFormModal({ open, patient, onClose, onSaved }) {
  const { addToast } = useToast();
  const isEdit = Boolean(patient);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (patient) {
        setForm({
          name: patient.name || patient.patientName || "",
          phone: patient.phone || patient.phoneNumber || "",
          age: patient.age != null ? String(patient.age) : "",
          gender: patient.gender || "",
          address: patient.address || "",
          email: patient.email || "",
        });
      } else {
        setForm(INITIAL_FORM);
      }
      setErrors({});
    }
  }, [open, patient]);

  // Required: name, phone, age, gender, address — email is optional
  const canSubmit = useMemo(
    () =>
      Boolean(
        form.name.trim().length >= 2 &&
          form.phone.trim() &&
          form.age !== "" &&
          Number(form.age) >= 0 &&
          Number(form.age) <= 150 &&
          form.gender &&
          form.address.trim(),
      ),
    [form.name, form.phone, form.age, form.gender, form.address],
  );

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Strip non-digits from phone and age at input time
  const handlePhoneChange = (value) =>
    handleFieldChange("phone", digitsOnly(value));
  const handleAgeChange = (value) =>
    handleFieldChange("age", digitsOnly(value).slice(0, 3)); // max 3 digits

  const validate = () => {
    const nextErrors = runValidations({
      name:    () => validateRequiredName(form.name, "Full name"),
      phone:   () => validatePhone(form.phone, true),   // exactly 10 digits (backend @Pattern(\\d{10}))
      age:     () => validateAge(form.age),
      gender:  () => validateRequired(form.gender, "Gender"),
      address: () => validateRequired(form.address, "Address"),
      email:   () => validateEmail(form.email),
    });
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
      const payload = buildPayload(form);
      let saved;

      if (isEdit) {
        const patientId = patient.id ?? patient.patientId;
        saved = await api.put(`/patients/${patientId}`, payload);
        addToast({ type: "success", message: "Patient updated successfully." });
      } else {
        saved = await api.post("/patients", payload);
        addToast({ type: "success", message: "Patient created successfully." });
      }

      onSaved(saved, isEdit);
      handleClose();
    } catch {
      addToast({
        type: "error",
        message: isEdit
          ? "Unable to update patient. Please retry."
          : "Unable to create patient. Please retry.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const inputCls = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
      errors[field] ? "border-rose-400" : "border-gray-200"
    }`;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/30 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit Patient" : "Add Patient"}
    >
      {/* max-h + flex-col to allow the body to scroll independently */}
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col max-h-[90vh]">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Patient" : "Add Patient"}
          </h3>
          <button
            id="patient-modal-close-btn"
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close modal"
            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg
              className="w-4 h-4"
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
          </button>
        </div>

        {/* ── Scrollable form body ────────────────────────────────── */}
        <form
          id="patient-form"
          onSubmit={handleSubmit}
          className="px-5 py-4 space-y-4 overflow-y-auto flex-1"
          noValidate
        >
          {/* Full Name */}
          <div>
            <label
              htmlFor="patient-name"
              className="block text-xs font-semibold text-gray-500 mb-1"
            >
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="patient-name"
              value={form.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className={inputCls("name")}
              placeholder="Patient full name"
              autoFocus
              autoComplete="off"
            />
            <FormError message={errors.name} />
          </div>

          {/* Age + Gender — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="patient-age"
                className="block text-xs font-semibold text-gray-500 mb-1"
              >
                Age <span className="text-rose-500">*</span>
              </label>
              <input
                id="patient-age"
                type="text"
                inputMode="numeric"
                value={form.age}
                onChange={(e) => handleAgeChange(e.target.value)}
                className={inputCls("age")}
                placeholder="Age"
                maxLength={3}
              />
              <FormError message={errors.age} />
            </div>

            <div>
              <label
                htmlFor="patient-gender"
                className="block text-xs font-semibold text-gray-500 mb-1"
              >
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                id="patient-gender"
                value={form.gender}
                onChange={(e) => handleFieldChange("gender", e.target.value)}
                className={`${inputCls("gender")} bg-white`}
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <FormError message={errors.gender} />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="patient-phone"
              className="block text-xs font-semibold text-gray-500 mb-1"
            >
              Phone <span className="text-rose-500">*</span>
            </label>
            <input
              id="patient-phone"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={inputCls("phone")}
              placeholder="10-digit phone number"
              autoComplete="off"
              maxLength={10}
            />
            <FormError message={errors.phone} />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="patient-address"
              className="block text-xs font-semibold text-gray-500 mb-1"
            >
              Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="patient-address"
              rows={3}
              value={form.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              className={`${inputCls("address")} resize-none`}
              placeholder="Street, City, State"
              autoComplete="off"
            />
            <FormError message={errors.address} />
          </div>

          {/* Email — optional */}
          <div>
            <label
              htmlFor="patient-email"
              className="block text-xs font-semibold text-gray-500 mb-1"
            >
              Email{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="patient-email"
              type="email"
              value={form.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              className={inputCls("email")}
              placeholder="patient@example.com"
              autoComplete="off"
            />
            <FormError message={errors.email} />
          </div>

          {/* Footer */}
          <div className="pt-2 pb-1 flex items-center justify-end gap-2">
            <button
              id="patient-modal-cancel-btn"
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <LoadingButton
              id="patient-modal-submit-btn"
              type="submit"
              isLoading={submitting}
              disabled={!canSubmit}
              label={isEdit ? "Save Changes" : "Create Patient"}
              loadingLabel={isEdit ? "Saving…" : "Creating…"}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
