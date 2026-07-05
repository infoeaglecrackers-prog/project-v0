import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, User, Search, LogOut, LayoutDashboard, Package, Menu, X } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { useDebounce } from "../../hooks/useDebounce";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const cartCount = useAppSelector((s) => s.cart.cart?.totalItems || 0);
  const wishlistCount = useAppSelector((s) => s.wishlist.products.length);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <span className="text-2xl animate-bounce-soft">🎆</span>
          <span className="font-bold text-lg hidden sm:block gradient-text tracking-tight">
            Eagle Crackers
          </span>
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

          {isAuthenticated && (
            <Link to="/wishlist"
                  className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              <Heart size={20} className="text-gray-500 dark:text-gray-300" />
              {wishlistCount > 0 && (
                <span className="count-badge">{wishlistCount}</span>
              )}
            </Link>
          )}

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
                  src={user?.avatar?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
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

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-gray-100 dark:border-white/5 animate-slide-down">
          {!hideSearch && (
            <div className="flex items-center rounded-xl mt-3 overflow-hidden
                            bg-gray-100 dark:bg-white/5 border border-transparent
                            focus-within:border-primary/40 focus-within:shadow-glow-sm transition-all">
              <Search size={15} className="ml-3 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { navigate(`/products?keyword=${search.trim()}`); setMenuOpen(false); } }}
                placeholder="Search crackers..."
                className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent
                           text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              />
            </div>
          )}
          <div className="flex flex-col mt-2 gap-0.5">
            {[["Shop All", "/products"], ["Cart", "/cart"], ["Wishlist", "/wishlist"]].map(([label, href]) => (
              <Link key={label} to={href}
                    className="text-sm py-2.5 px-3 text-gray-700 dark:text-gray-200
                               hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                    onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link to="/login"
                    className="text-sm py-2.5 px-3 text-primary font-medium
                               hover:bg-primary/5 rounded-xl transition-colors"
                    onClick={() => setMenuOpen(false)}>
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
