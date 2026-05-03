import { ToastProvider } from "@/shared/providers/ToastProvider";
import { PatientModalProvider } from "@/shared/providers/PatientModalProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PatientModalProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </PatientModalProvider>
    </QueryClientProvider>
  );
}
