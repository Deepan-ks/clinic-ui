import { useCallback } from "react";
import { useToast } from "@/shared/hooks/useToast";

export function useApiErrorHandler() {
  const { addToast } = useToast();

  const handleError = useCallback((error, customMessage) => {
    const message = error.message || customMessage || "An unexpected error occurred.";
    addToast({
      type: "error",
      message: message
    });
    console.error("[API Error]:", error);
  }, [addToast]);

  return { handleError };
}
