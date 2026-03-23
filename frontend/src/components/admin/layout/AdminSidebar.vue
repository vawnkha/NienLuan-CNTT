<template>
  <aside class="admin-sidebar p-3 border-end" style="width: 260px">
    <h3>Admin</h3>

    <ul class="list-unstyled">
      <li><router-link to="/admin">Dashboard</router-link></li>
      <li><router-link to="/admin/products">Sản phẩm</router-link></li>
      <li><router-link to="/admin/categories">Danh mục</router-link></li>
      <li><router-link to="/admin/orders">Đơn hàng</router-link></li>
      <li><router-link to="/admin/users">Người dùng</router-link></li>
    </ul>
  </aside>
</template>
