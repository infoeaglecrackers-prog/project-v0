import ProductCard from "./ProductCard";
import Loader from "../common/Loader";
import type { IProduct } from "../../types";

interface Props {
  products: IProduct[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading }: Props) {
  if (loading) return <Loader />;
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
