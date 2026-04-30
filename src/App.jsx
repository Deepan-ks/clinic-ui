import Sidebar from "./components/layout/Sidebar";
import BillingPage from "./pages/BillingPage";
import BillsPage from "./pages/BillsPage";
import BillDetailPage from "./pages/BillDetailPage";
import PatientsPage from "./pages/PatientsPage";
import { Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <div className="flex w-full min-h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Routes>
          <Route path="/" element={<Navigate to="/billing" replace />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/bills/:billId" element={<BillDetailPage />} />
          <Route path="/patients" element={<PatientsPage />} />
        </Routes>
      </div>
    </div>
  );
}
