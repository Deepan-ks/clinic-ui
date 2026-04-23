import Sidebar from "./components/layout/Sidebar";
import BillingPage from "./pages/BillingPage";

export default function App() {
  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <Sidebar />
      <BillingPage />
    </div>
  );
}
