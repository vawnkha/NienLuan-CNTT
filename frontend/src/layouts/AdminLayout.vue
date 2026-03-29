<script setup>
import "@/assets/css/admin/admin.css";

import { computed } from "vue";
import { useRoute } from "vue-router";
import AdminSidebar from "@/components/admin/layout/AdminSidebar.vue";
import AdminTopbar from "@/components/admin/layout/AdminTopbar.vue";

const route = useRoute();
const isLoginPage = computed(() => route.name === "admin-login");
</script>

<template>
  <div class="admin-layout">
    <template v-if="isLoginPage">
      <router-view />
    </template>

    <template v-else>
      <div class="admin-shell">
        <AdminSidebar />
        <div class="admin-content">
          <AdminTopbar />
          <main class="admin-page">
            <router-view />
          </main>
        </div>
      </div>
    </template>
  </div>
</template>
