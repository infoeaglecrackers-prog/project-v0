import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchProductById } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/wishlistSlice";
import ProductImageGallery from "../components/product/ProductImageGallery";
import StarRating from "../components/common/StarRating";
import ReviewCard from "../components/product/ReviewCard";
import Loader from "../components/common/Loader";
import Modal from "../components/common/Modal";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";
import { useAuth } from "../hooks/useAuth";
import { reviewService } from "../services/reviewService";
import toast from "react-hot-toast";
import type { IReview } from "../types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current: product, loading } = useAppSelector((s) => s.products);
  const wishlistIds = useAppSelector((s) => s.wishlist.products.map((p) => p._id));
  const { isAuthenticated } = useAuth();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (id) reviewService.getByProduct(id).then((r) => setReviews(r.data.reviews || [])).catch(() => {});
  }, [id]);

  if (loading || !product) return <Loader fullPage />;

  const isWishlisted = wishlistIds.includes(product._id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    await dispatch(addToCart({ productId: product._id, quantity: qty }));
    toast.success("Added to cart!");
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    await dispatch(addToCart({ productId: product._id, quantity: qty }));
    navigate("/cart");
  };

  const handleReviewSubmit = async () => {
    if (!isAuthenticated) { toast.error("Login to review"); return; }
    try {
      await reviewService.add(product._id, reviewForm);
      toast.success("Review added!");
      setReviewModal(false);
      const r = await reviewService.getByProduct(product._id);
      setReviews(r.data.reviews || []);
    } catch {
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductImageGallery images={product.images || []} name={product.name} />

        <div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">{(product.category as unknown as { name: string })?.name}</p>
          <h1 className="text-2xl font-bold text-dark dark:text-gray-100 mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={product.ratings || 0} size={16} />
            <span className="text-sm text-gray-500 dark:text-gray-400">({product.numReviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-dark dark:text-gray-100">{formatCurrency(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-gray-400 dark:text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">{discount}% OFF</span>
              </>
            )}
          </div>

          <div className={`text-sm font-medium mb-5 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `✓ In Stock (${product.stock} units)` : "✗ Out of Stock"}
          </div>

          {/* Qty */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700"><Minus size={14} /></button>
              <span className="px-4 font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700"><Plus size={14} /></button>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button onClick={handleBuyNow} disabled={!product.stock} className="btn-primary flex-1 py-3">Buy Now</button>
            <button onClick={handleAddToCart} disabled={!product.stock} className="btn-ghost flex-1 py-3 flex items-center justify-center gap-2">
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button onClick={() => dispatch(toggleWishlist(product._id))} className={`p-3 border rounded-xl ${isWishlisted ? "border-red-300 text-red-500" : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400"}`}>
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100 dark:border-gray-700 mb-4">
            {(["desc", "specs", "reviews"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`mr-4 pb-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-gray-500 dark:text-gray-400"}`}>
                {t === "desc" ? "Description" : t === "specs" ? "Specifications" : `Reviews (${reviews.length})`}
              </button>
            ))}
          </div>

          {tab === "desc" && <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>}
          {tab === "specs" && (
            <table className="w-full text-sm">
              <tbody>
                {(product.specifications as { key: string; value: string }[])?.map((s, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-700">
                    <td className="py-2 font-medium text-gray-700 dark:text-gray-200 w-40">{s.key}</td>
                    <td className="py-2 text-gray-500 dark:text-gray-400">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === "reviews" && (
            <div className="space-y-3">
              <button onClick={() => setReviewModal(true)} className="btn-primary text-sm mb-3">Write a Review</button>
              {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
              {!reviews.length && <p className="text-sm text-gray-400 dark:text-gray-500">No reviews yet. Be the first!</p>}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={reviewModal} onClose={() => setReviewModal(false)} title="Write a Review">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Rating</label>
            <StarRating rating={reviewForm.rating} interactive size={24} onRate={(r) => setReviewForm((f) => ({ ...f, rating: r }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Comment</label>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
              rows={4} className="input-field mt-1 resize-none w-full"
              placeholder="Share your experience..."
            />
          </div>
          <button onClick={handleReviewSubmit} className="btn-primary w-full">Submit Review</button>
        </div>
      </Modal>
    </div>
  );
}
