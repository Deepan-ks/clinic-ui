import { useState, useEffect, useMemo } from "react";
import * as patientsApi from "../api";
import { useToast } from "@/shared/hooks/useToast";

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

export function usePatientsList() {
  const { addToast } = useToast();

  // ── Filter state ────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  // ── Sort state ──────────────────────────────────────────────────
  const [sort, setSort] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  // ── Data state ──────────────────────────────────────────────────
  const [patients, setPatients] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // ── Debounce search input ───────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 500);
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
        const response = await patientsApi.getPatients(queryString);
        if (cancelled) return;
        const { patients: list, totalPages: tp } = normalizeResponse(response);
        setPatients(list);
        setTotalPages(tp);
      } catch (error) {
        if (cancelled) return;
        setPatients([]);
        addToast({
          type: "error",
          message: error.message || "Unable to load patients. Please try again.",
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

  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  return {
    patients,
    setPatients,
    loading,
    totalPages,
    page,
    setPage,
    searchInput,
    setSearchInput,
    sort,
    sortDir,
    handleSort,
    hasPrev,
    hasNext,
  };
}
