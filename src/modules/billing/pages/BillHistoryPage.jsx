import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBillsList } from "../hooks/useBillsList";
import BillsFilterBar from "../components/BillsFilterBar";
import BillsTable from "../components/BillsTable";
import { useToast } from "@/shared/hooks/useToast";
import { Heading, Text } from "@/shared/ui/Typography";
import * as billingApi from "../api";

export default function BillHistoryPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const {
    bills,
    loading,
    totalPages,
    page,
    setPage,
    searchInput,
    setSearchInput,
    handleRangeChange,
    hasPrev,
    hasNext,
  } = useBillsList();

  const [downloadingId, setDownloadingId] = useState(null);

  const handleView = (billId) => {
    if (!billId) return;
    navigate(`/bills/${billId}`);
  };

  const handleDownload = async (billId, billNumber) => {
    if (!billId || downloadingId) return;
    setDownloadingId(billId);
    try {
      const blob = await billingApi.downloadInvoice(billId);
      const downloadUrl = globalThis.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `invoice-${billNumber || billId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      globalThis.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      addToast({ type: "error", message: err.message || "Unable to download invoice PDF." });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 w-full">
        <Heading level={1}>Bill History</Heading>
        <Text variant="helper" className="mt-0.5">
          Search and access previously created bills
        </Text>
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
            <Text variant="label-sm">
              Page {page + 1} of {totalPages}
            </Text>
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
