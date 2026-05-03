import { useState, useEffect, useMemo } from "react";
import * as servicesApi from "../api";
import { useToast } from "@/shared/hooks/useToast";
import { normalizeServices, normalizeSpecializations } from "@/lib/utils/normalizers";

export function useServicesList() {
  const { addToast } = useToast();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [specializationId, setSpecializationId] = useState("");

  const [services, setServices] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput.trim()); }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    servicesApi
      .getSpecializations()
      .then((res) => setSpecializations(normalizeSpecializations(res)))
      .catch(() => { });
  }, []);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (specializationId) p.set("specializationId", specializationId);
    p.set("page", "0");
    p.set("size", "50");
    return p.toString();
  }, [search, specializationId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    servicesApi
      .getServices(queryString)
      .then((res) => { if (!cancelled) setServices(normalizeServices(res)); })
      .catch((error) => {
        if (!cancelled) {
          setServices([]);
          addToast({ type: "error", message: error.message || "Unable to load services." });
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [queryString, addToast]);

  return {
    services,
    setServices,
    specializations,
    loading,
    searchInput,
    setSearchInput,
    specializationId,
    setSpecializationId,
  };
}
