<script setup>
defineProps({
  passwordForm: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["change-password"]);
</script>
<template>
  <div class="profile-content-box">
    <div class="password-form-wrap">
      <div class="form-group">
        <label>Mật khẩu hiện tại:</label>
        <input
          type="password"
          :value="passwordForm.currentPassword"
          @input="passwordForm.currentPassword = $event.target.value"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label>Mật khẩu mới:</label>
        <input
          :value="passwordForm.newPassword"
          @input="passwordForm.newPassword = $event.target.value"
          type="password"
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label>Nhập lại mật khẩu mới:</label>
        <input
          :value="passwordForm.confirmPassword"
          @input="passwordForm.confirmPassword = $event.target.value"
          type="password"
          class="form-control"
        />
      </div>
    </div>
    <button class="btn btn-change-password" @click="$emit('change-password')">
      ĐỔI MẬT KHẨU
    </button>
  </div>
</template>
