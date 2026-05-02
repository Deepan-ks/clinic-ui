import { NavLink } from "react-router-dom";
import { Heading, Text } from "../ui/Typography";

const NAV = [
  { to: "/billing",         label: "New Bill",         icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { to: "/bills",           label: "Bill History",     icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { to: "/patients",        label: "Patients",         icon: "M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" },
  { to: "/doctors",         label: "Doctors",          icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { to: "/services",        label: "Services",         icon: "M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { to: "/specializations", label: "Specializations",  icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
];

export default function Sidebar() {
  const navCls = ({ isActive }) =>
    `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-600 font-semibold"
        : "text-gray-600 hover:bg-gray-100 font-medium"
    }`;

  return (
    <div className="w-56 bg-white border-r border-gray-200 p-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="mb-6 px-2.5">
          <Heading level={6} className="text-gray-900">Clinic Assist</Heading>
          <Text variant="xs" className="mt-0.5 lowercase tracking-normal">Practice Management</Text>
        </div>

        <nav className="space-y-0.5">
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={navCls}>
              <div className="w-5 flex justify-center shrink-0">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} />
                </svg>
              </div>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <Text variant="xs" className="px-2.5">Support</Text>
    </div>
  );
}
