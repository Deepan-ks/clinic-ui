import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import BillSummaryCard from "../components/bills/BillSummaryCard";
import BillItemsTable from "../components/bills/BillItemsTable";
import BillTotals from "../components/bills/BillTotals";
import LoadingButton from "../components/common/LoadingButton";
import { useToast } from "../hooks/useToast";
import { Heading, Text } from "../components/ui/Typography";
import { API_BASE_URL } from "../config/env";

const BASE_URL = API_BASE_URL;

const toNum = (value) => {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
};

function normalizeBill(payload) {
  const itemsSource = payload?.items || payload?.lineItems || payload?.services || [];
  const items = (Array.isArray(itemsSource) ? itemsSource : []).map((item) => {
    const quantity = toNum(item.quantity ?? item.qty ?? item.count ?? 1);
    const price = toNum(item.price ?? item.unitPrice ?? item.rate ?? 0);
    const total = toNum(item.total ?? item.lineTotal ?? quantity * price);

    return {
      id: item.id ?? item.serviceId,
      name: item.name ?? item.serviceName ?? "-",
      quantity,
      price,
      total,
    };
  });

  const computedSubtotal = items.reduce((sum, item) => sum + item.total, 0);
  const subtotal = toNum(payload?.subtotal ?? payload?.subTotal ?? computedSubtotal);
  const discount = toNum(payload?.discountAmount ?? payload?.discount ?? 0);
  const total = toNum(payload?.totalAmount ?? payload?.total ?? payload?.netAmount ?? subtotal - discount);

  return {
    id: payload?.id ?? payload?.billId,
    billNumber: payload?.billNumber ?? payload?.invoiceNumber ?? "-",
    patientName: payload?.patientName ?? payload?.patient?.name ?? payload?.patient?.patientName ?? "-",
    doctorName: payload?.doctorName ?? payload?.doctor?.name ?? payload?.doctor?.doctorName ?? "-",
    date: payload?.createdTime ?? payload?.createdAt ?? payload?.billDate ?? payload?.date ?? null,
    items,
    subtotal,
    discount,
    total,
  };
}

export default function BillDetailPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { billId } = useParams();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const parsedBillId = useMemo(() => {
    if (!billId) return null;
    return billId;
  }, [billId]);

  useEffect(() => {
    let cancelled = false;

    const loadBill = async () => {
      if (!parsedBillId) {
        setError("Invalid bill ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/bills/${parsedBillId}`);
        if (cancelled) return;
        setBill(normalizeBill(response || {}));
      } catch {
        if (cancelled) return;
        setBill(null);
        setError("Unable to load bill details.");
        addToast({
          type: "error",
          message: "Failed to load bill details.",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBill();
    return () => {
      cancelled = true;
    };
  }, [addToast, parsedBillId]);

  const handleDownload = async () => {
    if (!parsedBillId || downloading) return;
    setDownloading(true);

    try {
      const response = await fetch(`${BASE_URL}/bills/${parsedBillId}/invoice`);
      if (!response.ok) {
        addToast({ type: "error", message: "Unable to download invoice PDF." });
        setDownloading(false);
        return;
      }

      const blob = await response.blob();
      const downloadUrl = globalThis.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `invoice-${bill?.billNumber || parsedBillId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      globalThis.URL.revokeObjectURL(downloadUrl);
    } catch {
      addToast({ type: "error", message: "Unable to download invoice PDF." });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Heading level={1}>Bill Detail</Heading>
            <Text variant="helper" className="mt-1">Review full bill information without downloading PDF</Text>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/bills")}
              className="px-3.5 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-700"
            >
              Back
            </button>
            <LoadingButton
              isLoading={downloading}
              onClick={handleDownload}
              label="Download PDF"
              loadingLabel="Downloading..."
              disabled={!bill || loading || !!error}
              className="px-3.5 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white disabled:bg-gray-200 disabled:text-gray-400"
            />
          </div>
        </div>

        {error ? (
          <div className="bg-white border border-rose-200 rounded-xl p-6">
            <Text variant="label-md" className="text-rose-700">{error}</Text>
          </div>
        ) : (
          <>
            <BillSummaryCard
              bill={
                bill || {
                  billNumber: "-",
                  patientName: "-",
                  doctorName: "-",
                  date: null,
                }
              }
            />
            <BillItemsTable items={bill?.items || []} loading={loading} />
            {!loading && bill && (
              <BillTotals
                subtotal={bill.subtotal}
                discount={bill.discount}
                total={bill.total}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

