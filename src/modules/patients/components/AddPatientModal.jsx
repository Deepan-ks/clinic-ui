import { useMemo, useState } from "react";
import * as patientsApi from "../api";
import LoadingButton from "@/shared/ui/LoadingButton";
import FormError from "@/shared/ui/FormError";
import { useToast } from "@/shared/hooks/useToast";
import {
  validateRequiredName,
  validatePhone,
  validateAge,
  validateEmail,
  validateRequired,
  digitsOnly,
  runValidations,
} from "@/lib/utils/validators";

const INITIAL_FORM = {
  name: "",
  phone: "",
  age: "",
  gender: "",
  address: "",
  email: "",
};

export default function AddPatientModal({ open, onClose, onCreated }) {
  const { addToast } = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Required: name, phone (10 digits), age, gender, address — email optional
  const canSubmit = useMemo(
    () =>
      Boolean(
        form.name.trim().length >= 2 &&
          form.phone.trim().length === 10 &&
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

  // Strip non-digits for phone; strip non-digits and cap at 3 chars for age
  const handlePhoneChange = (val) =>
    handleFieldChange("phone", digitsOnly(val).slice(0, 10));
  const handleAgeChange = (val) =>
    handleFieldChange("age", digitsOnly(val).slice(0, 3));

  const resetModal = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return;
    resetModal();
    onClose();
  };

  const validate = () => {
    const nextErrors = runValidations({
      name:    () => validateRequiredName(form.name, "Full name"),
      phone:   () => validatePhone(form.phone, true),
      age:     () => validateAge(form.age, true),     // mandatory
      gender:  () => validateRequired(form.gender, "Gender"),
      address: () => validateRequired(form.address, "Address"),
      email:   () => validateEmail(form.email),
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name:    form.name.trim(),
        phone:   form.phone.trim(),
        age:     form.age !== "" ? Number(form.age) : null,
        gender:  form.gender,                       // @NotBlank — never null
        address: form.address.trim(),
        email:   form.email.trim() || null,
      };

      const created = await patientsApi.createPatient(payload);
      addToast({ type: "success", message: "Patient created successfully." });
      onCreated(created);
      handleClose();
    } catch (error) {
      addToast({ type: "error", message: error.message || "Unable to create patient. Please retry." });
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
      aria-label="Add Patient"
    >
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Add Patient</h3>
            <p className="text-xs text-gray-400 mt-0.5">Quick registration for billing</p>
          </div>
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

        {/* Scrollable form body */}
        <form
          onSubmit={handleSubmit}
          className="px-5 py-4 space-y-4 overflow-y-auto flex-1"
          noValidate
        >
          {/* Full Name */}
          <div>
            <label htmlFor="qp-name" className="block text-xs font-semibold text-gray-500 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="qp-name"
              value={form.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className={inputCls("name")}
              placeholder="Patient full name"
              autoFocus
              autoComplete="off"
            />
            <FormError message={errors.name} />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="qp-phone" className="block text-xs font-semibold text-gray-500 mb-1">
              Phone <span className="text-rose-500">*</span>
            </label>
            <input
              id="qp-phone"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={inputCls("phone")}
              placeholder="10-digit phone number"
              maxLength={10}
              autoComplete="off"
            />
            <FormError message={errors.phone} />
          </div>

          {/* Age + Gender — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="qp-age" className="block text-xs font-semibold text-gray-500 mb-1">
                Age <span className="text-rose-500">*</span>
              </label>
              <input
                id="qp-age"
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
              <label htmlFor="qp-gender" className="block text-xs font-semibold text-gray-500 mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                id="qp-gender"
                value={form.gender}
                onChange={(e) => handleFieldChange("gender", e.target.value)}
                className={`${inputCls("gender")} bg-white`}
              >
                <option value="" disabled>Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <FormError message={errors.gender} />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="qp-address" className="block text-xs font-semibold text-gray-500 mb-1">
              Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="qp-address"
              rows={2}
              value={form.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              className={`${inputCls("address")} resize-none`}
              placeholder="Street, City"
              autoComplete="off"
            />
            <FormError message={errors.address} />
          </div>

          {/* Email — optional */}
          <div>
            <label htmlFor="qp-email" className="block text-xs font-semibold text-gray-500 mb-1">
              Email <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="qp-email"
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
          <div className="pt-1 flex items-center justify-end gap-2">
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
              label="Create Patient"
              loadingLabel="Creating…"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
