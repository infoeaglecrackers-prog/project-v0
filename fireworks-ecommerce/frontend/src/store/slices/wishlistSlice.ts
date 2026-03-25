import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistService } from "../../services/wishlistService";
import type { IProduct } from "../../types";

interface WishlistState {
  products: IProduct[];
  loading: boolean;
}

const initialState: WishlistState = { products: [], loading: false };

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await wishlistService.getWishlist();
    return res.data.data?.products || [];
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed");
  }
});

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await wishlistService.toggle(productId);
      return res.data.data?.products || [];
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Failed");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.products = action.payload; })
      .addCase(toggleWishlist.fulfilled, (state, action) => { state.products = action.payload; });
  },
});

export default wishlistSlice.reducer;
