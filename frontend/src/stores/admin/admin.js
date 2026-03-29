import { defineStore } from "pinia";
import productService from "@/services/product.service";
import categoryService from "@/services/category.service";
import ordersService from "@/services/orders.service";
import userService from "@/services/user.service";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    dashboard: {
      totalProducts: 0,
      totalCategories: 0,
      totalOrders: 0,
      totalUsers: 0,
      revenue: 0,
      pendingOrders: 0,
    },
    loading: false,
  }),

  actions: {
    async fetchDashboard() {
      this.loading = true;
      try {
        const [productsRes, categoriesRes, ordersRes, usersRes] =
          await Promise.all([
            productService.getAll(),
            categoryService.getAll(),
            ordersService.getAll(),
            userService.getAll(),
          ]);

        const products = productsRes?.data || productsRes || [];
        const categories = categoriesRes?.data || categoriesRes || [];
        const orders = ordersRes?.data || ordersRes || [];
        const users = usersRes?.data || usersRes || [];

        this.dashboard = {
          totalProducts: products.length,
          totalCategories: categories.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          revenue: orders
            .filter((item) =>
              ["processing", "shipping", "completed"].includes(item.status),
            )
            .reduce((sum, item) => sum + Number(item.total_price || 0), 0),
          pendingOrders: orders.filter((item) => item.status === "pending")
            .length,
        };
      } finally {
        this.loading = false;
      }
    },
  },
});
