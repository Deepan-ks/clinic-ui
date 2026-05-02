import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import PatientsFilterBar from "../components/patients/PatientsFilterBar";
import PatientsTable from "../components/patients/PatientsTable";
import PatientFormModal from "../components/patients/PatientFormModal";
import { useToast } from "../hooks/useToast";
import { Heading, Text } from "../components/ui/Typography";

function normalizeResponse(payload) {
  if (Array.isArray(payload)) return { patients: payload, totalPages: 1 };
  if (Array.isArray(payload?.content))
    return {
      patients: payload.content,
      totalPages: payload.totalPages ?? 1,
    };
  if (Array.isArray(payload?.data))
    return { patients: payload.data, totalPages: payload.totalPages ?? 1 };
  return { patients: [], totalPages: 0 };
}

const PAGE_SIZE = 20;

export default function PatientsPage() {
  const { addToast } = useToast();

  // ── Filter state ────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  // ── Sort state ──────────────────────────────────────────────────
  const [sort, setSort] = useState("");       // field name, e.g. "name" | "createdDate"
  const [sortDir, setSortDir] = useState("asc");

  // ── Data state ──────────────────────────────────────────────────
  const [patients, setPatients] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // ── Modal state ─────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // ── Debounce search input ───────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Sort toggle ─────────────────────────────────────────────────
  const handleSort = (field) => {
    if (sort === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(field);
      setSortDir("asc");
    }
    setPage(0);
  };

  // ── Build query string ──────────────────────────────────────────
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort) {
      params.set("sort", sort);
      params.set("direction", sortDir);
    }
    params.set("page", String(page));
    params.set("size", String(PAGE_SIZE));
    return params.toString();
  }, [search, sort, sortDir, page]);

  // ── Fetch patients ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/patients?${queryString}`);
        if (cancelled) return;
        const { patients: list, totalPages: tp } = normalizeResponse(response);
        setPatients(list);
        setTotalPages(tp);
      } catch {
        if (cancelled) return;
        setPatients([]);
        addToast({
          type: "error",
          message: "Unable to load patients. Please try again.",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [queryString, addToast]);

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

  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

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
