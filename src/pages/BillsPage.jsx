import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import BillsFilterBar from "../components/bills/BillsFilterBar";
import BillsTable from "../components/bills/BillsTable";
import { useToast } from "../hooks/useToast";

const BASE_URL = "http://localhost:8080/api/v1";

function normalizeBillsResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export default function BillsPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();

  // ── Filter state ─────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");          // debounced
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  // ── 300ms debounce on search input ───────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Build query string ────────────────────────────────────────────
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search)   params.set("search",   search);
    if (fromDate) params.set("fromDate", fromDate);
    if (toDate)   params.set("toDate",   toDate);
    params.set("page", "0");
    params.set("size", "50");
    return params.toString();
  }, [search, fromDate, toDate]);

  // ── Fetch bills ───────────────────────────────────────────────────
  useEffect(() => {
    // Don't fetch until the date range has been initialised by DateFilter
    if (!fromDate && !toDate) return;

    let cancelled = false;

    const loadBills = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/bills?${queryString}`);
        if (cancelled) return;
        setBills(normalizeBillsResponse(response));
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
  }, [queryString, fromDate, toDate, addToast]);

  // ── Handler from DateFilter ───────────────────────────────────────
  const handleRangeChange = (from, to) => {
    setFromDate(from);
    setToDate(to);
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
      </div>
    </div>
  );
}
