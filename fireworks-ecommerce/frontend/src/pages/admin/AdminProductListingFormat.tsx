import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { fetchCategories } from "../../store/slices/productSlice";
import type { ICategory } from "../../types";
import { categoryService } from "../../services/categoryService";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { ArrowUp, ArrowDown, Check, X } from "lucide-react";

interface CategoryWithSort extends ICategory {
  sequence: number;
  tempSortOrder?: number;
  isEditing?: boolean;
}

export default function AdminProductListingFormat() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((s) => s.products);
  const [categorySorts, setCategorySorts] = useState<CategoryWithSort[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await categoryService.getAll();
        const cats: ICategory[] = response.data.data?.categories || response.data.data || [];

        // Sort by sortOrder and calculate sequence
        const sorted = cats
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map((cat, index) => ({
            ...cat,
            sequence: index + 1,
            tempSortOrder: cat.sortOrder || 0,
            isEditing: false,
          }));

        setCategorySorts(sorted);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (id: string) => {
    setCategorySorts((prev) =>
      prev.map((cat) =>
        cat._id === id ? { ...cat, isEditing: true, tempSortOrder: cat.sortOrder || 0 } : cat
      )
    );
  };

  const handleCancelEdit = (id: string) => {
    setCategorySorts((prev) =>
      prev.map((cat) =>
        cat._id === id ? { ...cat, isEditing: false, tempSortOrder: cat.sortOrder || 0 } : cat
      )
    );
  };

  const handleSortOrderChange = (id: string, newValue: number) => {
    setCategorySorts((prev) =>
      prev.map((cat) => (cat._id === id ? { ...cat, tempSortOrder: newValue } : cat))
    );
  };

  const handleSaveSort = async (id: string) => {
    const category = categorySorts.find((c) => c._id === id);
    if (!category || category.tempSortOrder === undefined) return;

    setSaving(true);
    try {
      await categoryService.update(id, {
        name: category.name,
        slug: category.slug,
        description: category.description,
        sortOrder: category.tempSortOrder,
      });
      
      setCategorySorts((prev) =>
        prev.map((cat) =>
          cat._id === id
            ? { ...cat, sortOrder: category.tempSortOrder as number, isEditing: false }
            : cat
        )
      );

      toast.success("Sort order updated!");
    } catch (error) {
      console.error("Failed to update sort order:", error);
      toast.error("Failed to update sort order");
    } finally {
      setSaving(false);
    }
  };

  const moveUp = async (id: string) => {
    const index = categorySorts.findIndex((c) => c._id === id);
    if (index === 0) {
      toast.error("Already at the top");
      return;
    }

    const current = categorySorts[index];
    const previous = categorySorts[index - 1];

    setSaving(true);
    try {
      await Promise.all([
        categoryService.update(current._id, {
          name: current.name,
          slug: current.slug,
          description: current.description,
          sortOrder: (previous.sortOrder || 0) - 1,
        }),
        categoryService.update(previous._id, {
          name: previous.name,
          slug: previous.slug,
          description: previous.description,
          sortOrder: (current.sortOrder || 0) + 1,
        }),
      ]);

      toast.success("Position updated!");
      
      // Re-fetch to update sequence
      const response = await categoryService.getAll();
      const cats: ICategory[] = response.data.data?.categories || response.data.data || [];
      const sorted = cats
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((cat, idx) => ({ ...cat, sequence: idx + 1, tempSortOrder: cat.sortOrder || 0, isEditing: false }));
      setCategorySorts(sorted);
    } catch (error) {
      toast.error("Failed to update position");
    } finally {
      setSaving(false);
    }
  };

  const moveDown = async (id: string) => {
    const index = categorySorts.findIndex((c) => c._id === id);
    if (index === categorySorts.length - 1) {
      toast.error("Already at the bottom");
      return;
    }

    const current = categorySorts[index];
    const next = categorySorts[index + 1];

    setSaving(true);
    try {
      await Promise.all([
        categoryService.update(current._id, {
          name: current.name,
          slug: current.slug,
          description: current.description,
          sortOrder: (next.sortOrder || 0) + 1,
        }),
        categoryService.update(next._id, {
          name: next.name,
          slug: next.slug,
          description: next.description,
          sortOrder: (current.sortOrder || 0) - 1,
        }),
      ]);

      toast.success("Position updated!");
      
      // Re-fetch to update sequence
      const response = await categoryService.getAll();
      const cats: ICategory[] = response.data.data?.categories || response.data.data || [];
      const sorted = cats
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((cat, idx) => ({ ...cat, sequence: idx + 1, tempSortOrder: cat.sortOrder || 0, isEditing: false }));
      setCategorySorts(sorted);
    } catch (error) {
      toast.error("Failed to update position");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-dark dark:text-gray-100">Category Display Order</h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage the order in which product categories appear on the website
        </p>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden space-y-3">
        {categorySorts.length === 0 ? (
          <div className="card p-6 text-center text-gray-500 dark:text-gray-400">
            No categories found
          </div>
        ) : (
          categorySorts.map((cat) => (
            <div key={cat._id} className="card p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">
                    {cat.sequence}
                  </div>
                  <p className="font-semibold text-dark dark:text-gray-100 mt-2">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cat.description}</p>
                  )}
                </div>
              </div>

              {cat.isEditing ? (
                <div className="space-y-2">
                  <input
                    type="number"
                    value={cat.tempSortOrder}
                    onChange={(e) => handleSortOrderChange(cat._id, parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-sm border border-primary rounded bg-white dark:bg-gray-700 text-dark dark:text-gray-100"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveSort(cat._id)}
                      disabled={saving}
                      className="flex-1 px-2 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <Check size={14} /> Save
                    </button>
                    <button
                      onClick={() => handleCancelEdit(cat._id)}
                      disabled={saving}
                      className="flex-1 px-2 py-1.5 text-xs bg-gray-400 hover:bg-gray-500 text-white rounded flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => moveUp(cat._id)}
                    disabled={cat.sequence === 1 || saving}
                    className="flex-1 px-2 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded flex items-center justify-center gap-1"
                  >
                    <ArrowUp size={14} /> Up
                  </button>
                  <button
                    onClick={() => moveDown(cat._id)}
                    disabled={cat.sequence === categorySorts.length || saving}
                    className="flex-1 px-2 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded flex items-center justify-center gap-1"
                  >
                    <ArrowDown size={14} /> Down
                  </button>
                  <button
                    onClick={() => handleEditClick(cat._id)}
                    disabled={saving}
                    className="flex-1 px-2 py-1.5 text-xs bg-primary hover:bg-primary/90 text-white rounded"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Category Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Sort Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categorySorts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No categories found
                  </td>
                </tr>
              ) : (
                categorySorts.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {cat.sequence}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-dark dark:text-gray-100">{cat.name}</p>
                      {cat.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {cat.isEditing ? (
                        <input
                          type="number"
                          value={cat.tempSortOrder}
                          onChange={(e) => handleSortOrderChange(cat._id, parseInt(e.target.value))}
                          className="px-2 py-1 border border-primary rounded bg-white dark:bg-gray-700 text-dark dark:text-gray-100 w-16"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.sortOrder || 0}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {cat.isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveSort(cat._id)}
                              disabled={saving}
                              className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-1 disabled:opacity-50"
                            >
                              <Check size={14} /> Save
                            </button>
                            <button
                              onClick={() => handleCancelEdit(cat._id)}
                              disabled={saving}
                              className="px-3 py-1 text-xs bg-gray-400 hover:bg-gray-500 text-white rounded flex items-center gap-1 disabled:opacity-50"
                            >
                              <X size={14} /> Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => moveUp(cat._id)}
                              disabled={cat.sequence === 1 || saving}
                              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded flex items-center gap-1"
                              title="Move up"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              onClick={() => moveDown(cat._id)}
                              disabled={cat.sequence === categorySorts.length || saving}
                              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded flex items-center gap-1"
                              title="Move down"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              onClick={() => handleEditClick(cat._id)}
                              disabled={saving}
                              className="px-3 py-1 text-xs bg-primary hover:bg-primary/90 text-white rounded"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="card p-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">How it works</h3>
        <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-300">
          <li>• <span className="font-medium">#</span> shows the current position (1 = first on website)</li>
          <li>• Use <span className="font-medium">Up/Down</span> buttons to reorder categories</li>
          <li>• Use <span className="font-medium">Edit</span> to set custom sort order value</li>
        </ul>
      </div>
    </div>
  );
}
