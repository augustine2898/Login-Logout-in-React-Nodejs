// features/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log(backendUrl)

// Async thunk for login
export const adminLogin = createAsyncThunk('admin/login', async ({ email, password }, thunkAPI) => {
  try {
    const res = await axios.post('/api/admin/login', { email, password });
    return res.data.admin;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
})

// Async thunk to check if admin is authenticated
export const fetchAdminAuthState = createAsyncThunk('admin/fetchAuth', async (_, thunkAPI) => {
  console.log('✅ fetchAdminAuthState called');
  try {
    const res = await axios.get(`${backendUrl}/api/admin/is-authenticated`, {
      withCredentials: true
    });
    console.log('🟢 Auth success:', res.data);
    return res.data.admin;
  } catch (err) {
    console.log('🔴 Auth failed:', err.response?.data?.message || err.message);

    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    adminLogout(state) {
      state.admin = null;
      state.isAuthenticated = false;
    },
    setAdmin(state, action) {
      state.admin = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(adminLogin.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminAuthState.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchAdminAuthState.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.isAuthenticated = false;
      })
  }
})

export const { adminLogout ,setAdmin} = adminSlice.actions;
export default adminSlice.reducer;
