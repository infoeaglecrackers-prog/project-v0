import { Link, useNavigate } from "react-router-dom";
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
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-card border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🎆</span>
          <span className="font-bold text-dark dark:text-gray-100 text-lg hidden sm:block">Crackers Bazaar</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl hidden md:flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 bg-white dark:bg-gray-800">
          <Search size={16} className="ml-3 text-gray-400 dark:text-gray-500 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/products?keyword=${encodeURIComponent(search.trim())}`)}
            placeholder="Search crackers, sparklers..."
            className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {isAuthenticated && (
            <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Heart size={20} className="text-gray-600 dark:text-gray-300" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <ShoppingCart size={20} className="text-gray-600 dark:text-gray-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <img
                  src={user?.avatar?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                  alt={user?.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block max-w-[80px] truncate">
                  {user?.name}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-modal z-50">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <User size={15} /> Profile
                  </Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Package size={15} /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-primary">
                      <LayoutDashboard size={15} /> Admin Panel
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100 dark:border-gray-700" />
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4 rounded-lg">
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg mt-3 overflow-hidden bg-white dark:bg-gray-800">
            <Search size={16} className="ml-3 text-gray-400 dark:text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { navigate(`/products?keyword=${search.trim()}`); setMenuOpen(false); } }}
              placeholder="Search crackers..."
              className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
          <div className="flex flex-col mt-2 gap-1">
            <Link to="/products" className="text-sm py-2 px-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded" onClick={() => setMenuOpen(false)}>Shop All</Link>
            <Link to="/cart" className="text-sm py-2 px-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded" onClick={() => setMenuOpen(false)}>Cart</Link>
            {!isAuthenticated && <Link to="/login" className="text-sm py-2 px-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded" onClick={() => setMenuOpen(false)}>Login</Link>}
          </div>
        </div>
      )}
    </nav>
  );
}
