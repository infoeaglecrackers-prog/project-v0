import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import type { IProduct } from "../../types";

interface Props {
  products: IProduct[];
  loading?: boolean;
  skeletonCount?: number;
}

export default function ProductGrid({ products, loading, skeletonCount = 8 }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (!products.length) {
    return (
      <div className="py-20 text-center">
        <span className="text-5xl">🎆</span>
        <p className="mt-4 text-gray-500">No products found</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}
