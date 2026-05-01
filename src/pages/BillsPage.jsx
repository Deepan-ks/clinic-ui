import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import BillsFilterBar from "../components/bills/BillsFilterBar";
import BillsTable from "../components/bills/BillsTable";
import { useToast } from "../hooks/useToast";

const BASE_URL = "http://localhost:8080/api/v1";
const PAGE_SIZE = 10;

function normalizeBillsResponse(payload) {
  // If it's a Spring Page object
  if (payload?.content && Array.isArray(payload.content)) {
    return {
      bills: payload.content,
      totalPages: payload.totalPages ?? 1,
    };
  }
  // Fallback for raw arrays
  if (Array.isArray(payload)) return { bills: payload, totalPages: 1 };
  if (Array.isArray(payload?.data)) return { bills: payload.data, totalPages: 1 };

  return { bills: [], totalPages: 0 };
}

export default function BillsPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();

  // ── Filter state ─────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");          // debounced
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);

  // ── Data state ──────────────────────────────────────────────────
  const [bills, setBills] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  // ── 300ms debounce on search input ───────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0); // Reset to first page on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Build query string ────────────────────────────────────────────
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);
    params.set("page", String(page));
    params.set("size", String(PAGE_SIZE));
    return params.toString();
  }, [search, fromDate, toDate, page]);

  // ── Fetch bills ───────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const loadBills = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/bills?${queryString}`);
        if (cancelled) return;

        const { bills: list, totalPages: tp } = normalizeBillsResponse(response);
        setBills(list);
        setTotalPages(tp);
      } catch {
        if (cancelled) return;
        setBills([]);
        addToast({
          type: "error",
          message: "Unable to load bills. Please try again.",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBills();
    return () => { cancelled = true; };
  }, [queryString, addToast]);

  // ── Handler from DateFilter ───────────────────────────────────────
  const handleRangeChange = (from, to) => {
    setFromDate(from);
    setToDate(to);
    setPage(0); // Reset to first page on date change
  };

  // ── View + Download ───────────────────────────────────────────────
  const handleView = (billId) => {
    if (!billId) return;
    navigate(`/bills/${billId}`);
  };

  const handleDownload = async (billId, billNumber) => {
    if (!billId || downloadingId) return;
    setDownloadingId(billId);
    try {
      const response = await fetch(`${BASE_URL}/bills/${billId}/invoice`);
      if (!response.ok) {
        addToast({ type: "error", message: "Unable to download invoice PDF." });
        setDownloadingId(null);
        return;
      }
      const blob = await response.blob();
      const downloadUrl = globalThis.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `invoice-${billNumber || billId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      globalThis.URL.revokeObjectURL(downloadUrl);
    } catch {
      addToast({ type: "error", message: "Unable to download invoice PDF." });
    } finally {
      setDownloadingId(null);
    }
  };

  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 w-full">
        <h1 className="text-xl font-bold text-gray-900">Bill History</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Search and access previously created bills
        </p>
      </div>

      <div className="p-6 space-y-4">
        <BillsFilterBar
          search={searchInput}
          onSearchChange={setSearchInput}
          onRangeChange={handleRangeChange}
          disabled={loading}
        />

        <BillsTable
          bills={bills}
          loading={loading}
          downloadingId={downloadingId}
          onView={handleView}
          onDownload={handleDownload}
        />

        {/* Pagination UI */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
            <span className="text-xs font-medium text-gray-500">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => p - 1)}
                disabled={!hasPrev}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
