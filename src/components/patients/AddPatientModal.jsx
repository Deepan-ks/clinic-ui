import { useMemo, useState } from "react";
import { api } from "../../api/api";
import LoadingButton from "../common/LoadingButton";
import FormError from "../common/FormError";
import { useToast } from "../../hooks/useToast";

const INITIAL_FORM = {
  name: "",
  phone: "",
  age: "",
  gender: "",
};

export default function AddPatientModal({ open, onClose, onCreated }) {
  const { addToast } = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => Boolean(form.name.trim() && form.phone.trim()),
    [form.name, form.phone],
  );

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

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
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.phone.trim()) nextErrors.phone = "Phone is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
      };

      const created = await api.post("/patients", payload);
      addToast({
        type: "success",
        message: "Patient created successfully.",
      });
      onCreated(created);
      handleClose();
    } catch {
      addToast({
        type: "error",
        message: "Unable to create patient. Please retry.",
      });
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-xl">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Add Patient</h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-sm font-semibold text-gray-400 hover:text-gray-600"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Name *</label>
            <input
              value={form.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Patient name"
            />
            <FormError message={errors.name} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Phone *</label>
            <input
              value={form.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Phone number"
            />
            <FormError message={errors.phone} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Age</label>
              <input
                type="number"
                min="0"
                value={form.age}
                onChange={(e) => handleFieldChange("age", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="Age"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => handleFieldChange("gender", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              isLoading={submitting}
              disabled={!canSubmit}
              label="Create Patient"
              loadingLabel="Creating..."
              className="px-3.5 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white disabled:bg-gray-200 disabled:text-gray-400"
            />
          </div>
        </form>
      </div>
    </div>
  );
}


