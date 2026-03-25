import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { fetchAdminCategories } from "../../store/slices/adminSlice";
import { adminService } from "../../services/adminService";
import Modal from "../../components/common/Modal";
import { Plus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { ICategory } from "../../types";

export default function AdminCategories() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((s) => s.admin);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<ICategory | null>(null);
  const [form, setForm] = useState({ name: "", description: "", sortOrder: 1 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  const openAdd = () => { setEdit(null); setForm({ name: "", description: "", sortOrder: categories.length + 1 }); setModal(true); };
  const openEdit = (c: ICategory) => { setEdit(c); setForm({ name: c.name, description: c.description || "", sortOrder: c.sortOrder }); setModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (edit) { await adminService.updateCategory(edit._id, form); }
      else { await adminService.createCategory(form); }
      toast.success(edit ? "Updated!" : "Created!");
      setModal(false);
      dispatch(fetchAdminCategories());
    } catch { toast.error("Failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await adminService.deleteCategory(id);
      toast.success("Deleted");
      dispatch(fetchAdminCategories());
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-gray-100">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total: {categories.length}</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> Add Category</button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 dark:text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c._id} className="card p-4 overflow-hidden hover:shadow-lg transition">
              {c.image?.url && <img src={c.image.url} alt={c.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
              <div className="space-y-2">
                <p className="font-semibold text-dark dark:text-gray-100 text-sm">{c.name}</p>
                {c.description && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{c.description}</p>}
                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-2">
                  <span className="capitalize">{c.isActive ? "✓ Active" : "Inactive"}</span>
                  <span>Sort: {c.sortOrder}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button onClick={() => openEdit(c)} className="flex-1 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm dark:text-gray-300 flex items-center justify-center gap-1"><Edit2 size={13} /> Edit</button>
                <button onClick={() => handleDelete(c._id, c.name)} className="flex-1 px-2 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-400 text-sm flex items-center justify-center gap-1"><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="py-12 text-center text-gray-400 dark:text-gray-500">
          <p className="mb-4">No categories yet</p>
          <button onClick={openAdd} className="btn-primary">Add First Category</button>
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={edit ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="input-field mt-1" placeholder="e.g., Sky Shots" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="input-field mt-1 resize-none" placeholder="Describe this category..." />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 1 }))} min="1" className="input-field mt-1" placeholder="Display order" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving || !form.name} className="btn-primary flex-1">{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
