<template>
  <nav
    class="w-full bg-black text-white bg-opacity-80 border-b-4 border-[#3B058E] z-10"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo or Brand -->
        <div class="flex-shrink-0">
          <router-link to="/" class="font-bold text-lg capitalize">
            <div class="flex items-center justify-center">
              <img
                class="w-14 h-14 object-contain"
                src="../assets/reshot-icon-ecommerce-growth-ZHCKAQF6EV.svg"
                alt="StegX Logo"
              />
              <h1 class="text-3xl pt-4 font-bold">ECCOM</h1>
            </div>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link to="/" class="font-bold text-lg hover:text-gray-300"
            >Home</router-link
          >
          <router-link
            to="/products"
            class="font-bold text-lg hover:text-gray-300"
            >Shop</router-link
          >
          <div v-if="user" class="space-x-4">
            <router-link to="/cart" class="font-bold text-lg">Cart</router-link>
            <router-link to="/profile" class="font-bold text-lg"
              >Profile</router-link
            >
            <!-- <router-link to="/cart" class="font-bold text-lg">Cart</router-link> -->
            <button @click="logout" class="font-bold text-lg">Logout</button>
          </div>
          <div v-else class="space-x-4">
            <router-link to="/login" class="font-bold text-lg"
              >Login</router-link
            >
            <router-link to="/register" class="font-bold text-lg"
              >Signup</router-link
            >
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="md:hidden">
          <button
            @click="toggleMenu"
            class="font-bold text-xl focus:outline-none"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Content -->
      <div v-if="isMenuOpen" class="md:hidden bg-gray-700 p-4">
        <router-link to="/" class="block text-white mb-2 hover:text-gray-400"
          >Home</router-link
        >
        <router-link
          to="/products"
          class="block text-white mb-2 hover:text-gray-400"
          >Shop</router-link
        >
        <router-link
          to="/cart"
          class="block text-white mb-2 hover:text-gray-400"
          >Cart</router-link
        >

        <!-- Conditional rendering for login/signup or profile -->
        <div v-if="!user.value">
          <router-link
            to="/login"
            class="block text-white mb-2 hover:text-gray-400"
            >Login</router-link
          >
          <router-link
            to="/register"
            class="block text-white mb-2 hover:text-gray-400"
            >Signup</router-link
          >
        </div>
        <div v-else>
          <router-link
            to="/profile"
            class="block text-white mb-2 hover:text-gray-400"
            >Profile</router-link
          >
          <button @click="logout" class="block text-white hover:text-gray-400">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/userStore";

const router = useRouter();
const userStore = useUserStore();

// Handle the user state
const user = computed(() => userStore.user);

// Handle mobile menu state
const menuOpen = ref(false);
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
const isMenuOpen = computed(() => menuOpen.value);

// Handle logout
const logout = () => {
  userStore.logout();  // If userStore has a logout method, otherwise manually clear user data
  localStorage.clear();
  router.push("/login");
};

onMounted(() => {
  // Check if user is logged in when the component mounts
  if (!user.value) {
    userStore.setUser(); // Check user authentication from localStorage or API
  }
});
</script>


<style scoped>
/* Add custom styles if necessary */
nav {
  transition: background-color 0.3s ease;
}
nav:hover {
  background-color: rgba(0, 0, 0, 0.9);
}
</style>
