import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchAdminCategories } from "../../store/slices/adminSlice";
import ProductForm from "../../components/admin/ProductForm";
import { productService } from "../../services/productService";
import { ChevronLeft, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (images.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }
    setLoading(true);
    try {
      // Create FormData with product data and images
      const formData = new FormData();
      formData.append("name", data.name as string);
      formData.append("description", data.description as string);
      formData.append("price", data.price as string);
      if (data.originalPrice) formData.append("originalPrice", data.originalPrice as string);
      formData.append("stock", data.stock as string);
      formData.append("category", data.category as string);
      formData.append("isFeatured", data.isFeatured as string);
      
      // Add specifications if any
      if (data.specifications && Array.isArray(data.specifications)) {
        formData.append("specifications", JSON.stringify(data.specifications));
      }

      // Add all images
      images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await productService.create(formData);
      toast.success("Product created!");
      navigate("/admin/products");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-gray-200 mb-6">
        <ChevronLeft size={16} /> Back
      </button>
      <h1 className="text-xl font-bold text-dark dark:text-gray-100 mb-6">Add New Product</h1>

      {/* Image Upload */}
      <div className="card p-5 mb-6">
        <h3 className="font-semibold text-dark dark:text-gray-100 mb-4">Product Images</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          {previews.map((src, i) => (
            <div key={i} className="relative w-20 h-20">
              <img src={src} className="w-full h-full object-cover rounded-xl" />
              <button onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow p-0.5 text-red-500">
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
        <p className="text-xs text-gray-400 dark:text-gray-500">First image will be the main image. Max 5 images.</p>
      </div>

      <div className="card p-6">
        <ProductForm 
          onSubmit={handleSubmit as unknown as Parameters<typeof ProductForm>[0]["onSubmit"]} 
          loading={loading} 
          hasImages={images.length > 0}
        />
      </div>
    </div>
  );
}
