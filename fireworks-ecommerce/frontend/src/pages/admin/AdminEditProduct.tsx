import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { fetchProductById } from "../../store/slices/productSlice";
import { fetchAdminCategories } from "../../store/slices/adminSlice";
import ProductForm from "../../components/admin/ProductForm";
import { productService } from "../../services/productService";
import Loader from "../../components/common/Loader";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminEditProduct() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current: product, loading } = useAppSelector((s) => s.products);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchAdminCategories());
    }
  }, [id, dispatch]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (!id) return;
    setSaving(true);
    try {
      await productService.update(id, data as Parameters<typeof productService.update>[1]);
      toast.success("Product updated!");
      navigate("/admin/products");
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  if (loading || !product) return <Loader />;

  return (
    <div className="p-6 max-w-3xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-gray-200 mb-6">
        <ChevronLeft size={16} /> Back
      </button>
      <h1 className="text-xl font-bold text-dark dark:text-gray-100 mb-6">Edit: {product.name}</h1>
      <div className="card p-6">
        <ProductForm
          initial={product}
          onSubmit={handleSubmit as unknown as Parameters<typeof ProductForm>[0]["onSubmit"]}
          loading={saving}
        />
      </div>
    </div>
  );
}
