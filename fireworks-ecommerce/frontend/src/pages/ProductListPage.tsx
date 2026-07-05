import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchProducts, setFilters, fetchCategories } from "../store/slices/productSlice";
import ProductGrid from "../components/product/ProductGrid";
import FilterSidebar from "../components/product/FilterSidebar";
import CartSummaryPanel from "../components/product/CartSummaryPanel";
import Pagination from "../components/common/Pagination";
import { SlidersHorizontal, ShoppingCart, X } from "lucide-react";

export default function ProductListPage() {
  const dispatch = useAppDispatch();
  const { products, loading, pagination, filters } = useAppSelector((s) => s.products);
  const cartItemCount = useAppSelector((s) => s.cart.cart?.totalItems ?? 0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  // Fetch categories once on mount for the filter sidebar
  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  useEffect(() => {
    const params: Record<string, string | number> = {};
    searchParams.forEach((v, k) => (params[k] = v));
    dispatch(setFilters(params));
    dispatch(fetchProducts({ ...params, page: Number(params.page) || 1 }));
  }, [searchParams, dispatch]);

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    const current: Record<string, string> = {};
    searchParams.forEach((v, k) => (current[k] = v));
    const merged: Record<string, string> = { ...current, page: "1" };
    // Merge new filters: remove key when value is null/undefined/empty, otherwise set it
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") {
        delete merged[k];
      } else {
        merged[k] = String(v);
      }
    });
    setSearchParams(merged);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-8">

      {/* ── Page header ───────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-gray-100">All Fireworks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {pagination?.total || 0} products found
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="md:hidden flex items-center gap-2 btn-ghost text-sm"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>

          {/* Mobile cart summary toggle */}
          <button
            onClick={() => setShowMobileCart(true)}
            className="xl:hidden relative flex items-center gap-2 btn-ghost text-sm"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">My Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{ background: "#c9184a" }}>
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Three-column layout ────────────────────────────── */}
      <div className="flex gap-6">

        {/* Left: Filter sidebar (desktop) */}
        <div className="hidden md:block shrink-0">
          <FilterSidebar filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Mobile filter drawer */}
        {showFilter && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-dark-200 overflow-y-auto p-4">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold dark:text-gray-100">Filters</h3>
                <button onClick={() => setShowFilter(false)}><X size={18} /></button>
              </div>
              <FilterSidebar filters={filters} onChange={(f) => { handleFilterChange(f); setShowFilter(false); }} />
            </div>
          </div>
        )}

        {/* Centre: Product grid */}
        <div className="flex-1 min-w-0">
          {filters.keyword && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Results for: <strong className="text-gray-900 dark:text-gray-100">"{filters.keyword}"</strong>
              </span>
              <button
                onClick={() => handleFilterChange({ keyword: undefined })}
                className="text-xs text-red-500 flex items-center gap-1"
              >
                <X size={12} /> Clear
              </button>
            </div>
          )}
          <ProductGrid products={products} loading={loading} />
          <Pagination
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 1}
            onPageChange={(page) => handleFilterChange({ page: String(page) })}
          />
        </div>

        {/* Right: Cart summary panel (desktop xl+) */}
        <div className="hidden xl:block">
          <CartSummaryPanel />
        </div>
      </div>

      {/* Mobile: Cart summary slide-in panel */}
      {showMobileCart && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileCart(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-dark-400
                          overflow-y-auto shadow-2xl animate-slide-down">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/[0.06]">
              <h3 className="font-bold text-dark dark:text-gray-100">My Selections</h3>
              <button onClick={() => setShowMobileCart(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                <X size={18} />
              </button>
            </div>
            <div className="p-4">
              <CartSummaryPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
