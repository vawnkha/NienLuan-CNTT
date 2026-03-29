import { createRouter, createWebHistory } from "vue-router";
import { useAppLoading } from "@/stores/user/appLoading";
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

router.beforeEach((to, from, next) => {
  const { showLoading } = useAppLoading();

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (to.meta.requiresAuth && !userId) {
    return next("/login");
  }

  if (
    to.matched.some((record) => record.meta.requiresAdmin) &&
    role !== "admin"
  ) {
    return next("/");
  }

  showLoading();
  next();
});

router.afterEach(() => {
  const { hideLoading } = useAppLoading();
  setTimeout(() => {
    hideLoading();
  }, 500);
});

export default router;
