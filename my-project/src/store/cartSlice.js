import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { selectUser } from "../store/authSlice"; // Selector for user

// Fetch the cart
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const user = selectUser(state);

    if (!user?.id) {
      return rejectWithValue("User ID is not available.");
    }

    try {
      const { data } = await axios.get(`http://localhost:4000/cart/${user.id}`);
      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while fetching the cart."
      );
    }
  }
);

// Add an item to the cart
export const addToCart = createAsyncThunk(
  "cart/addItem",
  async ({ id }, { getState, rejectWithValue }) => {
    const state = getState();
    const user = selectUser(state);

    if (!user?.id) {
      return rejectWithValue("User ID is not available.");
    }

    try {
      const { data } = await axios.post(
        `http://localhost:4000/cart/${user.id}/${id}`
      );
      return data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while adding to the cart."
      );
    }
  }
);

export const removeCart = createAsyncThunk(
  "cart/removeCart",
  async (id, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const user = selectUser(state);

    if (!user?.id) {
      return rejectWithValue("User ID is not available.");
    }

    try {
      const { data } = await axios.delete(
        `http://localhost:4000/cart/${user.id}/${id}`
      );
      // Dispatch getCart to refresh the cart after deletion
      dispatch(getCart());
      return data.cart; // Return updated cart
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred while removing the item."
      );
    }
  }
);



export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, action }, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const user = selectUser(state);

    if (!user?.id) {
      return rejectWithValue("User ID is not available.");
    }

    try {
      const { data } = await axios.post(
        `http://localhost:4000/cart/update/${user.id}/${productId}`,
        { action }
      );

      // Fetch the updated cart after updating the quantity
      dispatch(getCart()); // Dispatch getCart to fetch the updated cart data
      return data.cart; // Optional: return cart if you want to use it directly
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while updating the quantity."
      );
    }
  }
);

// Delete the entire cart
export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const user = selectUser(state);

    if (!user?.id) {
      return rejectWithValue("User ID is not available.");
    }

    try {
      const { data } = await axios.delete(
        `http://localhost:4000/cart/${user.id}`
      );
      return data.cart; // Return updated cart or empty array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "An error occurred while deleting the cart."
      );
    }
  }
);

// Create the cart slice
export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart(state) {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCart.pending, (state) => {
        state.loading = true; // Set loading state
        state.error = null; // Reset error
      })
      .addCase(removeCart.fulfilled, (state, action) => {
        state.loading = false; // Reset loading state
        state.cart = action.payload; // Update cart with new data
      })
      .addCase(removeCart.rejected, (state, action) => {
        state.loading = false; // Reset loading state
        state.error = action.payload; // Set error message
      })
      .addCase(deleteCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCart.fulfilled, (state) => {
        state.loading = false;
        state.cart = []; // Clear the cart
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },

});

export const selectCart = (state) => state.cart;

// Export actions and reducer
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
