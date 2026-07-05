import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import type { IProductFilters } from "../../types";
import { SORT_OPTIONS } from "../../utils/constants";
import { useAppSelector } from "../../hooks/useAppDispatch";

interface Props {
  filters: IProductFilters;
  onChange: (filters: Partial<IProductFilters>) => void;
}

export default function FilterSidebar({ filters, onChange }: Props) {
  const categories = useAppSelector((s) => s.products.categories);
  const [openSection, setOpenSection] = useState<string | null>("category");
  const toggle = (sec: string) => setOpenSection(openSection === sec ? null : sec);

  // Parse comma-separated category IDs from the filter string
  const selectedIds: string[] = filters.category
    ? String(filters.category).split(",").filter(Boolean)
    : [];

  const toggleCategory = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((c) => c !== id)
      : [...selectedIds, id];
    // Pass undefined (not empty string) so the URL param is fully removed when nothing is selected
    onChange({ category: next.length > 0 ? next.join(",") : undefined } as Partial<IProductFilters>);
  };

  const clearCategories = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ category: undefined });
  };

  return (
    <aside className="w-64 shrink-0 space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-4 font-semibold text-dark dark:text-gray-100">
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          <button
            onClick={() => onChange({ category: undefined, minPrice: undefined, maxPrice: undefined, keyword: undefined, sort: undefined })}
            className="ml-auto text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        </div>

        {/* ── CATEGORY (multi-select checkboxes) ───────────── */}
        <Section
          title="Category"
          open={openSection === "category"}
          onToggle={() => toggle("category")}
          badge={selectedIds.length > 0 ? selectedIds.length : undefined}
          onClearBadge={selectedIds.length > 0 ? clearCategories : undefined}
        >
          {categories.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 py-1">Loading…</p>
          ) : (
            <ul className="space-y-0.5">
              {categories.map((c) => {
                const checked = selectedIds.includes(c._id);
                return (
                  <li key={c._id}>
                    <label
                      className={`flex items-center gap-2.5 cursor-pointer text-sm py-1.5 px-2 rounded-lg
                                  transition-colors duration-150
                                  ${checked
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                                  }`}
                    >
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors
                                    ${checked
                                      ? "bg-primary border-primary"
                                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent"
                                    }`}
                      >
                        {checked && (
                          <svg viewBox="0 0 12 9" fill="none" className="w-2.5 h-2.5">
                            <path d="M1 4l3.5 3.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleCategory(c._id)}
                      />
                      <span className="flex-1 truncate">{c.name}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}

        </Section>

        {/* ── PRICE RANGE ──────────────────────────────────── */}
        <Section title="Price Range" open={openSection === "price"} onToggle={() => toggle("price")}>
          <div className="space-y-1">
            {([[undefined, undefined, "All prices"], [0, 200, "Under ₹200"], [200, 500, "₹200 – ₹500"], [500, 1000, "₹500 – ₹1,000"], [1000, 5000, "₹1,000 – ₹5,000"]] as [number | undefined, number | undefined, string][]).map(([min, max, label]) => (
              <label
                key={label}
                className={`flex items-center gap-2.5 cursor-pointer text-sm py-1.5 px-2 rounded-lg transition-colors duration-150
                            ${filters.minPrice === min && filters.maxPrice === max
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                            }`}
              >
                <input
                  type="radio"
                  name="price"
                  className="accent-primary"
                  checked={filters.minPrice === min && filters.maxPrice === max}
                  onChange={() => onChange({ minPrice: min, maxPrice: max })}
                />
                {label}
              </label>
            ))}
          </div>
        </Section>

        {/* ── SORT ─────────────────────────────────────────── */}
        <Section title="Sort By" open={openSection === "sort"} onToggle={() => toggle("sort")}>
          <ul className="space-y-1">
            {SORT_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <label
                  className={`flex items-center gap-2.5 cursor-pointer text-sm py-1.5 px-2 rounded-lg transition-colors duration-150
                              ${filters.sort === opt.value
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                              }`}
                >
                  <input
                    type="radio"
                    name="sort"
                    className="accent-primary"
                    checked={filters.sort === opt.value}
                    onChange={() => onChange({ sort: opt.value })}
                  />
                  {opt.label}
                </label>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </aside>
  );
}

/* ─── Section wrapper ───────────────────────────────────────── */
function Section({
  title, open, onToggle, children, badge, onClearBadge,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: number;
  onClearBadge?: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="border-t border-gray-100 dark:border-white/[0.06] pt-3 mt-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-sm font-semibold text-dark dark:text-gray-100 mb-2"
      >
        <span className="flex items-center gap-2">
          {title}
          {badge !== undefined && (
            <span
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white"
              style={{ background: "linear-gradient(135deg,#c9184a,#e02b6a)" }}
            >
              {badge}
              {onClearBadge && (
                <button onClick={onClearBadge} className="ml-0.5 hover:opacity-70">
                  <X size={9} />
                </button>
              )}
            </span>
          )}
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  );
}
