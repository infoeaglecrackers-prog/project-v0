import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, MapPin, Loader2 } from "lucide-react";
import { dropPointService } from "../../services/dropPointService";
import type { IDropPoint } from "../../services/dropPointService";
import toast from "react-hot-toast";

const EMPTY: Omit<IDropPoint, "_id" | "isActive"> = {
  name: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "",
  landmark: "", contactPhone: "", workingHours: "Mon–Sat, 9 AM – 6 PM",
};

export default function AdminDropPoints() {
  const [dropPoints, setDropPoints] = useState<IDropPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<IDropPoint | null>(null);
  const [form, setForm] = useState({ ...EMPTY });

  const load = () => {
    setLoading(true);
    dropPointService.adminGetAll()
      .then((r) => setDropPoints(r.data.data?.dropPoints || []))
      .catch(() => toast.error("Failed to load drop points"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setShowForm(true);
  };

  const openEdit = (dp: IDropPoint) => {
    setEditing(dp);
    setForm({
      name: dp.name, addressLine1: dp.addressLine1, addressLine2: dp.addressLine2 || "",
      city: dp.city, state: dp.state, pincode: dp.pincode, landmark: dp.landmark || "",
      contactPhone: dp.contactPhone || "", workingHours: dp.workingHours || "",
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await dropPointService.update(editing._id, form);
        toast.success("Drop point updated!");
      } else {
        await dropPointService.create(form);
        toast.success("Drop point added!");
      }
      setShowForm(false);
      load();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (dp: IDropPoint) => {
    try {
      await dropPointService.update(dp._id, { isActive: !dp.isActive });
      setDropPoints((prev) => prev.map((d) => d._id === dp._id ? { ...d, isActive: !d.isActive } : d));
      toast.success(dp.isActive ? "Drop point deactivated" : "Drop point activated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this drop point?")) return;
    try {
      await dropPointService.delete(id);
      setDropPoints((prev) => prev.filter((d) => d._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const inp = "w-full border dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-gray-100">Parcel Drop Points</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage pickup locations shown to customers at checkout</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Add Location
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-semibold text-dark dark:text-gray-100 mb-4">
              {editing ? "Edit Drop Point" : "Add Drop Point"}
            </h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Location Name *</label>
                <input className={inp} placeholder="e.g. Eagle Crackers Main Store" value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Address Line 1 *</label>
                <input className={inp} placeholder="Street / Shop No." value={form.addressLine1}
                  onChange={(e) => setForm((p) => ({ ...p, addressLine1: e.target.value }))} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Address Line 2</label>
                <input className={inp} placeholder="Area / Colony" value={form.addressLine2}
                  onChange={(e) => setForm((p) => ({ ...p, addressLine2: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">City *</label>
                  <input className={inp} placeholder="City" value={form.city}
                    onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">State *</label>
                  <input className={inp} placeholder="State" value={form.state}
                    onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Pincode *</label>
                  <input className={inp} placeholder="6-digit pincode" value={form.pincode}
                    onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value }))} required maxLength={6} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Contact Phone</label>
                  <input className={inp} placeholder="10-digit number" value={form.contactPhone}
                    onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Landmark</label>
                <input className={inp} placeholder="Near landmark..." value={form.landmark}
                  onChange={(e) => setForm((p) => ({ ...p, landmark: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Working Hours</label>
                <input className={inp} placeholder="Mon–Sat, 9 AM – 6 PM" value={form.workingHours}
                  onChange={(e) => setForm((p) => ({ ...p, workingHours: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  {saving ? "Saving…" : editing ? "Update" : "Add Location"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-primary" /></div>
      ) : dropPoints.length === 0 ? (
        <div className="card p-12 text-center">
          <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No drop points added yet.</p>
          <button onClick={openAdd} className="btn-primary mt-4 inline-flex items-center gap-2"><Plus size={14} /> Add First Location</button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">City / Pincode</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Hours</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {dropPoints.map((dp) => (
                <tr key={dp._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-dark dark:text-gray-100">{dp.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-[200px]">{dp.addressLine1}</p>
                    {dp.landmark && <p className="text-xs text-gray-400 dark:text-gray-500">📍 {dp.landmark}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{dp.city}<br /><span className="text-xs text-gray-400">{dp.pincode}</span></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{dp.contactPhone || "—"}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">{dp.workingHours || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleToggle(dp)} title={dp.isActive ? "Deactivate" : "Activate"}>
                      {dp.isActive
                        ? <ToggleRight size={22} className="text-green-500" />
                        : <ToggleLeft size={22} className="text-gray-400" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(dp)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Pencil size={14} className="text-gray-500" /></button>
                      <button onClick={() => handleDelete(dp._id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={14} className="text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
