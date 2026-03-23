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
        path: "products/:id/edit",
        name: "admin-product-edit",
        component: () => import("@/pages/admin/ProductEditPage.vue"),
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
        path: "categories/:id/edit",
        name: "admin-category-edit",
        component: () => import("@/pages/admin/CategoryEditPage.vue"),
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
    ],
  },
];

export default adminRoutes;
