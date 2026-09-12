import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, TicketPercent, MapPin, Mail, ChevronLeft, Menu, X, BarChart3, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/product-listing-format", label: "Product Format", icon: BarChart3 },
  { to: "/admin/product-sales", label: "Product Sales", icon: TrendingUp },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/promo-codes", label: "Promo Codes", icon: TicketPercent },
  { to: "/admin/drop-points", label: "Drop Points", icon: MapPin },
  { to: "/admin/mail", label: "Mail Panel", icon: Mail },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="h-7 w-7 object-contain rounded-full" />
          <span className="text-white font-bold text-sm">Admin Panel</span>
        </div>
        <button onClick={closeSidebar} className="text-gray-400 hover:text-white lg:hidden">
          <X size={18} />
        </button>
      </div>
      <nav className="flex-1 py-4 space-y-1 px-2 sm:px-3 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                isActive ? "bg-primary text-white" : "hover:bg-gray-800"
              }`
            }
          >
            <Icon size={16} /> <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(" ")[0]}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ChevronLeft size={14} /> Back to Store
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 bg-dark dark:bg-gray-950 text-gray-300 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 sm:w-64 bg-dark dark:bg-gray-950 text-gray-300 flex flex-col transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-dark dark:bg-gray-950 text-white shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-300 hover:text-white">
            <Menu size={20} className="sm:w-6 sm:h-6" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-6 w-6 sm:h-7 sm:w-7 object-contain rounded-full" />
            <span className="font-bold text-xs sm:text-sm">Admin</span>
          </div>
        </header>

        {/* data-scroll-container: admin pages scroll here rather than on the
            window, so ScrollToTop needs to find and reset this element. */}
        <main data-scroll-container className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
