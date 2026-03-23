<script setup>
import { ref } from "vue";
import authService from "@/services/auth.service";

const email = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

async function handleForgotPassword() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!email.value.trim()) {
    errorMessage.value = "Vui lòng nhập email";
    return;
  }

  try {
    loading.value = true;

    const res = await authService.forgotPassword(email.value);

    successMessage.value =
      res.message || "vui lòng kiểm tra email để đặt lại mật khẩu.";
  } catch (error) {
    error?.response?.data?.message || "Gửi yêu cầu thất bại";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div id="content" class="site-content">
    <div id="breadcrumb">
      <div class="container">
        <h2 class="title">Quên Mật Khẩu</h2>

        <ul class="breadcrumb">
          <li><router-link to="/">Trang Chủ</router-link></li>
          <li><span>Quên Mật Khẩu</span></li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div class="login-page">
        <div class="login-form form">
          <div class="block-title">
            <h2 class="title"><span>Quên Mật Khẩu</span></h2>
          </div>

          <form @submit.prevent="handleForgotPassword">
            <div class="form-group">
              <label>Email</label>
              <input v-model="email" type="email" name="email" />
            </div>

            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="alert alert-success">
              {{ successMessage }}
            </div>

            <div class="form-group text-center">
              <input
                type="submit"
                class="btn btn-primary"
                :value="
                  loading ? 'Đang gửi...' : 'Gửi Liên Kết Đặt Lại Mật Khẩu'
                "
                :disabled="loading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
