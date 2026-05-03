import { useState, useEffect } from "react";
import * as specializationsApi from "../api";
import { useToast } from "@/shared/hooks/useToast";
import { normalizeSpecializations } from "@/lib/utils/normalizers";

export function useSpecializationsList() {
  const { addToast } = useToast();
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    specializationsApi
      .getSpecializations()
      .then((res) => {
        if (!cancelled) setSpecializations(normalizeSpecializations(res));
      })
      .catch((error) => {
        if (!cancelled)
          addToast({ type: "error", message: error.message || "Unable to load specializations." });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [addToast]);

  return {
    specializations,
    setSpecializations,
    loading,
  };
}
