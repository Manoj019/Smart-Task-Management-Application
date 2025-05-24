import React from "react";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  label: string;
}

function NavItem({
  to,
  label,
}: React.PropsWithChildren<NavItemProps>): React.ReactElement {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-lg transition-colors ${
          isActive
            ? "bg-blue-800 text-white"
            : "text-gray-300 hover:bg-blue-700/40"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function Sidebar(): React.ReactElement {
  return (
    <div className="w-64 bg-[#1e293b] text-white flex flex-col justify-between sticky top-0 h-screen">
      <div>
        <div className="p-6 text-xl font-bold text-blue-400">TaskMaster</div>
        <nav className="flex flex-col gap-1 px-4 text-sm">
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/tasks" label="My Tasks" />
          <NavItem to="/newtask" label="Add Task" />
          <NavItem to="/analytics" label="Analytics" />
          <NavItem to="/createaccounts" label="Create Account" />
          <NavItem to="/userslist" label="User Management" />
        </nav>
      </div>
      <div className="px-4 pb-6 flex flex-col gap-1 text-sm">
        <NavItem to="/settings" label="Settings" />
        <NavItem to="/support" label="Help & Support" />
      </div>
    </div>
  );
}

export default Sidebar;
