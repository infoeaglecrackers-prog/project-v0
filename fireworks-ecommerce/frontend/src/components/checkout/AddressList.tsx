import { Plus, CheckCircle, Edit2, Trash2 } from "lucide-react";
import type { IAddress } from "../../types";

interface Props {
  addresses: IAddress[];
  selected: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onEdit: (addr: IAddress) => void;
  onDelete: (id: string) => void;
}

export default function AddressList({ addresses, selected, onSelect, onAdd, onEdit, onDelete }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-dark dark:text-gray-100">Delivery Address</h3>
        <button onClick={onAdd} className="flex items-center gap-1 text-sm text-primary hover:underline">
          <Plus size={14} /> Add New
        </button>
      </div>
      <div className="space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            onClick={() => onSelect(addr._id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
              selected === addr._id ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${selected === addr._id ? "text-primary" : "text-gray-300 dark:text-gray-600"}`}>
                  <CheckCircle size={18} fill={selected === addr._id ? "currentColor" : "none"} />
                </div>
                <div>
                  <p className="font-medium text-dark dark:text-gray-100 text-sm">{addr.fullName}
                    {addr.isDefault && <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Default</span>}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">📞 {addr.phone}</p>
                </div>
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onEdit(addr)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Edit2 size={14} className="text-gray-500 dark:text-gray-400" /></button>
                <button onClick={() => onDelete(addr._id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {!addresses.length && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">No addresses saved. <button onClick={onAdd} className="text-primary hover:underline">Add one</button></div>
        )}
      </div>
    </div>
  );
}
