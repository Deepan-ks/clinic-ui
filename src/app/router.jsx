import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "@/shared/ui/Loader";

// Lazy loaded feature pages
const CreateBillPage = lazy(() => import("@/modules/billing/pages/CreateBillPage"));
const BillHistoryPage = lazy(() => import("@/modules/billing/pages/BillHistoryPage"));
const BillDetailPage = lazy(() => import("@/modules/billing/pages/BillDetailPage"));
const PatientsPage = lazy(() => import("@/modules/patients/pages/PatientsPage"));
const DoctorsPage = lazy(() => import("@/modules/doctors/pages/DoctorsPage"));
const ServicesPage = lazy(() => import("@/modules/medicalServices/pages/ServicesPage"));
const SpecializationsPage = lazy(() => import("@/modules/specializations/pages/SpecializationsPage"));

export function AppRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/"                   element={<Navigate to="/billing" replace />} />
        <Route path="/billing"            element={<CreateBillPage />} />
        <Route path="/bills"              element={<BillHistoryPage />} />
        <Route path="/bills/:billId"      element={<BillDetailPage />} />
        <Route path="/patients"           element={<PatientsPage />} />
        <Route path="/doctors"            element={<DoctorsPage />} />
        <Route path="/services"           element={<ServicesPage />} />
        <Route path="/specializations"    element={<SpecializationsPage />} />
      </Routes>
    </Suspense>
  );
}
