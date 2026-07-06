import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../../hooks/useAuth";

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "POS", path: "/pos", icon: "https://img.icons8.com/fluency/48/shop.png", roles: ["admin", "cashier"] },
  { label: "Dashboard", path: "/admin", icon: "https://img.icons8.com/fluency/48/dashboard.png", roles: ["admin"] },
  { label: "Orders", path: "/orders", icon: "https://img.icons8.com/fluency/48/list.png", roles: ["admin", "cashier"] },
  { label: "Customers", path: "/customers", icon: "https://img.icons8.com/fluency/48/user-group.png", roles: ["admin", "cashier"] },
  { label: "Services", path: "/services", icon: "https://img.icons8.com/fluency/48/services.png", roles: ["admin"] },
  { label: "Inventory", path: "/inventory", icon: "https://img.icons8.com/fluency/48/box.png", roles: ["admin"] },
  { label: "Employees", path: "/employees", icon: "https://img.icons8.com/fluency/48/employee.png", roles: ["admin"] },
  { label: "Reports", path: "/reports", icon: "https://img.icons8.com/fluency/48/report.png", roles: ["admin"] },
  { label: "Task Queue", path: "/employee", icon: "https://img.icons8.com/fluency/48/task.png", roles: ["employee"] },
  { label: "SuperAdmin", path: "/superadmin", icon: "https://img.icons8.com/fluency/48/admin-settings.png", roles: ["superadmin"] },
];

export function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || "";

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 overflow-y-auto z-30">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src="https://img.icons8.com/fluency/96/laundry.png" alt="" className="w-8 h-8" />
          <span className="font-bold text-lg">LaundroSaaS</span>
        </div>
      </div>
      <nav className="p-3 space-y-1">
        {NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
              )
            }
          >
            <img src={item.icon} alt="" className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
