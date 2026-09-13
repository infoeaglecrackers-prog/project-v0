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
        <h3 className="font-semibold text-dark dark:text-gray-100 text-base sm:text-lg">Delivery Addresses</h3>
        <button onClick={onAdd} className="flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:underline bg-primary/10 px-2.5 py-1 sm:p-0 rounded-lg sm:bg-transparent">
          <Plus size={14} /> Add New
        </button>
      </div>
      <div className="space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            onClick={() => onSelect(addr._id)}
            className={`p-3.5 sm:p-4 rounded-xl border-2 transition-colors ${
              selected === addr._id ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                <div className={`mt-0.5 shrink-0 ${selected === addr._id ? "text-primary" : "text-gray-300 dark:text-gray-600"}`}>
                  <CheckCircle size={18} fill={selected === addr._id ? "currentColor" : "none"} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="font-semibold text-dark dark:text-gray-100 text-sm truncate">{addr.fullName}</p>
                    {addr.type && (
                      <span className="text-[10px] uppercase font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
                        {addr.type}
                      </span>
                    )}
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed break-words">
                    {addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {addr.city}, {addr.state} - <span className="font-medium text-gray-700 dark:text-gray-300">{addr.pincode}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <span>📞</span> <span className="font-medium text-gray-700 dark:text-gray-300">{addr.phone}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => onEdit(addr)} 
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                  title="Edit address"
                >
                  <Edit2 size={15} />
                </button>
                <button 
                  onClick={() => onDelete(addr._id)} 
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors"
                  title="Delete address"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!addresses.length && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">No addresses saved. <button onClick={onAdd} className="text-primary hover:underline font-medium">Add one</button></div>
        )}
      </div>
    </div>
  );
}
