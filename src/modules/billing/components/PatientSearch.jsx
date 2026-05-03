// ── PATIENT SEARCH COMPONENT ─────────────────────────────────────

import { usePatientSearch } from "../hooks/usePatientSearch";
import { Avatar } from "@/shared/ui/Avatar";
import { XIcon } from "@/shared/icons";
import { StepStatus } from "@/shared/ui/StepStatus";
import SearchBar from "@/shared/ui/SearchBar";
import { usePatientModal } from "@/shared/providers/PatientModalProvider";

export function PatientSearch({ patient, onSelect }) {
  const { openModal } = usePatientModal();
  const {
    query,
    setQuery,
    results,
    showDrop,
    searching,
    searchRef,
    setShowDrop,
    pickPatient,
    clearPatient,
  } = usePatientSearch();

  const handleSelect = (p) => {
    const selected = pickPatient(p);
    onSelect(selected);
  };

  const handleClear = () => {
    const cleared = clearPatient();
    onSelect(cleared);
  };

  const handleCreated = (createdPatient) => {
    const selected = pickPatient(createdPatient);
    onSelect(selected);
    setShowDrop(false);
    setQuery(createdPatient.name || createdPatient.patientName || "");
  };

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all ${
        patient ? "border-emerald-200" : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <StepStatus completed={!!patient} />
        <p className="font-semibold text-sm">Patient</p>
      </div>

      <div className="px-6 py-5">
        <div ref={searchRef} className="relative space-y-2">
          {/* Search Input */}
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient by name or phone..."
            loading={searching}
          />

          {!patient && query.trim().length === 0 && (
            <button
              type="button"
              onClick={() => openModal(handleCreated)}
              className="inline-block text-xs font-semibold text-blue-600 hover:text-blue-700 mt-2"
            >
              + Add Patient
            </button>
          )}

          {/* Dropdown Results */}
          {showDrop && !patient && results.length > 0 && (
            <div className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              {results.map((p) => (
                <button
                  key={p.patientId || p.id}
                  onMouseDown={() => handleSelect(p)}
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

          {/* No Results */}
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
                <button
                  type="button"
                  onClick={() => openModal(handleCreated)}
                  className="inline-block mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  + Add Patient
                </button>
              </div>
            )}
        </div>

        {/* Selected Patient Display */}
        {patient && (
          <div className="mt-2 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 shadow-sm">
            <Avatar name={patient.name || patient.patientName} size="md" />
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
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition-colors ml-1"
            >
              <XIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
