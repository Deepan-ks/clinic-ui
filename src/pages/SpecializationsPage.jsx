import { useEffect, useState } from "react";
import { api } from "../api/api";
import { normalizeSpecializations } from "../api/normalizers";
import SpecializationList from "../components/specializations/SpecializationList";
import SpecializationFormModal from "../components/specializations/SpecializationFormModal";
import { useToast } from "../hooks/useToast";
import { Heading, Text } from "../components/ui/Typography";

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
        if (!cancelled) setSpecializations(normalizeSpecializations(res));
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
    // Normalise the response from POST/PUT too
    const norm = { ...saved, id: saved.id ?? saved.specializationId, name: saved.name ?? saved.specializationName ?? "" };
    if (isEdit) {
      setSpecializations((prev) => prev.map((s) => (s.id === norm.id ? norm : s)));
    } else {
      setSpecializations((prev) => [...prev, norm]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <Heading level={1}>Specializations</Heading>
          <Text variant="helper" className="mt-0.5">Manage departments and specialization categories</Text>
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
