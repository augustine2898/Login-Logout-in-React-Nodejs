import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Thunk to check if the user is authenticated
export const fetchAuthState = createAsyncThunk(
  'auth/fetchAuthState',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, { withCredentials: true });
      if (data.success) {
        
        dispatch(fetchUserData());
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
      if (data.success) return data.userData;
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to log out the user
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      if (data.success) return data;
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedin: false,
    userData: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    resetAuthState: (state) => {
      state.isLoggedin = false;
      state.userData = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthState.fulfilled, (state) => {
        state.isLoggedin = true;
        state.error = null;
      })
      .addCase(fetchAuthState.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedin = false;
        state.userData = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
