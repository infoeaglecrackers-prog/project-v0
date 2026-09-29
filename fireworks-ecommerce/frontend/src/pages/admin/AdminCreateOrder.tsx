import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { adminService } from "../../services/adminService";
import { formatCurrency } from "../../utils/formatCurrency";
import { ChevronLeft, Search, Plus, Minus, Trash2, Loader2, PackageSearch, ShoppingCart } from "lucide-react";
import type { IProduct } from "../../types";
import toast from "react-hot-toast";

interface SelectedItem {
  product: IProduct;
  quantity: number;
  price: number;
}

interface ICategoryOption {
  _id: string;
  name: string;
}

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash / Pay on Delivery" },
  { value: "upi", label: "UPI" },
  { value: "pay_later", label: "Pay Later" },
];

export default function AdminCreateOrder() {
  const navigate = useNavigate();

  // Product catalog — browsable & searchable, same as the storefront list page
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<ICategoryOption[]>([]);

  // Selected items (the order's "cart")
  const [items, setItems] = useState<SelectedItem[]>([]);

  // Customer + billing
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Payment + extras
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending">("pending");
  const [discountAmount, setDiscountAmount] = useState("");
  const [shippingPrice, setShippingPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Categories for the filter dropdown, fetched once
  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => setCategories(res.data?.data?.categories || []))
      .catch(() => {});
  }, []);

  // Debounced product listing — refetches on search/category change, all matches in one page
  useEffect(() => {
    setProductsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await productService.getAll({
          keyword: keyword || undefined,
          category: categoryId || undefined,
          limit: 0,
        });
        const data = res.data?.data as { products?: IProduct[] } | undefined;
        setProducts(data?.products || []);
      } catch {
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, categoryId]);

  const getQty = (productId: string) => items.find((i) => i.product._id === productId)?.quantity ?? 0;

  const addProduct = (product: IProduct) => {
    setItems((prev) => {
      const alreadyAdded = prev.some((i) => i.product._id === product._id);
      if (alreadyAdded) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1, price: product.discountPrice ?? product.price }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.product._id === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const updatePrice = (productId: string, value: string) => {
    const price = Number(value);
    setItems((prev) =>
      prev.map((i) => (i.product._id === productId ? { ...i, price: Number.isNaN(price) ? 0 : price } : i))
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = Number(discountAmount) || 0;
  const shipping = Number(shippingPrice) || 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("Add at least one product");
      return;
    }
    if (!customerName.trim() || !/^[6-9]\d{9}$/.test(customerPhone.trim())) {
      toast.error("Enter customer name and a valid 10-digit phone number");
      return;
    }
    if (!addressLine1.trim() || !city.trim() || !state.trim() || !/^\d{6}$/.test(pincode.trim())) {
      toast.error("Enter a complete billing address");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.product._id, quantity: i.quantity, price: i.price })),
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim() || undefined,
        },
        shippingAddress: {
          fullName: customerName.trim(),
          phone: customerPhone.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          country: "India",
        },
        paymentMethod,
        paymentStatus,
        discountAmount: discount,
        shippingPrice: shipping,
        notes: notes.trim() || undefined,
      };
      const res = await adminService.createManualOrder(payload);
      const order = res.data?.data?.order;
      toast.success("Order created successfully");
      navigate(`/admin/orders/${order._id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-28 lg:pb-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-gray-200 mb-4 sm:mb-6"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <h1 className="text-lg sm:text-xl font-bold text-dark dark:text-gray-100 mb-1">Create Order</h1>
      <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-5 sm:mb-6">
        For customers ordering by phone/WhatsApp. Browse products, add them to the cart, and fill in the customer's details to generate the invoice — no login needed.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* ── Left: products ── */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="card p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search products by name..."
                  className="input-field pl-9 text-sm w-full"
                />
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input-field text-sm sm:w-48"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {productsLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 animate-pulse">
                    <div className="w-12 h-12 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-gray-100 dark:bg-gray-700" />
                      <div className="h-3 w-2/5 rounded bg-gray-100 dark:bg-gray-700" />
                    </div>
                    <div className="w-16 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-14 flex flex-col items-center text-gray-300 dark:text-gray-600">
                <PackageSearch size={32} />
                <p className="text-sm mt-2 text-gray-400 dark:text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {products.map((p) => {
                  const qty = getQty(p._id);
                  const outOfStock = p.stock <= 0;
                  return (
                    <div
                      key={p._id}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                        qty > 0
                          ? "border-primary/40 bg-primary/[0.04] dark:bg-primary/[0.08]"
                          : "border-gray-100 dark:border-gray-700"
                      }`}
                    >
                      <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                        <img
                          src={p.images?.[0]?.url || "https://placehold.co/100x100"}
                          alt={p.images?.[0]?.alt || p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark dark:text-gray-100 truncate leading-snug">
                          {p.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-sm font-bold text-primary">
                            {formatCurrency(p.discountPrice ?? p.price)}
                          </span>
                          <span className={`text-[10px] ${outOfStock ? "text-red-500" : "text-gray-400"}`}>
                            {outOfStock ? "Out of stock" : `Stock: ${p.stock}`}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {qty === 0 ? (
                          <button
                            onClick={() => addProduct(p)}
                            disabled={outOfStock}
                            className="btn-primary flex items-center gap-1.5 px-3.5 py-2 text-xs disabled:opacity-40"
                          >
                            <Plus size={13} /> Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-0.5 rounded-lg border border-primary/30 dark:border-primary/40 p-0.5">
                            <button
                              onClick={() => updateQuantity(p._id, -1)}
                              className="w-7 h-7 rounded-md flex items-center justify-center text-primary hover:bg-primary/10"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-primary tabular-nums">{qty}</span>
                            <button
                              onClick={() => updateQuantity(p._id, 1)}
                              disabled={qty >= p.stock}
                              className="w-7 h-7 rounded-md flex items-center justify-center text-primary hover:bg-primary/10 disabled:opacity-40"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Customer & Billing */}
          <div className="card p-4 sm:p-5">
            <h3 className="font-semibold text-dark dark:text-gray-100 mb-3 text-sm sm:text-base">
              Customer & Billing Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer full name *"
                className="input-field text-sm"
              />
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Phone number *"
                inputMode="numeric"
                className="input-field text-sm"
              />
              <input
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email (optional)"
                type="email"
                className="input-field text-sm sm:col-span-2"
              />
              <input
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Address line 1 *"
                className="input-field text-sm sm:col-span-2"
              />
              <input
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Address line 2"
                className="input-field text-sm sm:col-span-2"
              />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City *"
                className="input-field text-sm"
              />
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State *"
                className="input-field text-sm"
              />
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Pincode *"
                inputMode="numeric"
                className="input-field text-sm"
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              The invoice will be billed to the customer name and phone entered above.
            </p>
          </div>
        </div>

        {/* ── Right: cart + payment + summary ── */}
        <div className="space-y-4 sm:space-y-6">
          <div className="card p-4 sm:p-5">
            <h3 className="font-semibold text-dark dark:text-gray-100 mb-3 text-sm sm:text-base flex items-center gap-2">
              <ShoppingCart size={16} /> Cart ({items.length})
            </h3>
            {items.length === 0 ? (
              <div className="py-8 flex flex-col items-center text-gray-300 dark:text-gray-600">
                <PackageSearch size={26} />
                <p className="text-xs mt-2 text-gray-400 dark:text-gray-500">No products added yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {items.map((i) => (
                  <div key={i.product._id} className="flex items-center gap-2">
                    <img
                      src={i.product.images?.[0]?.url || "https://placehold.co/40x40"}
                      alt={i.product.images?.[0]?.alt || i.product.name}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-dark dark:text-gray-100 truncate">{i.product.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] text-gray-400">₹</span>
                        <input
                          type="number"
                          min={0}
                          value={i.price}
                          onChange={(e) => updatePrice(i.product._id, e.target.value)}
                          className="w-14 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded px-1 py-0.5 text-[11px]"
                        />
                        <span className="text-[10px] text-gray-400">× {i.quantity}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(i.product._id, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300"
                      >
                        <Minus size={11} />
                      </button>
                      <button
                        onClick={() => updateQuantity(i.product._id, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300"
                      >
                        <Plus size={11} />
                      </button>
                      <button onClick={() => removeItem(i.product._id)} className="text-gray-300 hover:text-red-500">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-4 sm:p-5">
            <h3 className="font-semibold text-dark dark:text-gray-100 mb-3 text-sm sm:text-base">Payment</h3>
            <label className="text-xs text-gray-400 dark:text-gray-500">Payment method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input-field text-sm mt-1 mb-3"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <label className="text-xs text-gray-400 dark:text-gray-500">Payment status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as "paid" | "pending")}
              className="input-field text-sm mt-1"
            >
              <option value="pending">Pending / Collect on delivery</option>
              <option value="paid">Already paid</option>
            </select>
          </div>

          <div className="card p-4 sm:p-5">
            <h3 className="font-semibold text-dark dark:text-gray-100 mb-3 text-sm sm:text-base">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Discount</span>
                <input
                  type="number"
                  min={0}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  placeholder="0"
                  className="w-24 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-1 text-xs text-right"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Shipping</span>
                <input
                  type="number"
                  min={0}
                  value={shippingPrice}
                  onChange={(e) => setShippingPrice(e.target.value)}
                  placeholder="0"
                  className="w-24 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-1 text-xs text-right"
                />
              </div>
              <div className="flex justify-between font-bold text-dark dark:text-gray-100 pt-2 border-t border-gray-100 dark:border-gray-700 text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal note (optional)"
              rows={2}
              className="input-field text-sm mt-3 w-full resize-none"
            />

            {/* Desktop submit button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary w-full mt-4 hidden lg:flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting ? "Creating order..." : "Create Order & Generate Invoice"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sticky submit bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 dark:text-gray-500">Total</p>
          <p className="font-bold text-dark dark:text-gray-100 text-base truncate">{formatCurrency(total)}</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 px-5 py-3 text-sm shrink-0"
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting ? "Creating..." : "Create Order"}
        </button>
      </div>
    </div>
  );
}
