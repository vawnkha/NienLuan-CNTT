import { defineStore } from "pinia";
import authService from "@/services/auth.service";
import userService from "@/services/user.service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    userId: localStorage.getItem("userId") || null,
    role: localStorage.getItem("role") || null,
    isLoggedIn: !!localStorage.getItem("userId"),
  }),

  actions: {
    async login(payload) {
      const res = await authService.login(payload);

      this.userId = res.userId;
      this.role = res.role;
      this.isLoggedIn = true;

      localStorage.setItem("userId", res.userId);
      localStorage.setItem("role", res.role);

      await this.fetchProfile();
      return res;
    },

    async fetchProfile() {
      if (!this.userId) return null;
      const res = await userService.getUserById(this.userId);
      this.user = res;
      return res;
    },

    logout() {
      this.user = null;
      this.userId = null;
      this.role = null;
      this.isLoggedIn = false;

      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    },
  },
});
