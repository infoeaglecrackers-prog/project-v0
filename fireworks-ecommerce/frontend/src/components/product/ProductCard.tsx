import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleWishlist } from "../../store/slices/wishlistSlice";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { formatCurrency } from "../../utils/formatCurrency";
import type { IProduct } from "../../types";
import toast from "react-hot-toast";

interface Props {
  product: IProduct;
}

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const wishlistIds = useAppSelector((s) => s.wishlist.products.map((p) => p._id));
  const isWishlisted = wishlistIds.includes(product._id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error("Login to add to cart"); return; }
    if (product.stock === 0) return;
    await dispatch(addToCart({ productId: product._id, quantity: 1 }));
    toast.success("Added to cart!");
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error("Login to wishlist"); return; }
    await dispatch(toggleWishlist(product._id));
  };

  const originalPrice = product.originalPrice || product.discountPrice;
  const discount = originalPrice
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="card group block">
      <div className="relative overflow-hidden rounded-t-xl aspect-[3/4]">
        <img
          src={product.images?.[0]?.url || "https://placehold.co/300x400?text=No+Image"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold rounded-t-xl">
            Out of Stock
          </span>
        )}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-1.5 rounded-full bg-white dark:bg-gray-700 shadow transition-colors ${
            isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-3">
        <p className="text-xs text-gray-400 mb-0.5">{typeof product.category === "object" ? product.category.name : ""}</p>
        <h3 className="font-medium text-dark dark:text-gray-100 text-sm leading-tight mb-1 line-clamp-2">{product.name}</h3>

        <div className="flex items-center gap-1 mb-2">
          <Star size={12} className="fill-secondary text-secondary" />
          <span className="text-xs text-gray-500">{product.ratings?.toFixed(1) || "0.0"} ({product.numReviews || 0})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-dark dark:text-gray-100">{formatCurrency(product.price)}</span>
            {originalPrice && originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="p-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
}
