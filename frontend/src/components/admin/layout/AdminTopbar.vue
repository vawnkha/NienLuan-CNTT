<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/user/auth";
import { useAdminNotificationStore } from "@/stores/admin/notification";

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useAdminNotificationStore();

const notificationCount = computed(() => notificationStore.unreadCount);
const contactCount = computed(
  () =>
    notificationStore.items.filter(
      (item) => item.type === "contact" && !item.is_read,
    ).length,
);
</script>

<template>
  <header class="admin-topbar">
    <div class="admin-topbar__left"></div>

    <div class="admin-topbar__right">
      <div
        class="admin-topbar__icon-box"
        @click="router.push('/admin/contacts')"
      >
        <i class="fa-regular fa-message"></i>
        <span v-if="contactCount" class="admin-topbar__badge ms-1">
          {{ contactCount }}
        </span>
      </div>

      <div
        class="admin-topbar__icon-box"
        @click="router.push('/admin/notifications')"
      >
        <i class="fa-regular fa-bell"></i>
        <span v-if="notificationCount" class="admin-topbar__badge ms-1">
          {{ notificationCount }}
        </span>
      </div>

      <!-- <div class="d-flex align-items-center gap-2">
        <img
          :src="
            authStore.user?.avatar ||
            authStore.user?.avatar_url ||
            'https://via.placeholder.com/40'
          "
          style="
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
          "
        />
        <span style="color: #667a93; font-weight: 600">Admin</span>
      </div> -->
    </div>
  </header>
</template>

<style scoped>
.admin-topbar__icon-box {
  position: relative;
  cursor: pointer;
}
</style>
