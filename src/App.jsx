import Sidebar from "@/shared/layout/Sidebar";
import { AppRouter } from "@/app/router";
import { GlobalModals } from "@/app/GlobalModals";

export default function App() {
  return (
    <div className="flex w-full min-h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <AppRouter />
      </div>
      <GlobalModals />
    </div>
  );
}
