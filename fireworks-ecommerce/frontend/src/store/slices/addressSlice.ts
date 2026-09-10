import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addressService } from "../../services/addressService";
import type { IAddress } from "../../types";

const CACHE_KEY = "ec_addresses_cache_v1";

interface AddressState {
  addresses: IAddress[];
  /** True once we've fetched from the server at least once this session. */
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

const readCache = (): IAddress[] => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as IAddress[]) : [];
  } catch {
    return [];
  }
};

const writeCache = (addresses: IAddress[]) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(addresses));
  } catch {
    // storage full/unavailable — cache is a convenience, not required
  }
};

// Paint from localStorage instantly on load (stale-while-revalidate); the
// checkout page still fires fetchAddresses in the background to reconcile.
const initialState: AddressState = {
  addresses: readCache(),
  loaded: false,
  loading: false,
  error: null,
};

/**
 * Fetches the address list from the server. Skips the network call when we
 * already have a loaded copy this session — existing addresses only need to
 * be fetched once; mutations below keep the cache in sync after that.
 */
export const fetchAddresses = createAsyncThunk<
  IAddress[],
  boolean | void,
  { state: { address: AddressState } }
>(
  "address/fetch",
  async (_forceRefresh, { rejectWithValue }) => {
    try {
      const res = await addressService.getAll();
      return (res.data.data?.addresses ?? []) as IAddress[];
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Failed to fetch addresses");
    }
  },
  {
    condition: (forceRefresh, { getState }) => {
      if (forceRefresh) return true;
      return !getState().address.loaded;
    },
  }
);

export const addAddress = createAsyncThunk(
  "address/add",
  async (data: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const res = await addressService.add(data);
      return res.data.data.address as IAddress;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Failed to add address");
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/update",
  async ({ id, data }: { id: string; data: Record<string, unknown> }, { rejectWithValue }) => {
    try {
      const res = await addressService.update(id, data);
      return res.data.data.address as IAddress;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Failed to update address");
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await addressService.delete(id);
      return id;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Failed to delete address");
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "address/setDefault",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await addressService.setDefault(id);
      return res.data.data.address as IAddress;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Failed to set default address");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => { state.loading = true; })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.addresses = action.payload;
        writeCache(action.payload);
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        // condition() short-circuits with no payload on the "already loaded" skip —
        // only surface a real error when one came back from the server.
        if (action.payload) state.error = action.payload as string;
      })

      .addCase(addAddress.fulfilled, (state, action) => {
        const added = action.payload;
        if (added.isDefault) state.addresses.forEach((a) => { a.isDefault = false; });
        state.addresses.push(added);
        writeCache(state.addresses);
      })

      .addCase(updateAddress.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated.isDefault) state.addresses.forEach((a) => { a.isDefault = false; });
        const idx = state.addresses.findIndex((a) => a._id === updated._id);
        if (idx >= 0) state.addresses[idx] = updated;
        writeCache(state.addresses);
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((a) => a._id !== action.payload);
        writeCache(state.addresses);
      })

      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        const updated = action.payload;
        state.addresses.forEach((a) => { a.isDefault = a._id === updated._id; });
        writeCache(state.addresses);
      });
  },
});

export default addressSlice.reducer;
