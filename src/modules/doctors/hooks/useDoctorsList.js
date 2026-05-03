import { useState, useEffect } from "react";
import * as doctorsApi from "../api";
import { useToast } from "@/shared/hooks/useToast";
import { normalizeDoctors, normalizeSpecializations } from "@/lib/utils/normalizers";

export function useDoctorsList() {
  const { addToast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.allSettled([
      doctorsApi.getDoctors(),
      doctorsApi.getSpecializations(),
    ]).then(([docsRes, specsRes]) => {
      if (cancelled) return;

      if (docsRes.status === "fulfilled") {
        setDoctors(normalizeDoctors(docsRes.value));
      } else {
        addToast({ type: "error", message: "Unable to load doctors." });
      }

      if (specsRes.status === "fulfilled") {
        setSpecializations(normalizeSpecializations(specsRes.value));
      } else {
        addToast({ type: "error", message: "Unable to load specializations." });
      }

      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [addToast]);

  return {
    doctors,
    setDoctors,
    specializations,
    loading,
  };
}
