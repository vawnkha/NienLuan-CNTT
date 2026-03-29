<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/user/auth";

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const errorMessage = ref("");

const form = reactive({
  email: "",
  password: "",
});

async function handleLogin() {
  errorMessage.value = "";
  loading.value = true;
  try {
    const res = await authStore.login(form);
    if (res.role !== "admin") {
      authStore.logout();
      errorMessage.value = "Tài khoản không có quyền admin";
      return;
    }
    router.push({ name: "admin-dashboard" });
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || "Đăng nhập thất bại";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    "
  >
    <form
      @submit.prevent="handleLogin"
      style="width: 350px; text-align: center"
    >
      <h2
        style="
          font-size: 26px;
          color: #7a8ca1;
          font-weight: 500;
          margin-bottom: 28px;
        "
      >
        Đăng nhập
      </h2>

      <input
        v-model="form.email"
        type="email"
        class="form-control mb-3"
        placeholder="Email"
      />

      <input
        v-model="form.password"
        type="password"
        class="form-control mb-3"
        placeholder="Mật khẩu"
      />

      <button class="btn btn-link text-decoration-none" :disabled="loading">
        {{ loading ? "Đang đăng nhập" : "Đăng nhập" }}
      </button>

      <div v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</div>

      <hr class="my-4" />
      <div style="font-size: 20px; color: #7b8ea6; font-weight: 600">
        FRESH MART!
      </div>
      <div class="text-muted mt-3" style="font-size: 13px">
        ©2026 All Rights Reserved. Privacy and Terms
      </div>
    </form>
  </div>
</template>
