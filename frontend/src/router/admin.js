const adminRoutes = [
  {
    path: "/admin/login",
    component: () => import("@/layouts/AdminLayout.vue"),
    children: [
      {
        path: "",
        name: "admin-login",
        component: () => import("@/pages/admin/AdminLoginPage.vue"),
      },
    ],
  },
  {
    path: "/admin",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        name: "admin-dashboard",
        component: () => import("@/pages/admin/DashboardPage.vue"),
      },
      {
        path: "products",
        name: "admin-products",
        component: () => import("@/pages/admin/ProductListPage.vue"),
      },
      {
        path: "products/create",
        name: "admin-product-create",
        component: () => import("@/pages/admin/ProductCreatePage.vue"),
      },

      {
        path: "categories",
        name: "admin-categories",
        component: () => import("@/pages/admin/CategoryListPage.vue"),
      },
      {
        path: "categories/create",
        name: "admin-category-create",
        component: () => import("@/pages/admin/CategoryCreatePage.vue"),
      },

      {
        path: "orders",
        name: "admin-orders",
        component: () => import("@/pages/admin/OrderListPage.vue"),
      },
      {
        path: "orders/:id",
        name: "admin-order-detail",
        component: () => import("@/pages/admin/OrderDetailPage.vue"),
      },
      {
        path: "users",
        name: "admin-users",
        component: () => import("@/pages/admin/UserListPage.vue"),
      },
      {
        path: "contacts",
        name: "admin-contacts",
        component: () => import("@/pages/admin/ContactsPage.vue"),
      },
      {
        path: "notifications",
        name: "admin-notifications",
        component: () => import("@/pages/admin/NotificationsPage.vue"),
      },
    ],
  },
];

export default adminRoutes;
