import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as patientsApi from "../api";
import LoadingButton from "@/shared/ui/LoadingButton";
import FormError from "@/shared/ui/FormError";
import { useToast } from "@/shared/hooks/useToast";
import { useApiErrorHandler } from "@/shared/hooks/useApiErrorHandler";

export default function PatientFormModal({ open, patient, onClose, onSaved }) {
  const { addToast } = useToast();
  const { handleError } = useApiErrorHandler();
  const isEdit = Boolean(patient);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      age: "",
      gender: "",
      address: "",
      email: "",
    },
  });

  // Populate form when editing or reset when opening new
  useEffect(() => {
    if (open) {
      if (patient) {
        reset({
          name: patient.name || patient.patientName || "",
          phone: patient.phone || patient.phoneNumber || "",
          age: patient.age != null ? String(patient.age) : "",
          gender: patient.gender || "",
          address: patient.address || "",
          email: patient.email || "",
        });
      } else {
        reset({
          name: "",
          phone: "",
          age: "",
          gender: "",
          address: "",
          email: "",
        });
      }
    }
  }, [open, patient, reset]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        name: data.name.trim(),
        phone: data.phone.trim(),
        age: Number(data.age),
        email: data.email.trim() || null,
      };

      let saved;
      if (isEdit) {
        const patientId = patient.id ?? patient.patientId;
        saved = await patientsApi.updatePatient(patientId, payload);
        addToast({ type: "success", message: "Patient updated successfully." });
      } else {
        saved = await patientsApi.createPatient(payload);
        addToast({ type: "success", message: "Patient created successfully." });
      }

      onSaved(saved, isEdit);
      handleClose();
    } catch (error) {
      handleError(error, isEdit ? "Unable to update patient." : "Unable to create patient.");
    }
  };

  if (!open) return null;

  const inputCls = (fieldName) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
      errors[fieldName] ? "border-rose-400" : "border-gray-200"
    }`;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/30 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Patient" : "Add Patient"}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-5 py-4 space-y-4 overflow-y-auto flex-1"
          noValidate
        >
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("name", { 
                required: "Name is required",
                minLength: { value: 2, message: "Min 2 characters" }
              })}
              className={inputCls("name")}
              placeholder="Patient full name"
              autoFocus
            />
            <FormError message={errors.name?.message} />
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Age <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                {...register("age", { 
                  required: "Age is required",
                  min: { value: 0, message: "Min 0" },
                  max: { value: 150, message: "Max 150" }
                })}
                className={inputCls("age")}
                placeholder="Age"
              />
              <FormError message={errors.age?.message} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className={`${inputCls("gender")} bg-white`}
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <FormError message={errors.gender?.message} />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Phone <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              {...register("phone", { 
                required: "Phone is required",
                pattern: { value: /^\d{10}$/, message: "Must be 10 digits" }
              })}
              className={inputCls("phone")}
              placeholder="10-digit phone number"
              maxLength={10}
            />
            <FormError message={errors.phone?.message} />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              {...register("address", { required: "Address is required" })}
              rows={3}
              className={`${inputCls("address")} resize-none`}
              placeholder="Street, City, State"
            />
            <FormError message={errors.address?.message} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Email <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="email"
              {...register("email", { 
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
              })}
              className={inputCls("email")}
              placeholder="patient@example.com"
            />
            <FormError message={errors.email?.message} />
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              disabled={!isValid}
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
