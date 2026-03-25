import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import type { IUser, IAuthState } from "../../types";

const initialState: IAuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: { name: string; email: string; password: string; phone?: string }, { rejectWithValue }) => {
    try {
      const res = await authService.register(data);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: import("../../types").IApiResponse } };
      return rejectWithValue(error.response?.data || { message: "Registration failed" });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authService.login(data);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: import("../../types").IApiResponse } };
      return rejectWithValue(error.response?.data || { message: "Login failed" });
    }
  }
);

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const res = await authService.me();
    return res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.initialized = true;
      localStorage.removeItem("accessToken");
    },
    updateUser(state, action: PayloadAction<Partial<IUser>>) {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.initialized = true;
      localStorage.setItem("accessToken", action.payload.accessToken);
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      const payload = action.payload as any;
      state.error = (payload && payload.message) || (action.payload as string) || null;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.initialized = true;
      localStorage.setItem("accessToken", action.payload.accessToken);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      const payload = action.payload as any;
      state.error = (payload && payload.message) || (action.payload as string) || null;
    });

    // Me
    builder.addCase(fetchMe.pending, (state) => { state.loading = true; });
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.loading = false;
      state.initialized = true;
      state.user = action.payload.user || action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchMe.rejected, (state) => {
      state.loading = false;
      state.initialized = true;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.initialized = true;
      localStorage.removeItem("accessToken");
    });
  },
});

export const { setToken, logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;
