import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartService } from "../../services/cartService";
import type { ICart, IProduct } from "../../types";

interface CartState {
  cart: ICart | null;
  loading: boolean;
  error: string | null;
  /** Pre-mutation snapshot, used to roll back an optimistic update if the background request fails. */
  snapshot: ICart | null;
}

const initialState: CartState = { cart: null, loading: false, error: null, snapshot: null };

const recalcTotals = (cart: ICart): ICart => ({
  ...cart,
  totalItems: cart.items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
});

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await cartService.getCart();
    return res.data.data?.cart ?? res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
  }
});

export const addToCart = createAsyncThunk(
  "cart/addItem",
  // `product` is only used to render the optimistic line instantly — the
  // server ignores it and is still the source of truth for price/stock.
  async (
    { productId, quantity }: { productId: string; quantity: number; product?: IProduct },
    { rejectWithValue }
  ) => {
    try {
      const res = await cartService.addItem(productId, quantity);
      return res.data.data?.cart ?? res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
  }
);

export const updateCartQty = createAsyncThunk(
  "cart/updateQty",
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const res = await cartService.updateQuantity(productId, quantity);
      return res.data.data?.cart ?? res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Failed");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await cartService.removeItem(productId);
      return res.data.data?.cart ?? res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Failed");
    }
  }
);

export const clearCart = createAsyncThunk("cart/clear", async (_, { rejectWithValue }) => {
  try {
    const res = await cartService.clearCart();
    return res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setCart = (state: CartState, action: { payload: ICart }) => {
      state.loading = false;
      state.snapshot = null;
      state.cart = action.payload;
    };
    // On failure, the optimistic edit was wrong — snap back to what the
    // server actually had before the click.
    const rollback = (state: CartState) => {
      state.loading = false;
      if (state.snapshot) state.cart = state.snapshot;
      state.snapshot = null;
    };

    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, setCart)

      // ── Add to cart: render the new/updated line immediately, hit the API in the background ──
      .addCase(addToCart.pending, (state, action) => {
        state.snapshot = state.cart;
        const { productId, quantity, product } = action.meta.arg;
        const base: ICart = state.cart ?? {
          _id: "optimistic",
          user: "",
          items: [],
          totalItems: 0,
          totalPrice: 0,
        };
        const existing = base.items.find((i) => i.product._id === productId);
        const items = existing
          ? base.items.map((i) =>
              i.product._id === productId ? { ...i, quantity: i.quantity + quantity } : i
            )
          : product
            ? [...base.items, { product, quantity, price: product.discountPrice ?? product.price }]
            : base.items;
        state.cart = recalcTotals({ ...base, items });
      })
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, rollback)

      // ── Update quantity (0 removes the line) — same instant-then-reconcile pattern ──
      .addCase(updateCartQty.pending, (state, action) => {
        if (!state.cart) return;
        state.snapshot = state.cart;
        const { productId, quantity } = action.meta.arg;
        const items = quantity <= 0
          ? state.cart.items.filter((i) => i.product._id !== productId)
          : state.cart.items.map((i) => (i.product._id === productId ? { ...i, quantity } : i));
        state.cart = recalcTotals({ ...state.cart, items });
      })
      .addCase(updateCartQty.fulfilled, setCart)
      .addCase(updateCartQty.rejected, rollback)

      // ── Remove item ──
      .addCase(removeFromCart.pending, (state, action) => {
        if (!state.cart) return;
        state.snapshot = state.cart;
        const productId = action.meta.arg;
        state.cart = recalcTotals({
          ...state.cart,
          items: state.cart.items.filter((i) => i.product._id !== productId),
        });
      })
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(removeFromCart.rejected, rollback)

      .addCase(clearCart.fulfilled, (state) => { state.cart = null; state.snapshot = null; });
  },
});

export default cartSlice.reducer;
