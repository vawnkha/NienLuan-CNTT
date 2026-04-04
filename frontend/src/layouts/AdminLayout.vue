<script setup>
import "@/assets/css/admin/admin.css";

import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import AdminSidebar from "@/components/admin/layout/AdminSidebar.vue";
import AdminTopbar from "@/components/admin/layout/AdminTopbar.vue";
import AdminToastContainer from "@/components/common/AdminToastContainer.vue";
import { useAdminNotificationStore } from "@/stores/admin/notification";

const route = useRoute();
const isLoginPage = computed(() => route.name === "admin-login");

const notificationStore = useAdminNotificationStore();

onMounted(async () => {
  if (!isLoginPage.value) {
    await notificationStore.loadInitialData();
  }
});
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
          <AdminToastContainer />
          <main class="admin-page">
            <router-view />
          </main>
        </div>
      </div>
    </template>
  </div>
</template>
