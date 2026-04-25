import { StepStatus } from "../ui/StepStatus";

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
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <StepStatus active={!!selectedSpec} completed={!!doctor} />
        <p className="font-semibold text-sm">Department & Doctor</p>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Department */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Department
            </p>
            <div className="relative">
              <select
                value={selectedSpec || ""}
                onChange={(e) => {
                  onSpecChange(Number(e.target.value) || null);
                  onDoctorChange(null);
                }}
                className="appearance-none w-full border border-gray-200 rounded-lg px-4 py-2 pr-10 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select department</option>
                {specs.map((s) => (
                  <option key={s.specializationId} value={s.specializationId}>
                    {s.specializationName}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </div>
            </div>
          </div>

          {/* Doctor */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Doctor
            </p>
            <div className="relative">
              <select
                value={doctor || ""}
                onChange={(e) => onDoctorChange(Number(e.target.value) || null)}
                disabled={!selectedSpec}
                className="appearance-none w-full border border-gray-200 
                    rounded-lg px-4 py-2 pr-10 bg-white 
                    focus:ring-2 focus:ring-blue-500 outline-none"
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
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </div>
            </div>
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
