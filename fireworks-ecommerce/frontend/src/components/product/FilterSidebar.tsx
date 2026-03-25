import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import type { IProductFilters } from "../../types";
import { SORT_OPTIONS } from "../../utils/constants";
import { useAppSelector } from "../../hooks/useAppDispatch";

interface Props {
  filters: IProductFilters;
  onChange: (filters: Partial<IProductFilters>) => void;
}

export default function FilterSidebar({ filters, onChange }: Props) {
  const categories = useAppSelector((s) => (s.products as unknown as { filters?: { categories?: { _id: string; name: string }[] } })?.filters?.categories || []);
  const [openSection, setOpenSection] = useState<string | null>("category");

  const toggle = (sec: string) => setOpenSection(openSection === sec ? null : sec);

  return (
    <aside className="w-64 shrink-0 space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-4 font-semibold text-dark dark:text-gray-100">
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          <button onClick={() => onChange({ category: undefined, minPrice: undefined, maxPrice: undefined, keyword: undefined })}
            className="ml-auto text-xs text-primary hover:underline">Clear</button>
        </div>

        {/* Category */}
        <Section title="Category" open={openSection === "category"} onToggle={() => toggle("category")}>
          <ul className="space-y-1">
            {categories.map((c: { _id: string; name: string }) => (
              <li key={c._id}>
                <label className="flex items-center gap-2 cursor-pointer text-sm py-1">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === c._id}
                    onChange={() => onChange({ category: c._id })}
                    className="accent-primary"
                  />
                  {c.name}
                </label>
              </li>
            ))}
          </ul>
        </Section>

        {/* Price Range */}
        <Section title="Price Range" open={openSection === "price"} onToggle={() => toggle("price")}>
          <div className="space-y-2">
            {[[0, 200], [200, 500], [500, 1000], [1000, 5000]].map(([min, max]) => (
              <label key={`${min}-${max}`} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="price"
                  checked={filters.minPrice === min && filters.maxPrice === max}
                  onChange={() => onChange({ minPrice: min, maxPrice: max })}
                  className="accent-primary"
                />
                ₹{min} – ₹{max}
              </label>
            ))}
          </div>
        </Section>

        {/* Sort */}
        <Section title="Sort By" open={openSection === "sort"} onToggle={() => toggle("sort")}>
          <ul className="space-y-1">
            {SORT_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <label className="flex items-center gap-2 cursor-pointer text-sm py-1">
                  <input
                    type="radio"
                    name="sort"
                    checked={filters.sort === opt.value}
                    onChange={() => onChange({ sort: opt.value })}
                    className="accent-primary"
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

function Section({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
      <button onClick={onToggle} className="flex items-center justify-between w-full text-sm font-medium text-dark dark:text-gray-100 mb-2">
        {title} {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  );
}
