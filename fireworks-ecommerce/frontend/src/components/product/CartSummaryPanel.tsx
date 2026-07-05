import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { updateCartQty, removeFromCart } from "../../store/slices/cartSlice";
import { formatCurrency } from "../../utils/formatCurrency";
import type { ICartItem } from "../../types";

export default function CartSummaryPanel() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart.cart);
  const items = cart?.items ?? [];

  const handleQty = (productId: string, newQty: number, stock: number) => {
    if (newQty < 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateCartQty({ productId, quantity: Math.min(newQty, stock) }));
    }
  };

  // Group items by category so the list reads as "Category → its products"
  const groups = items.reduce<Record<string, ICartItem[]>>((acc, item) => {
    const cat = typeof item.product.category === "object"
      ? item.product.category.name
      : "Other";
    (acc[cat] ??= []).push(item);
    return acc;
  }, {});

  return (
    <aside className="w-72 shrink-0">
      <div className="sticky top-20 card overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-white/[0.06]"
          style={{ background: "linear-gradient(135deg, #c9184a 0%, #e02b6a 100%)" }}>
          <div className="flex items-center gap-2 text-white">
            <ShoppingCart size={16} strokeWidth={2.5} />
            <span className="font-bold text-sm tracking-wide">My Selections</span>
          </div>
          {items.length > 0 && (
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {items.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <PackageOpen size={36} className="text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No items selected yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Add crackers from the list to see them here
            </p>
          </div>
        )}

        {/* Item list */}
        {items.length > 0 && (
          <>
            <div className="max-h-[420px] overflow-y-auto">
              {Object.entries(groups).map(([category, catItems]) => (
                <div key={category}>
                  {/* Category header */}
                  <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-primary uppercase tracking-widest bg-gray-50 dark:bg-dark-300 sticky top-0">
                    {category}
                  </p>

                  <ul className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {catItems.map((item) => {
                      const pid = item.product._id;
                      const stock = item.product.stock;
                      const lineTotal = item.price * item.quantity;

                      return (
                        <li key={pid} className="px-4 py-3 flex gap-3 group/item hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                          {/* Thumbnail */}
                          <img
                            src={item.product.images?.[0]?.url || "https://placehold.co/48x48?text="}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-100 dark:border-white/[0.06]"
                          />

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            {/* Name */}
                            <p className="text-xs font-semibold text-dark dark:text-gray-100 leading-snug line-clamp-2 mb-1.5">
                              {item.product.name}
                            </p>

                            {/* Quantity stepper + remove */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                                <button
                                  onClick={() => handleQty(pid, item.quantity - 1, stock)}
                                  className="px-2 py-1 text-gray-500 dark:text-gray-400
                                             hover:bg-primary hover:text-white
                                             transition-colors duration-150"
                                >
                                  {item.quantity === 1
                                    ? <Trash2 size={11} />
                                    : <Minus size={11} strokeWidth={2.5} />}
                                </button>
                                <span className="w-7 text-center text-xs font-bold text-dark dark:text-gray-100 select-none">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQty(pid, item.quantity + 1, stock)}
                                  disabled={item.quantity >= stock}
                                  className="px-2 py-1 text-gray-500 dark:text-gray-400
                                             hover:bg-primary hover:text-white
                                             disabled:opacity-30 disabled:cursor-not-allowed
                                             transition-colors duration-150"
                                >
                                  <Plus size={11} strokeWidth={2.5} />
                                </button>
                              </div>

                              {/* Line total */}
                              <span className="text-xs font-bold text-dark dark:text-gray-100">
                                {formatCurrency(lineTotal)}
                              </span>
                            </div>

                            {/* Per-unit price */}
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                              {formatCurrency(item.price)} × {item.quantity}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-dark-300 space-y-2">
              {/* Per-category breakdown */}
              {Object.entries(groups).map(([cat, catItems]) => {
                const total = catItems.reduce((s, i) => s + i.price * i.quantity, 0);
                return (
                  <div key={cat} className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="uppercase tracking-wide">{cat}</span>
                    <span className="font-medium">{formatCurrency(total)}</span>
                  </div>
                );
              })}

              <div className="border-t border-gray-200 dark:border-white/[0.08] pt-2 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-dark dark:text-gray-100">Total</span>
                <span className="text-base font-bold text-primary">
                  {formatCurrency(cart?.totalPrice ?? 0)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-white/[0.06]">
              <Link
                to="/cart"
                className="btn-primary w-full text-sm py-2.5 justify-center"
              >
                View Cart & Checkout <ArrowRight size={15} />
              </Link>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
