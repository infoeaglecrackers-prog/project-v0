import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchWishlist } from "../store/slices/wishlistSlice";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((s) => s.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark dark:text-gray-100 mb-6">My Wishlist ({products.length})</h1>
      {products.length === 0 ? (
        <div className="py-20 text-center">
          <Heart size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">Your wishlist is empty</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
