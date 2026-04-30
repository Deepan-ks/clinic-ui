import { useEffect, useState } from "react";
import { api } from "../api/api";
import DoctorsTable from "../components/doctors/DoctorsTable";
import DoctorFormModal from "../components/doctors/DoctorFormModal";
import { useToast } from "../hooks/useToast";

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export default function DoctorsPage() {
  const { addToast } = useToast();

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  // ── Load doctors + specializations ───────────────────────────────
  useEffect(() => {
    let cancelled = false;

    Promise.all([
      api.get("/doctors"),
      api.get("/specializations"),
    ])
      .then(([docRes, specRes]) => {
        if (!cancelled) {
          setDoctors(normalizeList(docRes));
          setSpecializations(normalizeList(specRes));
        }
      })
      .catch(() => {
        if (!cancelled)
          addToast({ type: "error", message: "Unable to load doctors." });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [addToast]);

  // ── Modal handlers ────────────────────────────────────────────────
  const handleAdd = () => { setEditingDoctor(null); setModalOpen(true); };
  const handleEdit = (doc) => { setEditingDoctor(doc); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditingDoctor(null); };

  const handleSaved = (saved, isEdit) => {
    if (isEdit) {
      setDoctors((prev) => prev.map((d) => (d.id === saved.id ? saved : d)));
    } else {
      setDoctors((prev) => [saved, ...prev]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Doctors</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage doctors and their specializations</p>
        </div>
        <button
          id="add-doctor-btn"
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Doctor
        </button>
      </div>

      {/* Table */}
      <div className="p-6">
        <DoctorsTable
          doctors={doctors}
          loading={loading}
          onEdit={handleEdit}
        />
      </div>

      {/* Modal */}
      <DoctorFormModal
        open={modalOpen}
        doctor={editingDoctor}
        specializations={specializations}
        onClose={handleClose}
        onSaved={handleSaved}
      />
    </div>
  );
}
