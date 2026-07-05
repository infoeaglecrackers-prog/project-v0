import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, TicketPercent, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/promo-codes", label: "Promo Codes", icon: TicketPercent },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-56 bg-dark dark:bg-gray-950 text-gray-300 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-800">
          <span className="text-white font-bold text-sm">🎆 Admin Panel</span>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-800"
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <ChevronLeft size={14} /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
