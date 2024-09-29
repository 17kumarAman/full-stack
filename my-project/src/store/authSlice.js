import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });

      // Store the token and user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data.user;
    } catch (err) {
      // Return error message
      return rejectWithValue(
        err.response?.data?.message || "An error occurred during login."
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, phone, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("http://localhost:4000/api/register", {
        username,
        email,
        password,
        phone,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      return rejectWithValue(
        err.response?.data?.message || "An error occurred during login."
      );
    }
  }
);

// Redux slice for authentication
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null, // Load user from localStorage
    error: null,
    isLoading: false,
  },
  reducers: {
    // Logout action
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { logout } = authSlice.actions;

// Export selector to get the user
export const selectUser = (state) => state.auth.user;

// Export reducer
export default authSlice.reducer;
