import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null); // Initialize with null, assuming no user initially

  // Computed property to return the user
  const getUser = computed(() => user.value);

  // Function to set the user from localStorage
  function setUser() {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) {
      user.value = data;
    }
  }

  // Function to logout the user
  

  return { user, getUser, setUser };
});
