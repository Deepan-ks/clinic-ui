import { useMemo, useState, useEffect } from "react";
import * as servicesApi from "../api";
import LoadingButton from "@/shared/ui/LoadingButton";
import FormError from "@/shared/ui/FormError";
import { useToast } from "@/shared/hooks/useToast";
import {
  validateRequiredName,
  validatePrice,
  numericOnly,
  runValidations,
} from "@/lib/utils/validators";

const INITIAL_FORM = {
  name: "",
  price: "",
  specializationId: "",
  description: "",
  status: "ACTIVE",
};

export default function ServiceFormModal({
  open,
  service,             // null → add, object → edit
  specializations,     // list for dropdown
  onClose,
  onSaved,
}) {
  const { addToast } = useToast();
  const isEdit = Boolean(service);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (service) {
        setForm({
          name: service.name ?? "",
          price: service.price != null ? String(service.price) : "",
          specializationId: String(service.specializationId ?? ""),
          description: service.description ?? "",
          status: service.status ?? "ACTIVE",
        });
      } else {
        setForm(INITIAL_FORM);
      }
      setErrors({});
    }
  }, [open, service]);

  const canSubmit = useMemo(
    () =>
      Boolean(
        form.name.trim().length >= 2 &&
          form.price !== "" &&
          Number(form.price) > 0 &&
          form.specializationId,   // @NotNull on backend
      ),
    [form.name, form.price, form.specializationId],
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Strip non-numeric chars from price at input time
  const handlePriceChange = (value) =>
    handleChange("price", numericOnly(value));

  const validate = () => {
    const nextErrors = runValidations({
      name:             () => validateRequiredName(form.name, "Service name"),
      price:            () => validatePrice(form.price),
      specializationId: () =>
        form.specializationId ? "" : "Specialization is required",
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleClose = () => { if (submitting) return; onClose(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        specializationId: Number(form.specializationId), // @NotNull Long
        description: form.description.trim() || null,
        status: form.status,
      };
      let saved;
      if (isEdit) {
        saved = await servicesApi.updateService(service.id, payload);
        addToast({ type: "success", message: "Service updated successfully." });
      } else {
        saved = await servicesApi.createService(payload);
        addToast({ type: "success", message: "Service created successfully." });
      }
      onSaved(saved, isEdit);
      handleClose();
    } catch (error) {
      addToast({
        type: "error",
        message: error.message || (isEdit ? "Unable to update service." : "Unable to create service."),
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
    >
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Service" : "Add Service"}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form — scrollable */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 overflow-y-auto flex-1" noValidate>
          {/* Name */}
          <div>
            <label htmlFor="svc-name" className="block text-xs font-semibold text-gray-500 mb-1">
              Service Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="svc-name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputCls("name")}
              placeholder="e.g. ECG"
              autoFocus
              autoComplete="off"
            />
            <FormError message={errors.name} />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="svc-price" className="block text-xs font-semibold text-gray-500 mb-1">
              Price (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              id="svc-price"
              type="text"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => handlePriceChange(e.target.value)}
              className={inputCls("price")}
              placeholder="0.00"
              maxLength={10}
            />
            <FormError message={errors.price} />
          </div>

          {/* Specialization — required */}
          <div>
            <label htmlFor="svc-spec" className="block text-xs font-semibold text-gray-500 mb-1">
              Specialization <span className="text-rose-500">*</span>
            </label>
            <select
              id="svc-spec"
              value={form.specializationId}
              onChange={(e) => handleChange("specializationId", e.target.value)}
              className={`${inputCls("specializationId")} bg-white`}
            >
              <option value="" disabled>Select specialization</option>
              {specializations.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <FormError message={errors.specializationId} />
          </div>

          {/* Description — optional */}
          <div>
            <label htmlFor="svc-desc" className="block text-xs font-semibold text-gray-500 mb-1">
              Description{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="svc-desc"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`${inputCls("description")} resize-none`}
              placeholder="Short description of the service…"
            />
          </div>

          {/* Status toggle — only shown when editing; new services default to ACTIVE */}
          {isEdit && (
            <div className="flex items-center gap-3">
              <button
                id="svc-active-toggle"
                type="button"
                role="switch"
                aria-checked={form.status === "ACTIVE"}
                onClick={() =>
                  handleChange(
                    "status",
                    form.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                  )
                }
                className={`relative w-10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  form.status === "ACTIVE" ? "bg-blue-600" : "bg-gray-300"
                }`}
                style={{ height: "22px" }}
              >
                <span
                  className="absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform"
                  style={{
                    width: "18px",
                    height: "18px",
                    transform:
                      form.status === "ACTIVE"
                        ? "translateX(18px)"
                        : "translateX(0)",
                  }}
                />
              </button>
              <label
                htmlFor="svc-active-toggle"
                className="text-sm text-gray-700 font-medium cursor-pointer select-none"
              >
                {form.status === "ACTIVE" ? "Active" : "Inactive"}
              </label>
            </div>
          )}

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
              label={isEdit ? "Save Changes" : "Create Service"}
              loadingLabel={isEdit ? "Saving…" : "Creating…"}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
