import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navClassName = ({ isActive }) =>
    `block p-2 rounded transition ${
      isActive
        ? "bg-blue-50 text-blue-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between">
      <div>
        <h1 className="text-lg font-bold mb-6">Clinic Assist</h1>

        <nav className="space-y-2">
          <NavLink to="/billing" className={navClassName}>
            New Bill
          </NavLink>
          <NavLink to="/bills" className={navClassName}>
            Bill History
          </NavLink>
          <NavLink to="/patients" className={navClassName}>
            Patients
          </NavLink>
        </nav>
      </div>

      <div className="text-sm text-gray-400">Support</div>
    </div>
  );
}
