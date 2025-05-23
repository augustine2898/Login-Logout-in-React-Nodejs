import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const fetchAllUsers = createAsyncThunk('adminUsers/fetchAll', async ({ search, page }, thunkAPI) => {
  try {
    const endpoint = search
      ? `${backendUrl}/api/admin/users/search?query=${search}&page=${page}`
      : `${backendUrl}/api/admin/users?page=${page}`;
    const { data } = await axios.get(endpoint, { withCredentials: true });
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createUser = createAsyncThunk('adminUsers/create', async (userData, thunkAPI) => {
  try {
    const { data } = await axios.post(`${backendUrl}/api/admin/users/create`, userData, {
      withCredentials: true
    });
    return data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateUser = createAsyncThunk('adminUsers/update', async ({ id, userData }, thunkAPI) => {
  try {
    const { data } = await axios.put(`${backendUrl}/api/admin/users/${id}`, userData, {
      withCredentials: true
    });
    return data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteUser = createAsyncThunk('adminUsers/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${backendUrl}/api/admin/users/${id}`, {
      withCredentials: true
    });
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const adminUserSlice = createSlice({
  name: 'adminUsers',
  initialState: {
    users: [],
    totalPages: 1,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllUsers.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.users = state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      });
  }
});

export default adminUserSlice.reducer;
