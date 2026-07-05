import { useForm, useFieldArray } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { useAppSelector } from "../../hooks/useAppDispatch";
import type { IProduct } from "../../types";

interface Props {
  initial?: Partial<IProduct>;
  onSubmit: (data: FormData) => void;
  loading?: boolean;
  hasImages?: boolean;
}

type FormData = {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  stock: number;
  category: string;
  isFeatured: boolean;
  specifications: { key: string; value: string }[];
};

export default function ProductForm({ initial, onSubmit, loading, hasImages = true }: Props) {
  const categories = useAppSelector((s) => s.admin.categories);
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: initial?.name || "",
      description: initial?.description || "",
      price: initial?.price || 0,
      originalPrice: initial?.originalPrice || undefined,
      discountPercent: initial?.discountPercent || undefined,
      stock: initial?.stock || 0,
      category: (initial?.category as unknown as { _id: string })?._id || "",
      isFeatured: initial?.isFeatured || false,
      specifications: (initial?.specifications as { key: string; value: string }[]) || [],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "specifications" });

  return (
    <form onSubmit={handleSubmit(onSubmit as unknown as (data: FormData) => void)} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Product Name *</label>
        <input {...register("name", { required: "Required" })} className="input-field mt-1" />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Description *</label>
        <textarea {...register("description", { required: "Required" })} rows={4} className="input-field mt-1 resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Price (₹) *</label>
          <input type="number" {...register("price", { required: true, min: 1 })} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Original Price (₹)</label>
          <input type="number" {...register("originalPrice")} className="input-field mt-1" placeholder="Optional — for a fixed MRP" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Discount %</label>
        <input
          type="number"
          {...register("discountPercent", { min: 0, max: 99 })}
          className="input-field mt-1"
          placeholder="e.g. 20 — auto-calculates Original Price if left blank above"
        />
        {errors.discountPercent && <p className="text-xs text-red-500 mt-1">Must be between 0 and 99</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Stock *</label>
          <input type="number" {...register("stock", { required: true, min: 0 })} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Category *</label>
          <select {...register("category", { required: true })} className="input-field mt-1">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray-200">
        <input type="checkbox" {...register("isFeatured")} className="accent-primary" />
        Mark as Featured Product
      </label>

      {/* Specifications */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Specifications</label>
          <button type="button" onClick={() => append({ key: "", value: "" })} className="text-xs text-primary flex items-center gap-1">
            <Plus size={12} /> Add
          </button>
        </div>
        {fields.map((f, i) => (
          <div key={f.id} className="flex gap-2 mb-2">
            <input {...register(`specifications.${i}.key`)} placeholder="e.g. Color" className="input-field flex-1" />
            <input {...register(`specifications.${i}.value`)} placeholder="e.g. Red, Green" className="input-field flex-1" />
            <button type="button" onClick={() => remove(i)} className="text-red-400"><X size={16} /></button>
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading || !hasImages} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Saving..." : initial?._id ? "Update Product" : "Create Product"}
        {!hasImages && !initial?._id && <span className="block text-xs mt-1">Add at least one image to continue</span>}
      </button>
    </form>
  );
}
