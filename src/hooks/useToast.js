import { useContext } from "react";
import { ToastContext } from "../components/common/ToastContext";

export function useToast() {
  return useContext(ToastContext);
}

