import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import ServicesFilterBar from "../components/services/ServicesFilterBar";
import ServicesTable from "../components/services/ServicesTable";
import ServiceFormModal from "../components/services/ServiceFormModal";
import { useToast } from "../hooks/useToast";

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export default function ServicesPage() {
  const { addToast } = useToast();

  // ── Filter state ─────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [specializationId, setSpecializationId] = useState("");

  // ── Data ─────────────────────────────────────────────────────────
  const [services, setServices] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Modal ─────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // ── Debounce search ───────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput.trim()); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Load specializations once ─────────────────────────────────────
  useEffect(() => {
    api
      .get("/specializations")
      .then((res) => setSpecializations(normalizeList(res)))
      .catch(() => {});
  }, []);

  // ── Build query ───────────────────────────────────────────────────
  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (specializationId) p.set("specializationId", specializationId);
    p.set("page", "0");
    p.set("size", "50");
    return p.toString();
  }, [search, specializationId]);

  // ── Fetch services ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/services?${queryString}`)
      .then((res) => { if (!cancelled) setServices(normalizeList(res)); })
      .catch(() => {
        if (!cancelled) {
          setServices([]);
          addToast({ type: "error", message: "Unable to load services." });
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [queryString, addToast]);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleAdd   = () => { setEditingService(null); setModalOpen(true); };
  const handleEdit  = (svc) => { setEditingService(svc); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditingService(null); };

  const handleSaved = (saved, isEdit) => {
    if (isEdit) {
      setServices((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
    } else {
      setServices((prev) => [saved, ...prev]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Services</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage billable services and pricing</p>
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
