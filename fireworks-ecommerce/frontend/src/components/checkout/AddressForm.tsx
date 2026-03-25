import { useForm } from "react-hook-form";
import type { IAddress } from "../../types";

interface Props {
  initial?: Partial<IAddress>;
  onSubmit: (data: Omit<IAddress, "_id">) => void;
  onCancel: () => void;
  loading?: boolean;
}

type FormData = Omit<IAddress, "_id">;

export default function AddressForm({ initial, onSubmit, onCancel, loading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: initial || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</label>
          <input {...register("fullName", { required: "Required" })} className="input-field mt-1" placeholder="Ravi Kumar" />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Phone</label>
          <input {...register("phone", { required: "Required", pattern: { value: /^[6-9]\d{9}$/, message: "Invalid phone" } })} className="input-field mt-1" placeholder="9876543210" />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Address Line 1</label>
        <input {...register("addressLine1", { required: "Required" })} className="input-field mt-1" placeholder="Flat/House No, Street" />
        {errors.addressLine1 && <p className="text-xs text-red-500 mt-1">{errors.addressLine1.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Address Line 2 (Optional)</label>
        <input {...register("addressLine2")} className="input-field mt-1" placeholder="Colony, Landmark" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">City</label>
          <input {...register("city", { required: "Required" })} className="input-field mt-1" placeholder="Chennai" />
          {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">State</label>
          <input {...register("state", { required: "Required" })} className="input-field mt-1" placeholder="Tamil Nadu" />
          {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Pincode</label>
          <input {...register("pincode", { required: "Required", pattern: { value: /^\d{6}$/, message: "Invalid" } })} className="input-field mt-1" placeholder="600001" />
          {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Address Type</label>
        <select {...register("type")} className="input-field mt-1">
          <option value="home">Home</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? "Saving..." : "Save Address"}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
      </div>
    </form>
  );
}
