import { useState } from "react";
import { useDoctorsList } from "../hooks/useDoctorsList";
import DoctorsTable from "../components/DoctorsTable";
import DoctorFormModal from "../components/DoctorFormModal";
import { Heading, Text } from "@/shared/ui/Typography";
import { normalizeDoctor } from "@/lib/utils/normalizers";

export default function DoctorsPage() {
  const { doctors, setDoctors, loading, specializations } = useDoctorsList();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = () => { setEditing(null); setModalOpen(true); };
  const handleEdit = (doc) => { setEditing(doc); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditing(null); };

  const handleSaved = (saved, isEdit) => {
    const norm = normalizeDoctor(saved);
    if (isEdit) {
      setDoctors((prev) => prev.map((d) => (d.id === norm.id ? norm : d)));
    } else {
      setDoctors((prev) => [norm, ...prev]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <Heading level={1}>Doctors</Heading>
          <Text variant="helper" className="mt-0.5">Manage clinic medical staff and availability</Text>
        </div>
        <button
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

      <div className="p-6">
        <DoctorsTable
          doctors={doctors}
          loading={loading}
          onEdit={handleEdit}
        />
      </div>

      <DoctorFormModal
        open={modalOpen}
        doctor={editing}
        specializations={specializations}
        onClose={handleClose}
        onSaved={handleSaved}
      />
    </div>
  );
}
