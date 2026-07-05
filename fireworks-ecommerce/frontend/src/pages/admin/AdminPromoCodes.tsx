import { useEffect, useState } from "react";
import { promoService } from "../../services/promoService";
import Modal from "../../components/common/Modal";
import { Plus, Trash2, Tag } from "lucide-react";
import toast from "react-hot-toast";
import type { IPromo } from "../../types";

const emptyForm = { code: "", discountPercent: 10, minOrderValue: 0, usageLimit: "", expiresAt: "" };

export default function AdminPromoCodes() {
  const [promos, setPromos] = useState<IPromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    promoService.getAll()
      .then((r) => setPromos(r.data.data?.promos || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await promoService.create({
        code: form.code,
        discountPercent: Number(form.discountPercent),
        minOrderValue: Number(form.minOrderValue) || 0,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        expiresAt: form.expiresAt || undefined,
      });
      toast.success("Promo code created!");
      setModal(false);
      load();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to create promo code");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (promo: IPromo) => {
    try {
      await promoService.update(promo._id, { isActive: !promo.isActive });
      load();
    } catch { toast.error("Failed to update"); }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete promo code "${code}"?`)) return;
    try {
      await promoService.delete(id);
      toast.success("Deleted");
      load();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-gray-100">Promo Codes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total: {promos.length}</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Promo Code
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 dark:text-gray-500">Loading...</div>
      ) : promos.length === 0 ? (
        <div className="py-12 text-center text-gray-400 dark:text-gray-500">
          <Tag size={32} className="mx-auto mb-3 opacity-40" />
          <p className="mb-4">No promo codes yet</p>
          <button onClick={openAdd} className="btn-primary">Add First Promo Code</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                {["Code", "Discount", "Min. Order", "Usage", "Expires", "Status", ""].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p._id} className="border-b border-gray-50 dark:border-gray-700">
                  <td className="py-3 px-4 font-mono font-semibold text-dark dark:text-gray-100">{p.code}</td>
                  <td className="py-3 px-4 dark:text-gray-200">{p.discountPercent}%</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400">₹{p.minOrderValue}</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{p.usedCount}{p.usageLimit ? ` / ${p.usageLimit}` : ""}</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : "—"}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleDelete(p._id, p.code)} className="text-red-400 hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Promo Code">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Code *</label>
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              required
              className="input-field mt-1 font-mono uppercase"
              placeholder="e.g. DIWALI20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Discount % *</label>
              <input
                type="number" min={1} max={90} required
                value={form.discountPercent}
                onChange={(e) => setForm((f) => ({ ...f, discountPercent: Number(e.target.value) }))}
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Min. Order Value (₹)</label>
              <input
                type="number" min={0}
                value={form.minOrderValue}
                onChange={(e) => setForm((f) => ({ ...f, minOrderValue: e.target.value }))}
                className="input-field mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Usage Limit</label>
              <input
                type="number" min={1}
                value={form.usageLimit}
                onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
                className="input-field mt-1"
                placeholder="Unlimited"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Expires On</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                className="input-field mt-1"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving || !form.code} className="btn-primary flex-1">
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
