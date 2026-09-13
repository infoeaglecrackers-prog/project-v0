import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Check, Star, Minus, Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { addToCart, updateCartQty } from "../../store/slices/cartSlice";
import { toggleWishlist } from "../../store/slices/wishlistSlice";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatCurrency";
import type { IProduct } from "../../types";
import toast from "react-hot-toast";
import { toastAdded, toastIncreased, toastUpdated, toastUnchanged } from "../../utils/cartToast";

interface Props {
  product: IProduct;
}

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [zoomed, setZoomed] = useState(false);

  const wishlistIds = useAppSelector((s) => s.wishlist.products.map((p) => p._id));
  const isWishlisted = wishlistIds.includes(product._id);

  // How many of this product are already in the cart
  const cartQty = useAppSelector(
    (s) => s.cart.cart?.items.find((i) => i.product._id === product._id)?.quantity ?? 0
  );

  // Stepper value = total desired qty (starts from cartQty if in cart, else 1)
  const [qty, setQty] = useState(() => cartQty || 1);
  const [justAdded, setJustAdded] = useState(false); // brief confirmation after success

  // Keep stepper in sync when cart changes externally (e.g. from CartPage)
  useEffect(() => {
    if (cartQty > 0) setQty(cartQty);
  }, [cartQty]);

  const maxQty = Math.min(product.stock, 10);
  const outOfStock = product.stock === 0;
  const delta = qty - cartQty; // positive = add more, zero = no change, negative = reduce

  const changeQty = (e: React.MouseEvent, dir: 1 | -1) => {
    e.preventDefault();
    e.stopPropagation();
    setQty((prev) => Math.max(1, Math.min(maxQty, prev + dir)));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) { toast.error("Please login to add to cart"); return; }
    if (outOfStock) return;

    // No change needed
    if (delta === 0) {
      toastUnchanged(qty);
      return;
    }

    // Optimistic: show done immediately — Redux already updates the cart in .pending
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);

    if (cartQty === 0) {
      dispatch(addToCart({ productId: product._id, quantity: qty, product })).then((result) => {
        if (addToCart.rejected.match(result)) {
          toast.error("Couldn't add to cart. Please try again.");
        } else {
          toastAdded(qty, product.name);
        }
      });
    } else {
      dispatch(updateCartQty({ productId: product._id, quantity: qty })).then((result) => {
        if (updateCartQty.rejected.match(result)) {
          toast.error("Couldn't update cart. Please try again.");
        } else if (delta > 0) {
          toastIncreased(delta, qty);
        } else {
          toastUpdated(qty);
        }
      });
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error("Please login to use wishlist"); return; }
    await dispatch(toggleWishlist(product._id));
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigating to product detail page on single tap on mobile
    if (window.innerWidth < 768) {
      if (!zoomed) {
        e.preventDefault();
        e.stopPropagation();
        setZoomed(true);
      }
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      e.stopPropagation();
      if (!zoomed) {
        setZoomed(true);
      }
    }
  };

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const originalPrice = hasDiscount ? product.price : undefined;
  const sellingPrice = hasDiscount ? product.discountPrice! : product.price;
  const discount = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  // Button label changes based on cart state
  const btnLabel = () => {
    if (outOfStock) return "Out of Stock";
    if (justAdded) return <><Check size={15} strokeWidth={3} /> Done!</>;
    if (cartQty > 0 && delta === 0) return <><Check size={14} /> In Cart</>;
    if (cartQty > 0 && delta > 0) return <><ShoppingCart size={14} /> Add {delta} More</>;
    if (cartQty > 0 && delta < 0) return <><ShoppingCart size={14} /> Update Cart</>;
    return <><ShoppingCart size={14} /> Add to Cart</>;
  };

  const btnStyle = (): React.CSSProperties | undefined => {
    if (outOfStock) return undefined;
    if ((cartQty > 0 && delta === 0) || justAdded) return { background: "linear-gradient(135deg, #16a34a, #15803d)" };
    return { background: "linear-gradient(135deg, #c9184a 0%, #e02b6a 100%)" };
  };

  return (
    <>
      <Link
        to={`/products/${product._id}`}
        onClick={handleCardClick}
        className="card card-shine group flex flex-col
                   hover:shadow-card-hover hover:-translate-y-1
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                   transition-all duration-300"
      >
        {/* ── IMAGE ──────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-t-2xl aspect-[4/3]" onClick={handleImageClick}>
          <img
            src={product.images?.[0]?.url || "https://placehold.co/400x300?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out cursor-pointer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent
                          opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

        {discount > 0 && (
          <span
            className="absolute top-2.5 left-2.5 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md"
            style={{ background: "linear-gradient(135deg, #c9184a, #e02b6a)" }}
          >
            -{discount}% OFF
          </span>
        )}

        {/* "In Cart" indicator badge */}
        {cartQty > 0 && (
          <span className="absolute top-2.5 left-2.5 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1"
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", ...(discount > 0 ? { top: "2.5rem" } : {}) }}>
            <Check size={11} strokeWidth={3} /> {cartQty} in cart
          </span>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-sm font-bold tracking-widest uppercase bg-black/50 px-4 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow-md backdrop-blur-sm
                     transition-all duration-200 hover:scale-110 active:scale-95
                     ${isWishlisted
                       ? "bg-primary text-white"
                       : "bg-white/80 dark:bg-black/50 text-gray-500 dark:text-gray-300 hover:text-primary"
                     }`}
        >
          <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ── INFO ───────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-3.5 gap-2">

        <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">
          {typeof product.category === "object" ? product.category.name : ""}
        </p>

        <h3 className="font-semibold text-dark dark:text-gray-100 text-sm leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => {
              const rating = product.ratings || (product as any).rating || 4.5;
              const filled = i < Math.round(rating);
              return (
                <Star
                  key={i}
                  size={12}
                  className={
                    filled
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                  }
                />
              );
            })}
          </div>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            ({product.numReviews || 12})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-bold text-dark dark:text-gray-100 text-base">
            {formatCurrency(sellingPrice)}
          </span>
          {originalPrice && (
            <span className="text-xs font-bold text-red-500 line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>

        {!outOfStock && (
          <>
            {/* ── QUANTITY STEPPER ─────────────────────────── */}
            <div
              className="flex items-center rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 self-start mt-0.5"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <button
                onClick={(e) => changeQty(e, -1)}
                disabled={qty <= 1}
                className="px-3 py-2 text-gray-500 dark:text-gray-400
                           hover:bg-gray-100 dark:hover:bg-white/5
                           disabled:opacity-30 disabled:cursor-not-allowed
                           transition-colors duration-150"
              >
                <Minus size={13} strokeWidth={2.5} />
              </button>

              <span className="w-9 text-center text-sm font-bold text-dark dark:text-gray-100 select-none">
                {qty}
              </span>

              <button
                onClick={(e) => changeQty(e, +1)}
                disabled={qty >= maxQty}
                className="px-3 py-2 text-gray-500 dark:text-gray-400
                           hover:bg-gray-100 dark:hover:bg-white/5
                           disabled:opacity-30 disabled:cursor-not-allowed
                           transition-colors duration-150"
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            </div>

            {product.stock <= 5 && (
              <p className="text-[10px] text-amber-500 font-medium">
                Only {product.stock} left in stock!
              </p>
            )}
          </>
        )}

        {/* ── ADD / UPDATE CART BUTTON ─────────────────────── */}
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`w-full flex items-center justify-center gap-2
                     py-2.5 rounded-xl text-sm font-semibold text-white mt-1
                     transition-all duration-200 active:scale-95
                     disabled:cursor-not-allowed
                     ${outOfStock
                       ? "bg-gray-300 dark:bg-dark-50 text-gray-500 dark:text-gray-600"
                       : "hover:-translate-y-0.5 hover:shadow-glow-sm"
                     }`}
          style={!outOfStock ? btnStyle() : undefined}
        >
          {btnLabel()}
        </button>
      </div>
    </Link>

    {/* ── MOBILE IMAGE ZOOM MODAL (1st click zooms image; 2nd click navigates) ── */}
    {zoomed && (
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setZoomed(false);
        }}
      >
        <div
          className="relative max-w-sm w-full bg-white dark:bg-dark-100 rounded-2xl overflow-hidden shadow-2xl p-3 border border-white/10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setZoomed(false);
            navigate(`/products/${product._id}`);
          }}
        >
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/5">
            <img
              src={product.images?.[0]?.url || "https://placehold.co/400x300?text=No+Image"}
              alt={product.name}
              className="w-full h-full object-contain scale-110 transition-transform duration-300"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setZoomed(false);
              }}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 shadow backdrop-blur-sm"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
              Tap again for details →
            </div>
          </div>
          <div className="mt-3 text-center px-2 pb-1">
            <h4 className="text-sm font-bold text-dark dark:text-gray-100 line-clamp-1">{product.name}</h4>
            <p className="text-xs font-semibold text-primary mt-0.5">{formatCurrency(sellingPrice)}</p>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
