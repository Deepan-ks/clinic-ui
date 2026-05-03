import { useState, useEffect, useMemo } from "react";
import * as billsApi from "../api";
import { useToast } from "@/shared/hooks/useToast";

function normalizeBillsResponse(payload) {
  if (payload?.content && Array.isArray(payload.content)) {
    return {
      bills: payload.content,
      totalPages: payload.totalPages ?? 1,
    };
  }
  if (Array.isArray(payload)) return { bills: payload, totalPages: 1 };
  if (Array.isArray(payload?.data)) return { bills: payload.data, totalPages: 1 };

  return { bills: [], totalPages: 0 };
}

const PAGE_SIZE = 10;

export function useBillsList() {
  const { addToast } = useToast();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);

  const [bills, setBills] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);
    params.set("page", String(page));
    params.set("size", String(PAGE_SIZE));
    return params.toString();
  }, [search, fromDate, toDate, page]);

  useEffect(() => {
    let cancelled = false;

    const loadBills = async () => {
      setLoading(true);
      try {
        const response = await billsApi.getBills(queryString);
        if (cancelled) return;

        const { bills: list, totalPages: tp } = normalizeBillsResponse(response);
        setBills(list);
        setTotalPages(tp);
      } catch (error) {
        if (cancelled) return;
        setBills([]);
        addToast({
          type: "error",
          message: error.message || "Unable to load bills. Please try again.",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBills();
    return () => { cancelled = true; };
  }, [queryString, addToast]);

  const handleRangeChange = (from, to) => {
    setFromDate(from);
    setToDate(to);
    setPage(0);
  };

  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  return {
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
  };
}
