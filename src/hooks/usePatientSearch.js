// ── PATIENT SEARCH HOOK ─────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { api } from "../api/api";

export function usePatientSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowDrop(false);
      return;
    }

    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await api.get(
          `/patients/search?query=${encodeURIComponent(query)}`
        );
        setResults(Array.isArray(res) ? res : []);
        setShowDrop(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!searchRef.current?.contains(e.target)) {
        setShowDrop(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pickPatient = (patient) => {
    setQuery(patient.name || patient.patientName || "");
    setShowDrop(false);
    return patient;
  };

  const clearPatient = () => {
    setQuery("");
    setResults([]);
    return null;
  };

  return {
    query,
    setQuery,
    results,
    showDrop,
    searching,
    searchRef,
    setShowDrop,
    pickPatient,
    clearPatient,
  };
}