import { useState, useEffect } from "react";
import { ShoppingCart, Check, Minus, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { addToCart, updateCartQty } from "../../store/slices/cartSlice";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatCurrency";
import type { IProduct } from "../../types";
import toast from "react-hot-toast";
import { toastAdded, toastIncreased, toastUpdated } from "../../utils/cartToast";

interface Props {
  product: IProduct;
}

/**
 * Compact one-line product row for the category-grouped catalogue.
 *
 * Optimised for bulk ordering rather than browsing: a shopper working down a
 * price list wants many items visible at once and one tap to add, so this trades
 * the big imagery and star ratings of ProductCard for density.
 *
 * Once something is in the cart the Add button becomes an inline stepper — the
 * reference design only showed "Add", but without a stepper there'd be no way to
 * adjust quantity from this view, which is where people spend their time.
 */
export default function ProductRow({ product }: Props) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  const cartQty = useAppSelector(
    (s) => s.cart.cart?.items.find((i) => i.product._id === product._id)?.quantity ?? 0
  );

  const [busy, setBusy] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1200);
    return () => clearTimeout(t);
  }, [justAdded]);

  const unitPrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - unitPrice) / product.price) * 100)
    : 0;

  const maxQty = Math.min(product.stock, 10);
  const outOfStock = product.stock === 0;
  const inCart = cartQty > 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error("Please login to add to cart"); return; }
    if (outOfStock || busy) return;

    setBusy(true);
    try {
      const result = await dispatch(addToCart({ productId: product._id, quantity: 1, product }));
      if (addToCart.rejected.match(result)) throw new Error();
      toastAdded(1, product.name);
      setJustAdded(true);
    } catch {
      toast.error("Couldn't add to cart. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleStep = async (e: React.MouseEvent, dir: 1 | -1) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;

    const next = cartQty + dir;
    if (next < 0 || next > maxQty) return;

    setBusy(true);
    try {
      const result = await dispatch(updateCartQty({ productId: product._id, quantity: next }));
      if (updateCartQty.rejected.match(result)) throw new Error();
      if (next === 0) {
        toastUpdated(0);
      } else if (dir > 0) {
        toastIncreased(1, next);
      } else {
        toastUpdated(next);
      }
    } catch {
      toast.error("Couldn't update cart. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 ${
        inCart
          ? "border-primary/40 bg-primary/[0.04] dark:bg-primary/[0.08]"
          : "border-gray-100 dark:border-white/[0.06] bg-white dark:bg-dark-200 hover:border-gray-200 dark:hover:border-white/[0.12]"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06]">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-lg">🎆</span>
        )}
      </div>

      {/* Name + pricing */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-dark dark:text-gray-100 truncate leading-snug">
          {product.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {hasDiscount && (
            <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
          <span className="text-sm font-bold text-primary">{formatCurrency(unitPrice)}</span>
          {discountPercent > 0 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              {discountPercent}% OFF
            </span>
          )}
        </div>
        {!outOfStock && product.stock <= 5 && (
          <p className="text-[10px] text-orange-500 mt-0.5">Only {product.stock} left</p>
        )}
      </div>

      {/* Action */}
      <div className="shrink-0">
        {outOfStock ? (
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 px-2">
            Sold out
          </span>
        ) : inCart ? (
          // Inline stepper — keeps quantity editable without leaving the list
          <div className="flex items-center gap-0.5 rounded-lg border border-primary/30 bg-white dark:bg-dark-300 p-0.5">
            <button
              onClick={(e) => handleStep(e, -1)}
              disabled={busy}
              aria-label={`Reduce quantity of ${product.name}`}
              className="w-7 h-7 rounded-md flex items-center justify-center text-primary hover:bg-primary/10 disabled:opacity-40"
            >
              <Minus size={13} />
            </button>
            <span className="w-6 text-center text-sm font-bold text-primary tabular-nums">
              {busy ? <Loader2 size={12} className="animate-spin mx-auto" /> : cartQty}
            </span>
            <button
              onClick={(e) => handleStep(e, 1)}
              disabled={busy || cartQty >= maxQty}
              aria-label={`Increase quantity of ${product.name}`}
              className="w-7 h-7 rounded-md flex items-center justify-center text-primary hover:bg-primary/10 disabled:opacity-40"
            >
              <Plus size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={busy}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-white text-sm font-semibold
                       transition-transform duration-150 active:scale-95 disabled:opacity-60"
            style={{
              background: justAdded
                ? "linear-gradient(135deg,#16a34a,#22c55e)"
                : "linear-gradient(135deg,#c9184a,#e02b6a)",
            }}
          >
            {busy ? (
              <Loader2 size={13} className="animate-spin" />
            ) : justAdded ? (
              <Check size={13} />
            ) : (
              <ShoppingCart size={13} />
            )}
            <span className="hidden sm:inline">{justAdded ? "Added" : "Add"}</span>
          </button>
        )}
      </div>
    </Link>
  );
}
