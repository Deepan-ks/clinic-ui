import { useMemo, useState, useEffect } from "react";
import * as specializationsApi from "../api";
import LoadingButton from "@/shared/ui/LoadingButton";
import FormError from "@/shared/ui/FormError";
import { useToast } from "@/shared/hooks/useToast";
import { validateRequiredName } from "@/lib/utils/validators";

const INITIAL_FORM = { name: "" };

export default function SpecializationFormModal({
  open,
  specialization,   // null → add mode, object → edit mode
  existingNames,    // string[] of already-used names (for duplicate check)
  onClose,
  onSaved,
}) {
  const { addToast } = useToast();
  const isEdit = Boolean(specialization);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ name: specialization?.name ?? "" });
      setErrors({});
    }
  }, [open, specialization]);

  const canSubmit = useMemo(() => Boolean(form.name.trim()), [form.name]);

  const handleChange = (value) => {
    setForm({ name: value });
    setErrors({});
  };

  const validate = () => {
    const nextErrors = {};
    const trimmed = form.name.trim();
    // Standard name rules first
    const nameErr = validateRequiredName(trimmed, "Specialization name");
    if (nameErr) {
      nextErrors.name = nameErr;
    } else {
      // Duplicate check (case-insensitive), exclude self when editing
      const lower = trimmed.toLowerCase();
      const isDup = existingNames.some(
        (n) =>
          n.toLowerCase() === lower &&
          n.toLowerCase() !== (specialization?.name ?? "").toLowerCase(),
      );
      if (isDup) nextErrors.name = "A specialization with this name already exists";
    }
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
      const payload = { name: form.name.trim(), status: "ACTIVE" };
      let saved;
      if (isEdit) {
        saved = await specializationsApi.updateSpecialization(specialization.id, payload);
        addToast({ type: "success", message: "Specialization updated." });
      } else {
        saved = await specializationsApi.createSpecialization(payload);
        addToast({ type: "success", message: "Specialization added." });
      }
      onSaved(saved, isEdit);
      handleClose();
    } catch (error) {
      addToast({
        type: "error",
        message: error.message || (isEdit
          ? "Unable to update specialization."
          : "Unable to create specialization."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/30 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Specialization" : "Add Specialization"}
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
          <div>
            <label htmlFor="spec-name" className="block text-xs font-semibold text-gray-500 mb-1">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="spec-name"
              value={form.name}
              onChange={(e) => handleChange(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.name ? "border-rose-400" : "border-gray-200"
              }`}
              placeholder="e.g. Cardiology"
              autoFocus
              autoComplete="off"
            />
            <FormError message={errors.name} />
          </div>

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
              label={isEdit ? "Save" : "Add"}
              loadingLabel={isEdit ? "Saving…" : "Adding…"}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
