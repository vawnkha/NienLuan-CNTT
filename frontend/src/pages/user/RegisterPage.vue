<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import userService from "@/services/user.service";

const router = useRouter();

const registerForm = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

async function handleRegister() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!registerForm.name || !registerForm.email || !registerForm.password) {
    errorMessage.value = "Vui lòng nhập đầy đủ thông tin";
    return;
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    errorMessage.value = "Mật khẩu xác nhận không khớp";
    return;
  }
  try {
    loading.value = true;

    const res = await userService.register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
    });

    successMessage.value =
      res.message ||
      "Đăng ký thành công. vui lòng kiểm tra email để kích hoạt.";
    setTimeout(() => {
      router.push("/login");
    }, 5000);
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || "Đăng ký thất bại";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div id="content" class="site-content">
    <div id="breadcrumb">
      <div class="container">
        <h2 class="title">Đăng Ký</h2>

        <ul class="breadcrumb">
          <li><router-link to="/">Trang Chủ</router-link></li>
          <li><span>Đăng Ký</span></li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div class="register-page">
        <div class="register-form form">
          <div class="block-title">
            <h2 class="title"><span>Tạo Tài Khoản</span></h2>
          </div>

          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label>Tên</label>
              <input v-model="registerForm.name" type="text" name="name" />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input v-model="registerForm.email" type="email" name="email" />
            </div>

            <div class="form-group">
              <label>Mật Khẩu</label>
              <input
                v-model="registerForm.password"
                type="password"
                name="password"
              />
            </div>

            <div class="form-group">
              <label>Xác Nhận Mật Khẩu</label>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                name="confirmPassword"
              />
            </div>

            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="alert alert-success">
              {{ successMessage }}
            </div>

            <div class="form-group text-center">
              <div class="link">
                <span>Đã có tài khoản? </span>
                <router-link to="/login">Đăng Nhập</router-link>
              </div>
            </div>

            <div class="form-group text-center">
              <input
                type="submit"
                class="btn btn-primary"
                :value="loading ? 'Đang xử lý...' : 'Đăng ký'"
                :disabled="loading"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
