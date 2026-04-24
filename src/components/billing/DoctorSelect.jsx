// ── DOCTOR SELECT COMPONENT ─────────────────────────────────────

export function DoctorSelect({
  selectedSpec,
  onSpecChange,
  doctor,
  onDoctorChange,
  specs,
  doctors,
}) {
  return (
    <div
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all ${
        doctor ? "border-emerald-200" : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            doctor ? "bg-emerald-500" : "bg-gray-200"
          }`}
        >
          {doctor && (
            <svg
              className="w-3 h-3 text-white"
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
          )}
        </div>
        <h3
          className={`text-sm font-bold tracking-tight ${
            doctor ? "text-emerald-700" : "text-gray-700"
          }`}
        >
          2 Department & Doctor
        </h3>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Department */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Department
            </p>
            <select
              value={selectedSpec || ""}
              onChange={(e) => {
                onSpecChange(Number(e.target.value) || null);
                onDoctorChange(null);
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select department</option>
              {specs.map((s) => (
                <option key={s.specializationId} value={s.specializationId}>
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
              onChange={(e) => onDoctorChange(Number(e.target.value) || null)}
              disabled={!selectedSpec}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <option value="">
                {selectedSpec ? "Select doctor" : "Select department first"}
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
      </div>
    </div>
  );
}
