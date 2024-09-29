<script setup>
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "../store/userStore";
import { useCartStore } from "../store/cartStore";

// User store initialization
const userStore = useUserStore();
userStore.setUser();
const user = computed(() => userStore.getUser);

// Function to add product to cart
function addToCart(id) {
  try {
    useCartStore().addToCart(id);
    console.log("Product added to cart successfully");
  } catch (error) {
    console.log("Error adding to cart:", error);
  }
}

// Product list and search term references
const products = ref([]);
const searchTerm = ref(""); // Search term for filtering
const filteredProducts = computed(() => {
  if (!searchTerm.value) return products.value;
  return products.value.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const error = ref(null);
const isLoading = ref(true);

// Fetch products from the API
const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:4000/products");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    products.value = data.products || data; // Adjust based on actual API response
  } catch (err) {
    error.value = err.message || "An error occurred";
    console.log(err);
  } finally {
    isLoading.value = false;
  }
};

// Fetch data when component is mounted
onMounted(fetchData);
</script>

<template>
  <div class="p-4">
    <div v-if="isLoading" class="text-center">Loading...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>

    <!-- Search Bar -->
    <div class="mb-4 flex justify-center items-center">
      <!-- Search Icon -->
      <div class="relative">
        <img
          src="../assets/search.svg"
          alt="Search Icon"
          class="absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2"
        />
        <!-- Search Input -->
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search for products..."
          class="p-2 pl-10 border w-80 sm:w-96 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Product List -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <div
        v-if="!isLoading && !error && filteredProducts.length"
        v-for="product in filteredProducts"
        :key="product._id"
        class="border rounded-lg p-4 shadow-lg"
      >
        <img
          :src="product.image"
          alt="Product Image"
          class="h-40 rounded mx-auto"
        />
        <h2 class="font-bold text-lg">{{ product.title }}</h2>
        <p class="text-gray-700">Price: ${{ product.price }}</p>
        <div class="flex items-center justify-between">
          <router-link :to="`/product/${product._id}`" class="text-blue-500">
            View Product
          </router-link>
          <button
            @click="addToCart(product._id)"
            class="mt-2 py-2 px-4 bg-blue-500 text-white rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>

    <!-- No Products Found -->
    <div
      v-if="!filteredProducts.length && !isLoading && !error"
      class="text-center text-gray-500"
    >
      No products found.
    </div>
  </div>
</template>

<style scoped>
/* You can add custom styles here */
</style>
