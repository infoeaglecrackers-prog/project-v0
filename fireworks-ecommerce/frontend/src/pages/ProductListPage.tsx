import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchProducts, setFilters } from "../store/slices/productSlice";
import ProductGrid from "../components/product/ProductGrid";
import FilterSidebar from "../components/product/FilterSidebar";
import Pagination from "../components/common/Pagination";
import { SlidersHorizontal, X } from "lucide-react";

export default function ProductListPage() {
  const dispatch = useAppDispatch();
  const { products, loading, pagination, filters } = useAppSelector((s) => s.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const params: Record<string, string | number> = {};
    searchParams.forEach((v, k) => (params[k] = v));
    dispatch(setFilters(params));
    dispatch(fetchProducts({ ...params, page: Number(params.page) || 1 }));
  }, [searchParams, dispatch]);

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    const current: Record<string, string> = {};
    searchParams.forEach((v, k) => (current[k] = v));
    const merged = { ...current, ...newFilters, page: "1" } as Record<string, string>;
    Object.keys(merged).forEach((k) => { if (!merged[k]) delete merged[k]; });
    setSearchParams(merged as Record<string, string>);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-gray-100">All Fireworks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pagination?.total || 0} products found</p>
        </div>
        <button onClick={() => setShowFilter(!showFilter)} className="md:hidden flex items-center gap-2 btn-ghost text-sm">
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className={`hidden md:block`}>
          <FilterSidebar filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Mobile Filter Drawer */}
        {showFilter && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 overflow-y-auto p-4">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold dark:text-gray-100">Filters</h3>
                <button onClick={() => setShowFilter(false)}><X size={18} /></button>
              </div>
              <FilterSidebar filters={filters} onChange={(f) => { handleFilterChange(f); setShowFilter(false); }} />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {filters.keyword && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Results for: <strong className="text-gray-900 dark:text-gray-100">"{filters.keyword}"</strong></span>
              <button onClick={() => handleFilterChange({ keyword: undefined })} className="text-xs text-red-500 flex items-center gap-1">
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
      </div>
    </div>
  );
}
