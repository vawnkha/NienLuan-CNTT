<script setup>
import { useAuthStore } from "@/stores/user/auth";

const authStore = useAuthStore();
</script>

<template>
  <header class="admin-topbar">
    <div class="admin-topbar__left">
      <!-- <button class="admin-topbar__toggle">
        <i class="fa-solid fa-bars"></i>
      </button> -->
    </div>

    <div class="admin-topbar__right">
      <div>
        <i class="fa-regular fa-message"></i>
        <span class="admin-topbar__badge ms-1">17</span>
      </div>

      <div>
        <i class="fa-regular fa-bell"></i>
        <span class="admin-topbar__badge ms-1">18</span>
      </div>

      <div class="d-flex align-items-center gap-2">
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
        <i class="fa-solid fa-caret-down" style="color: #667a93"></i>
      </div>
    </div>
  </header>
</template>
