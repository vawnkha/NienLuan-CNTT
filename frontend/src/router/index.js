import { createRouter, createWebHistory } from "vue-router";
import { useAppLoading } from "@/stores/user/appLoading";
import { useAuthStore } from "@/stores/user/auth";
import userRoutes from "./user";
import adminRoutes from "./admin";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...userRoutes,
    ...adminRoutes,
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/pages/user/NotFoundPage.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const { showLoading } = useAppLoading();
  const authStore = useAuthStore();

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  showLoading();

  try {
    if (to.meta.requiresAuth && !userId) {
      return next("/login");
    }

    if (
      to.matched.some((record) => record.meta.requiresAdmin) &&
      role !== "admin"
    ) {
      return next("/");
    }

    if (userId) {
      let user = authStore.user;

      // chỉ fetch khi chưa có hoặc sai user
      if (!user || String(user._id) !== String(userId)) {
        user = await authStore.fetchProfile();
      }

      if (user?.status === "blocked") {
        authStore.logout();

        if (to.name !== "login" && to.name !== "admin-login") {
          return next("/login");
        }

        return next();
      }
    }

    next();
  } catch (error) {
    console.error(error);

    authStore.logout();

    if (to.name !== "login" && to.name !== "admin-login") {
      return next("/login");
    }

    next();
  }
});

router.afterEach(() => {
  const { hideLoading } = useAppLoading();
  setTimeout(() => {
    hideLoading();
  }, 500);
});

export default router;
