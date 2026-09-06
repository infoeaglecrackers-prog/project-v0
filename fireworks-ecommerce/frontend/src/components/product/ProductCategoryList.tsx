import { useMemo } from "react";
import ProductRow from "./ProductRow";
import type { IProduct, ICategory } from "../../types";

interface Props {
  products: IProduct[];
  /** Used to resolve names and section order when product.category is just an id. */
  categories?: ICategory[];
  loading?: boolean;
  skeletonRows?: number;
}

interface Section {
  id: string;
  name: string;
  sortOrder: number;
  products: IProduct[];
}

const UNCATEGORISED = "Other";

/**
 * The catalogue as a dense, category-grouped price list.
 *
 * `product.category` is `ICategory | string` depending on whether the endpoint
 * populated it, so grouping resolves through the categories list when it's just
 * an id. Anything unresolvable lands in a trailing "Other" section rather than
 * vanishing — a product with a broken category reference should still be buyable.
 */
function groupByCategory(products: IProduct[], categories?: ICategory[]): Section[] {
  const byId = new Map((categories ?? []).map((c) => [c._id, c]));
  const sections = new Map<string, Section>();

  for (const p of products) {
    let id = UNCATEGORISED;
    let name = UNCATEGORISED;
    let sortOrder = Number.MAX_SAFE_INTEGER;

    if (typeof p.category === "object" && p.category !== null) {
      id = p.category._id;
      name = p.category.name;
      sortOrder = p.category.sortOrder ?? 0;
    } else if (typeof p.category === "string") {
      const found = byId.get(p.category);
      if (found) {
        id = found._id;
        name = found.name;
        sortOrder = found.sortOrder ?? 0;
      }
    }

    const existing = sections.get(id);
    if (existing) {
      existing.products.push(p);
    } else {
      sections.set(id, { id, name, sortOrder, products: [p] });
    }
  }

  // Category sortOrder first (admin-controlled), then alphabetical as a tiebreak.
  return [...sections.values()].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 dark:border-white/[0.06] animate-pulse">
      <div className="w-12 h-12 shrink-0 rounded-lg bg-gray-200 dark:bg-white/[0.08]" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-3/4 rounded bg-gray-200 dark:bg-white/[0.08]" />
        <div className="h-3 w-2/5 rounded bg-gray-200 dark:bg-white/[0.08]" />
      </div>
      <div className="w-16 h-8 rounded-lg bg-gray-200 dark:bg-white/[0.08]" />
    </div>
  );
}

export default function ProductCategoryList({
  products,
  categories,
  loading,
  skeletonRows = 9,
}: Props) {
  const sections = useMemo(() => groupByCategory(products, categories), [products, categories]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-20 text-center">
        <span className="text-5xl">🎆</span>
        <p className="mt-4 text-gray-500 dark:text-gray-400">No products found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.id}>
          {/* Category header bar */}
          <div className="flex items-center justify-between gap-3 mb-3 pl-3 pr-4 py-2.5 rounded-lg
                          border-l-[3px] border-primary
                          bg-gradient-to-r from-primary/[0.07] to-transparent dark:from-primary/[0.14]">
            <h2 className="flex items-center gap-2.5 text-base font-bold text-dark dark:text-gray-100">
              <span aria-hidden="true">🎆</span>
              {section.name}
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
              {section.products.length} {section.products.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {section.products.map((p) => (
              <ProductRow key={p._id} product={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
