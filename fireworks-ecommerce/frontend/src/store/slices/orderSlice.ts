import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../../services/orderService";
import type { IOrder } from "../../types";

interface OrderState {
  orders: IOrder[];
  current: IOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = { orders: [], current: null, loading: false, error: null };

export const createOrder = createAsyncThunk("orders/create", async (data: object, { rejectWithValue }) => {
  try {
    const res = await orderService.create(data);
    return res.data.data?.order ?? res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed to place order");
  }
});

export const fetchMyOrders = createAsyncThunk("orders/fetchAll", async (params: Record<string, unknown> = {}, { rejectWithValue }) => {
  try {
    const res = await orderService.getMyOrders(params);
    return res.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed");
  }
});

export const fetchOrderById = createAsyncThunk("orders/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    const res = await orderService.getById(id);
    console.log("Order API response:", res.data); // Debug log
    const orderData = res.data.data?.order || res.data.data || res.data;
    console.log("Extracted order data:", orderData); // Debug log
    return orderData;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed");
  }
});

export const cancelOrder = createAsyncThunk(
  "orders/cancel",
  async ({ id, reason }: { id: string; reason: string }, { rejectWithValue }) => {
    try {
      const res = await orderService.cancel(id, reason);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Failed");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: { clearCurrentOrder(state) { state.current = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { 
        state.loading = false;
        state.orders = action.payload.data?.orders ?? action.payload.data ?? []; 
      })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      .addCase(fetchOrderById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrderById.fulfilled, (state, action) => { 
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      .addCase(cancelOrder.fulfilled, (state, action) => { state.current = action.payload; });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
