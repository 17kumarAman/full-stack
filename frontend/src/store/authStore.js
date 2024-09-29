// src/store/authStore.js
import axios from "axios";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const error = ref(null);
  const isLoading = ref(false);

  // getters
  const getUser = computed(() => user.value);

  const login = async (email, password) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Make POST request using axios
      const { data } = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });

      // Store the token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      user.value = data.user;
    } catch (err) {
      // Handle error
      error.value =
        err.response?.data?.message || "An error occurred during login.";
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (username, email, password, phone) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await axios.post("http://localhost:4000/api/register", {
        username,
        email,
        password,
        phone,
      });

      // Store the token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      user.value = data;
    } catch (err) {
      // Handle error
      error.value =
        err.response?.data?.message || "An error occurred during registration.";
    } finally {
      isLoading.value = false;
    }
  };
  function logout() {
    user.value = null; // Clear user state
    localStorage.removeItem("user"); // Remove user data from localStorage
  }

  return { user, error, isLoading, login, register, getUser, logout };
});
