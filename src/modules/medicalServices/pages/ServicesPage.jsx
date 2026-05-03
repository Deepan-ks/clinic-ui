import { useState } from "react";
import { useServicesList } from "../hooks/useServicesList";
import ServicesFilterBar from "../components/ServicesFilterBar";
import ServicesTable from "../components/ServicesTable";
import ServiceFormModal from "../components/ServiceFormModal";
import { Heading, Text } from "@/shared/ui/Typography";
import { normalizeService } from "@/lib/utils/normalizers";

export default function ServicesPage() {
  const {
    services,
    setServices,
    specializations,
    loading,
    searchInput,
    setSearchInput,
    specializationId,
    setSpecializationId,
  } = useServicesList();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleAdd = () => { setEditingService(null); setModalOpen(true); };
  const handleEdit = (svc) => { setEditingService(svc); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditingService(null); };

  const handleSaved = (saved, isEdit) => {
    const norm = normalizeService(saved);
    if (isEdit) {
      setServices((prev) => prev.map((s) => (s.id === norm.id ? norm : s)));
    } else {
      setServices((prev) => [norm, ...prev]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <Heading level={1}>Services</Heading>
        <Text variant="helper" className="mt-0.5">Manage billable services and pricing</Text>
      </div>

      <div className="p-6 space-y-4">
        <ServicesFilterBar
          search={searchInput}
          onSearchChange={setSearchInput}
          specializationId={specializationId}
          onSpecializationChange={setSpecializationId}
          specializations={specializations}
          onAdd={handleAdd}
          disabled={loading}
        />

        <ServicesTable
          services={services}
          loading={loading}
          onEdit={handleEdit}
          specializations={specializations}
        />
      </div>

      <ServiceFormModal
        open={modalOpen}
        service={editingService}
        specializations={specializations}
        onClose={handleClose}
        onSaved={handleSaved}
      />
    </div>
  );
}
