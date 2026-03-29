<script setup>
import { onMounted, ref } from "vue";
import userService from "@/services/user.service";

const users = ref([]);

function resolveType(role) {
  if (role === "admin") return "ADMIN";
  return "CUSTOMER";
}

async function fetchUsers() {
  const res = await userService.getAll();
  users.value = res?.data || res || [];
}

// async function promoteStaff(user) {
//   await userService.updateUser(user._id, { ...user, role: "staff" });
//   await fetchUsers();
// }

async function blockUser(user) {
  await userService.updateUser(user._id, { ...user, status: "blocked" });
  await fetchUsers();
}

async function restoreUser(user) {
  await userService.updateUser(user._id, { ...user, status: "active" });
  await fetchUsers();
}

async function removeUser(user) {
  if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
  await userService.deleteUser(user._id);
  await fetchUsers();
}

onMounted(fetchUsers);
</script>

<template>
  <div>
    <div class="admin-page-title">Quản lý người dùng</div>

    <div class="admin-user-grid">
      <div v-for="item in users" :key="item._id" class="admin-user-card">
        <div class="admin-user-card__type">{{ resolveType(item.role) }}</div>

        <div class="admin-user-card__body">
          <div>
            <div style="font-size: 18px; font-weight: 600; color: #637892">
              {{ item.name }}
            </div>
            <div style="margin-top: 10px; color: #6f839b">
              <strong>Email:</strong> {{ item.email }}
            </div>
            <div style="color: #6f839b">
              <strong>Address:</strong> {{ item.address || item.city || "" }}
            </div>
            <div style="color: #6f839b">
              <strong>Phone:</strong> {{ item.phone || "" }}
            </div>
          </div>

          <img
            :src="item.avatar_url || item.avatar || '/img/avatar.jpg'"
            class="admin-user-card__image"
          />
        </div>

        <div class="admin-user-card__actions">
          <!-- <button
            class="admin-btn admin-btn--primary"
            @click="promoteStaff(item)"
          >
            <i class="fa-solid fa-user me-1"></i>Nhân viên
          </button> -->

          <button class="admin-btn admin-btn--warning" @click="blockUser(item)">
            <i class="fa-solid fa-check me-1"></i>Chặn
          </button>

          <button
            v-if="item.status === 'blocked'"
            class="admin-btn admin-btn--success"
            @click="restoreUser(item)"
          >
            <i class="fa-solid fa-check me-1"></i>Khôi phục
          </button>

          <button
            v-else
            class="admin-btn admin-btn--danger"
            @click="removeUser(item)"
          >
            <i class="fa-solid fa-check me-1"></i>Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
