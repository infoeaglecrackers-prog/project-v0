import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminService } from "../../services/adminService";
import type { IAdminStats, IUser, IOrder, IProduct, ICategory, IDashboardResponse } from "../../types";

interface AdminState {
  stats: IAdminStats | null;
  recentOrders: IOrder[];
  topProducts: IProduct[];
  users: IUser[];
  orders: IOrder[];
  products: IProduct[];
  categories: ICategory[];
  pagination: { currentPage: number; totalPages: number; totalUsers: number; limit: number } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  recentOrders: [],
  topProducts: [],
  users: [],
  orders: [],
  products: [],
  categories: [],
  pagination: null,
  loading: false,
  error: null,
};

export const fetchDashboard = createAsyncThunk("admin/dashboard", async (_, { rejectWithValue }) => {
  try {
    const res = await adminService.getDashboard();
    return res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed");
  }
});

export const fetchAdminOrders = createAsyncThunk("admin/orders", async (params: Record<string, unknown> = {}, { rejectWithValue }) => {
  try {
    const res = await adminService.getOrders(params);
    return res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed");
  }
});

export const fetchAdminUsers = createAsyncThunk("admin/users", async (params: Record<string, unknown> = {}, { rejectWithValue }) => {
  try {
    const res = await adminService.getUsers(params);
    return res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed");
  }
});

export const fetchAdminCategories = createAsyncThunk("admin/categories", async (_, { rejectWithValue }) => {
  try {
    const res = await adminService.getCategories();
    return res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed");
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as IDashboardResponse;
        state.stats = payload.stats;
        state.recentOrders = payload.recentOrders;
        state.topProducts = payload.topProducts;
      })

      .addCase(fetchAdminOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        // API may return { orders: [...], pagination: {...} } or an array directly
        state.orders = (action.payload && (action.payload as any).orders) ? (action.payload as any).orders : (action.payload as any) || [];
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload as string || 'Failed'; })

      .addCase(fetchAdminUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        if (payload && payload.users) {
          state.users = payload.users;
          state.pagination = payload.pagination || null;
        } else if (Array.isArray(payload)) {
          state.users = payload;
        }
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload as string || 'Failed'; })

      .addCase(fetchAdminCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        if (payload && payload.categories) {
          state.categories = payload.categories;
        } else if (Array.isArray(payload)) {
          state.categories = payload;
        }
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload as string || 'Failed'; });
  },
});

export default adminSlice.reducer;
