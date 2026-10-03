import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { fetchProducts } from "../../store/slices/productSlice";
import { fetchAdminCategories } from "../../store/slices/adminSlice";
import { adminService } from "../../services/adminService";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import toast from "react-hot-toast";
import type { IProduct, ICategory } from "../../types";

const UNCATEGORISED = "Other";

interface CategorySection {
  id: string;
  name: string;
  sortOrder: number;
  products: IProduct[];
}

/** Mirrors ProductCategoryList's grouping so the admin list matches the storefront order. */
function groupByCategory(products: IProduct[], categories: ICategory[]): CategorySection[] {
  const byId = new Map(categories.map((c) => [c._id, c]));
  const sections = new Map<string, CategorySection>();

  for (const p of products) {
    let id = UNCATEGORISED;
    let name = UNCATEGORISED;
    let sortOrder = Number.MAX_SAFE_INTEGER;

    if (typeof p.category === "object" && p.category !== null) {
      id = p.category._id;
      name = p.category.name;
      sortOrder = p.category.sortOrder ?? 0;
    } else if (typeof p.category === "string") {
      const found = byId.get(p.category);
      if (found) {
        id = found._id;
        name = found.name;
        sortOrder = found.sortOrder ?? 0;
      }
    }

    const existing = sections.get(id);
    if (existing) existing.products.push(p);
    else sections.set(id, { id, name, sortOrder, products: [p] });
  }

  return [...sections.values()].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export default function AdminProducts() {
  const dispatch = useAppDispatch();
  const { products, loading, pagination } = useAppSelector((s) => s.products);
  const categories = useAppSelector((s) => s.admin.categories);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 1000 }));
    dispatch(fetchAdminCategories());
  }, [dispatch, page]);

  const sections = useMemo(() => groupByCategory(products, categories), [products, categories]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await adminService.deleteProduct(id);
      toast.success("Deleted");
      dispatch(fetchProducts({ page, limit: 10 }));
    } catch { toast.error("Failed to delete"); }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-dark dark:text-gray-100">Products ({pagination?.total || 0})</h1>
        <Link to="/admin/products/add" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {!products.length && (
        <div className="card py-12 text-center text-gray-400 dark:text-gray-500">No products</div>
      )}

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h2 className="text-sm font-bold text-dark dark:text-gray-100">{section.name}</h2>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    {["Product", "Price", "MRP", "Stock", "Featured", "Actions"].map((h) => (
                      <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.products.map((p) => (
                    <tr key={p._id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0]?.url || "https://placehold.co/40x40"} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-medium text-dark dark:text-gray-100 line-clamp-1 max-w-[180px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 dark:text-gray-200">{formatCurrency(p.price)}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        {p.discountPrice || p.originalPrice ? formatCurrency((p.discountPrice ?? p.originalPrice)!) : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={p.stock > 0 ? "text-green-600" : "text-red-500"}>{p.stock}</span>
                      </td>
                      <td className="py-3 px-4 dark:text-gray-300">{p.isFeatured ? "✓" : "—"}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/products/edit/${p._id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-500 dark:text-gray-400"><Edit2 size={14} /></Link>
                          <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-400"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {section.products.map((p) => (
                <div key={p._id} className="p-4 flex items-center gap-3">
                  <img src={p.images?.[0]?.url || "https://placehold.co/40x40"} alt={p.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark dark:text-gray-100 text-sm line-clamp-1">{p.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-dark dark:text-gray-200">{formatCurrency(p.price)}</span>
                      {(p.discountPrice || p.originalPrice) && (
                        <span className="line-through">{formatCurrency((p.discountPrice ?? p.originalPrice)!)}</span>
                      )}
                      <span>·</span>
                      <span className={p.stock > 0 ? "text-green-600" : "text-red-500"}>Stock: {p.stock}</span>
                      {p.isFeatured && <span className="text-secondary font-semibold">Featured</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link to={`/admin/products/edit/${p._id}`} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-500 dark:text-gray-400"><Edit2 size={15} /></Link>
                    <button onClick={() => handleDelete(p._id, p.name)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-400"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={page} totalPages={pagination?.totalPages || 1} onPageChange={setPage} />
    </div>
  );
}
