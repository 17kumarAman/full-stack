import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUserStore } from "./userStore";
import axios from "axios";

export const useCartStore = defineStore("cart", () => {
  const userStore = useUserStore();
  const cart = ref(null); // Cart initially empty

  // Computed property to get the user from the user store
  const user = computed(() => userStore.user);

  // Computed property to get the cart items
  const getCart = computed(() => cart.value);

  // Function to fetch and set the cart for the logged-in user
  async function setCart() {
    if (!user.value) {
      console.error("User not logged in");
      return;
    }
    try {
      const { data } = await axios.get(
        `http://localhost:4000/cart/${user.value.id}`
      );
      // console.log(data);
      cart.value = data.cart; // Update the cart state with fetched data
    } catch (error) {
      console.error(
        "Error fetching cart:",
        error.response?.data || error.message
      );
    }
  }

  // Function to add a product to the cart
  async function addToCart(id) {
    if (!user.value) {
      console.error("User not logged in");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:4000/cart/${user.value.id}/${id}`
      );
      if (response.status === 200) {
        console.log("Product added to cart successfully:", response.data);
        await setCart(); // Refresh the cart after adding
      }
    } catch (error) {
      console.error(
        "Error adding product to cart:",
        error.response?.data || error.message
      );
    }
  }

  // Function to remove a product from the cart
  async function removeFromCart(id) {
    if (!user.value) {
      console.error("User not logged in");
      return;
    }
    try {
      await axios.delete(`http://localhost:4000/cart/${user.value.id}/${id}`);
      await setCart();
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.error(
          "Error removing product from cart:",
          error.response.data || error.message
        );
      } else {
        console.error("Network error occurred:", error);
      }
    }
  }

  // Function to delete the entire cart
  async function deleteCart() {
    if (!user.value) {
      console.error("User not logged in");
      return;
    }
    try {
      const res = await axios.delete(
        `http://localhost:4000/cart/${user.value.id}`
      );
      if (res.status === 200) {
        console.log("Cart deleted successfully");
        cart.value = null; // Clear the cart state
      }
    } catch (error) {
      console.error(
        "Error deleting cart:",
        error.response?.data || error.message
      );
    }
  }
  async function updateCartQuantity(productId, action) {
    // Ensure the user is logged in
    if (!user.value) {
      console.error("User not logged in");
      return;
    }
  
    // Validate the action input
    if (!['increase', 'decrease'].includes(action)) {
      console.error("Invalid action. Expected 'increase' or 'decrease'.");
      return;
    }
  
    try {
      // Make the API call to update the cart quantity
      const response = await axios.post(
        `http://localhost:4000/cart/update/${user.value.id}/${productId}`,
        { action } // Pass the action as 'increase' or 'decrease'
      );
  
      // Check if the response is successful
      if (response.status === 200) {
        console.log(`Product quantity ${action}d successfully`, response.data);
  
        // Refresh the cart after the update
        await setCart();
  
        // Optionally return the updated cart or any other data
        return response.data;
      } else {
        console.error("Failed to update cart quantity:", response.statusText);
      }
    } catch (error) {
      // Handle error and display appropriate error message
      console.error(
        `Error ${action}ing product quantity:`,
        error.response?.data || error.message
      );
    }
  }
  

  return {
    cart,
    user,
    getCart,
    setCart,
    addToCart,
    removeFromCart,
    deleteCart,
    updateCartQuantity,
  };
});
