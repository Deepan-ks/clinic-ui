import { useEffect, useState } from "react";
import { api } from "../api/api";
import SpecializationList from "../components/specializations/SpecializationList";
import SpecializationFormModal from "../components/specializations/SpecializationFormModal";
import { useToast } from "../hooks/useToast";

export default function SpecializationsPage() {
  const { addToast } = useToast();
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get("/specializations")
      .then((res) => {
        if (!cancelled) {
          const list = Array.isArray(res)
            ? res
            : Array.isArray(res?.content)
            ? res.content
            : [];
          setSpecializations(list);
        }
      })
      .catch(() => {
        if (!cancelled)
          addToast({ type: "error", message: "Unable to load specializations." });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [addToast]);

  const existingNames = specializations.map((s) => s.name);

  const handleAdd = () => { setEditing(null); setModalOpen(true); };
  const handleEdit = (spec) => { setEditing(spec); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditing(null); };

  const handleSaved = (saved, isEdit) => {
    if (isEdit) {
      setSpecializations((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
    } else {
      setSpecializations((prev) => [...prev, saved]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Specializations</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage departments and specialization categories</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Specialization
        </button>
      </div>

      <div className="p-6 max-w-xl">
        <SpecializationList
          specializations={specializations}
          loading={loading}
          onEdit={handleEdit}
        />
      </div>

      <SpecializationFormModal
        open={modalOpen}
        specialization={editing}
        existingNames={existingNames}
        onClose={handleClose}
        onSaved={handleSaved}
      />
    </div>
  );
}
