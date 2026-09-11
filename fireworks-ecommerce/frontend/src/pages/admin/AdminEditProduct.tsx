import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { fetchProductById } from "../../store/slices/productSlice";
import { fetchAdminCategories } from "../../store/slices/adminSlice";
import ProductForm from "../../components/admin/ProductForm";
import { productService } from "../../services/productService";
import Loader from "../../components/common/Loader";
import { ChevronLeft, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminEditProduct() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current: product, loading } = useAppSelector((s) => s.products);
  const [saving, setSaving] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchAdminCategories());
    }
  }, [id, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewImage = (i: number) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== i));
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (!id) return;
    setSaving(true);
    try {
      // If there are new images, create FormData; otherwise send as JSON
      if (newImages.length > 0) {
        const formData = new FormData();
        formData.append("name", data.name as string);
        formData.append("description", data.description as string);
        formData.append("price", data.price as string);
        if (data.discountPrice) formData.append("discountPrice", data.discountPrice as string);
        if (data.discountPercent) formData.append("discountPercent", data.discountPercent as string);
        formData.append("stock", data.stock as string);
        formData.append("category", data.category as string);
        formData.append("isFeatured", data.isFeatured as string);

        if (data.specifications && Array.isArray(data.specifications)) {
          formData.append("specifications", JSON.stringify(data.specifications));
        }

        newImages.forEach((file) => {
          formData.append("images", file);
        });

        await productService.update(id, formData);
      } else {
        await productService.update(id, data as Parameters<typeof productService.update>[1]);
      }
      toast.success("Product updated!");
      navigate("/admin/products");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !product) return <Loader />;

  return (
    <div className="p-6 max-w-3xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-gray-200 mb-6">
        <ChevronLeft size={16} /> Back
      </button>
      <h1 className="text-xl font-bold text-dark dark:text-gray-100 mb-6">Edit: {product.name}</h1>

      {/* Existing Images */}
      {product.images && product.images.length > 0 && (
        <div className="card p-5 mb-6">
          <h3 className="font-semibold text-dark dark:text-gray-100 mb-4">Current Images</h3>
          <div className="flex flex-wrap gap-3">
            {product.images.map((img, i) => (
              <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src={typeof img === 'string' ? img : (img.url || '')} alt={`Current ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Images Upload */}
      <div className="card p-5 mb-6">
        <h3 className="font-semibold text-dark dark:text-gray-100 mb-4">Add New Images</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          {newPreviews.map((src, i) => (
            <div key={i} className="relative w-20 h-20">
              <img src={src} className="w-full h-full object-cover rounded-xl" />
              <button onClick={() => removeNewImage(i)} className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow p-0.5 text-red-500">
                <X size={12} />
              </button>
            </div>
          ))}
          <button onClick={() => fileRef.current?.click()} className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:border-primary">
            <Upload size={18} />
            <span className="text-xs mt-1">Upload</span>
          </button>
        </div>
        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
        <p className="text-xs text-gray-400 dark:text-gray-500">Upload new images to replace or update the product photos.</p>
      </div>

      <div className="card p-6">
        <ProductForm
          initial={product}
          onSubmit={handleSubmit as unknown as Parameters<typeof ProductForm>[0]["onSubmit"]}
          loading={saving}
          hasImages={true}
        />
      </div>
    </div>
  );
}
