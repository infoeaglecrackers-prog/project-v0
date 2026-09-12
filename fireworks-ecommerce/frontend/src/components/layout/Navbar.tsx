import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Search, LogOut, LayoutDashboard, Package } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { useDebounce } from "../../hooks/useDebounce";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const cartCount = useAppSelector((s) => s.cart.cart?.totalItems || 0);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const hideSearch = ["/login", "/register"].includes(location.pathname);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(debouncedSearch.trim())}`);
    }
  }, [debouncedSearch, navigate]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 nav-glass">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 sm:h-18 md:h-20 flex items-center justify-between gap-3 sm:gap-4">

        {/* Logo - 4:1 aspect ratio, responsive sizing */}
        <Link to="/" className="flex items-center shrink-0 group">
          {logoError ? (
            <span className="text-3xl sm:text-4xl animate-bounce-soft">🎆</span>
          ) : (
            <>
              <img
                src="/logo-light.png"
                alt="Elite Eagle Crackers"
                className="h-12 w-48 sm:h-14 sm:w-56 md:h-16 md:w-64 object-contain dark:hidden transition-all duration-200"
                onError={() => setLogoError(true)}
              />
              <img
                src="/logo-dark.png"
                alt="Elite Eagle Crackers"
                className="h-12 w-48 sm:h-14 sm:w-56 md:h-16 md:w-64 object-contain hidden dark:block transition-all duration-200"
                onError={() => setLogoError(true)}
              />
            </>
          )}
        </Link>

        {/* Search */}
        {!hideSearch && (
          <div className="flex-1 max-w-xl hidden md:flex items-center rounded-xl overflow-hidden
                          bg-gray-100/80 dark:bg-white/5
                          border border-transparent
                          focus-within:border-primary/40 focus-within:bg-white dark:focus-within:bg-white/8
                          focus-within:shadow-glow-sm
                          transition-all duration-300">
            <Search size={15} className="ml-3 text-gray-400 dark:text-gray-500 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/products?keyword=${encodeURIComponent(search.trim())}`)}
              placeholder="Search crackers, sparklers..."
              className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent
                         text-gray-900 dark:text-gray-100
                         placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        )}

        {/* Right Icons */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          <Link to="/cart"
                className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <ShoppingCart size={20} className="text-gray-500 dark:text-gray-300" />
            {cartCount > 0 && (
              <span className="count-badge">{cartCount}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl
                           hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <img
                  src={user?.avatar?.url || "/default-avatar.svg"}
                  alt={user?.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-primary/30"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block max-w-[80px] truncate">
                  {user?.name}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 card-glass rounded-2xl shadow-premium z-50
                                overflow-hidden animate-slide-down">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user?.name}</p>
                  </div>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 dark:text-gray-200
                                   hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                    <User size={15} className="text-primary" /> Profile
                  </Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 dark:text-gray-200
                                   hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                    <Package size={15} className="text-primary" /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-3 text-sm text-primary font-medium
                                     hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                      <LayoutDashboard size={15} /> Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-gray-100 dark:border-white/5" />
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-red-500
                               hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
