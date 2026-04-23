export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between">
      <div>
        <h1 className="text-lg font-bold mb-6">Clinic Assist</h1>

        <nav className="space-y-2 text-gray-600">
          <div className="p-2 rounded hover:bg-gray-100">Dashboard</div>
          <div className="p-2 rounded hover:bg-gray-100">Patients</div>

          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
            Billing
          </div>

          <div className="p-2 rounded hover:bg-gray-100">Appointments</div>
          <div className="p-2 rounded hover:bg-gray-100">Settings</div>
        </nav>
      </div>

      <div className="text-sm text-gray-400">Support</div>
    </div>
  );
}
