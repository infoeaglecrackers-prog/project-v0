import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/productService";
import type { IProduct, IProductFilters } from "../../types";

interface ProductState {
  products: IProduct[];
  featured: IProduct[];
  bestSellers: IProduct[];
  current: IProduct | null;
  loading: boolean;
  error: string | null;
  pagination: { total: number; page: number; pages: number; limit: number; totalPages: number; currentPage: number } | null;
  filters: IProductFilters;
}

const initialState: ProductState = {
  products: [],
  featured: [],
  bestSellers: [],
  current: null,
  loading: false,
  error: null,
  pagination: null,
  filters: {},
};

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (filters: IProductFilters = {}, { rejectWithValue }) => {
    try {
      const res = await productService.getAll(filters);
      return res.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await productService.getById(id);
      return res.data.data?.product ?? res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
    }
  }
);

export const fetchFeatured = createAsyncThunk("products/featured", async (_, { rejectWithValue }) => {
  try {
    const res = await productService.getFeatured();
    return res.data.data?.products ?? res.data.data ?? [];
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed");
  }
});

export const fetchBestSellers = createAsyncThunk("products/bestSellers", async (_, { rejectWithValue }) => {
  try {
    const res = await productService.getBestSellers();
    return res.data.data?.products ?? res.data.data ?? [];
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed");
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters(state, action) { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters(state) { state.filters = {}; },
    clearCurrentProduct(state) { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data?.products ?? action.payload.data ?? [];
        const p = action.payload.pagination;
        state.pagination = p ? {
          total: p.totalProducts ?? p.total ?? 0,
          page: p.currentPage ?? p.page ?? 1,
          pages: p.totalPages ?? p.pages ?? 1,
          limit: p.limit ?? 12,
          totalPages: p.totalPages ?? p.pages ?? 1,
          currentPage: p.currentPage ?? p.page ?? 1,
        } : null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => { state.loading = true; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.featured = action.payload; })
      .addCase(fetchBestSellers.fulfilled, (state, action) => { state.bestSellers = action.payload; });
  },
});

export const { setFilters, clearFilters, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
