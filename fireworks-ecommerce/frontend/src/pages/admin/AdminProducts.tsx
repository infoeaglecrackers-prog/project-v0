import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { fetchProducts } from "../../store/slices/productSlice";
import { adminService } from "../../services/adminService";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const dispatch = useAppDispatch();
  const { products, loading, pagination } = useAppSelector((s) => s.products);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 10 }));
  }, [dispatch, page]);

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

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              {["Product", "Price", "Stock", "Category", "Featured", "Actions"].map((h) => (
                <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]?.url || "https://placehold.co/40x40"} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-medium text-dark dark:text-gray-100 line-clamp-1 max-w-[180px]">{p.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 dark:text-gray-200">{formatCurrency(p.price)}</td>
                <td className="py-3 px-4">
                  <span className={p.stock > 0 ? "text-green-600" : "text-red-500"}>{p.stock}</span>
                </td>
                <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{(p.category as unknown as { name: string })?.name}</td>
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
        {!products.length && <div className="py-12 text-center text-gray-400 dark:text-gray-500">No products</div>}
      </div>

      <Pagination currentPage={page} totalPages={pagination?.totalPages || 1} onPageChange={setPage} />
    </div>
  );
}
