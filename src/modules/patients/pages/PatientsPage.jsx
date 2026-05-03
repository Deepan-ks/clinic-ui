import { useState } from "react";
import { usePatientsList } from "../hooks/usePatientsList";
import PatientsFilterBar from "../components/PatientsFilterBar";
import PatientsTable from "../components/PatientsTable";
import PatientFormModal from "../components/PatientFormModal";
import { Heading, Text } from "@/shared/ui/Typography";

export default function PatientsPage() {
  const {
    patients,
    setPatients,
    loading,
    totalPages,
    page,
    setPage,
    searchInput,
    setSearchInput,
    sort,
    sortDir,
    handleSort,
    hasPrev,
    hasNext,
  } = usePatientsList();

  // ── Modal state ─────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // ── Modal handlers ──────────────────────────────────────────────
  const handleAdd = () => {
    setEditingPatient(null);
    setModalOpen(true);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingPatient(null);
  };

  const handleSaved = (saved, isEdit) => {
    if (isEdit) {
      // Update the row in-place
      setPatients((prev) =>
        prev.map((p) => {
          const pId = p.id ?? p.patientId;
          const savedId = saved.id ?? saved.patientId;
          return pId === savedId ? saved : p;
        }),
      );
    } else {
      // Prepend new patient (best-effort; server is authoritative)
      setPatients((prev) => [saved, ...prev]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      {/* Page header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 w-full">
        <Heading level={1}>Patients</Heading>
        <Text variant="helper" className="mt-0.5">
          Search, add, and manage patient records
        </Text>
      </div>

      <div className="p-6 space-y-4">
        {/* Filter bar */}
        <PatientsFilterBar
          search={searchInput}
          onSearchChange={setSearchInput}
          onAdd={handleAdd}
          disabled={loading}
        />

        {/* Table */}
        <PatientsTable
          patients={patients}
          loading={loading}
          sort={sort}
          sortDir={sortDir}
          onSort={handleSort}
          onEdit={handleEdit}
        />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
            <Text variant="label-sm">
              Page {page + 1} of {totalPages}
            </Text>
            <div className="flex gap-2">
              <button
                id="patients-prev-btn"
                type="button"
                onClick={() => setPage((p) => p - 1)}
                disabled={!hasPrev}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>
              <button
                id="patients-next-btn"
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      <PatientFormModal
        open={modalOpen}
        patient={editingPatient}
        onClose={handleModalClose}
        onSaved={handleSaved}
      />
    </div>
  );
}
