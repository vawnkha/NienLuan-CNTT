<script setup>
import AdminSidebar from "@/components/admin/layout/AdminSidebar.vue";
import AdminTopbar from "@/components/admin/layout/AdminTopbar.vue";
</script>

<template>
  <div class="admin-layout d-flex">
    <AdminSidebar />
    <div class="admin-main flex-grow-1">
      <AdminTopbar />
      <main class="p-3">
        <router-view />
      </main>
    </div>
  </div>
</template>
