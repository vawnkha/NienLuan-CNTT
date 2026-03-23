<script setup>
import { ref } from "vue";

const props = defineProps({
  userProfile: {
    type: Object,
    required: true,
  },
  accountForm: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update-account", "update-avatar"]);
const fileInput = ref(null);

function triggerchooseAvatar() {
  fileInput.value?.click();
}
function handleAvatarChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chọn file ảnh hợp lệ");
    return;
  }

  emit("update-avatar", file);
}
</script>
<template>
  <div class="profile-content-box">
    <div class="account-avatar-wrap">
      <img :src="userProfile.avatar" alt="Avatar" class="account-avatar" />

      <div style="margin-top: 15px">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleAvatarChange"
        />
        <button
          type="button"
          class="btn btn-change-avatar"
          @click="triggerchooseAvatar"
        >
          ĐỔI ẢNH ĐẠI DIỆN
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <label>Họ và Tên</label>
        <input
          type="text"
          :value="accountForm.name"
          @input="accountForm.name = $event.target.value"
          class="form-control"
        />
      </div>

      <div class="col-md-6">
        <label>Số điện thoại</label>
        <input
          type="text"
          :value="accountForm.phone"
          @input="accountForm.phone = $event.target.value"
          class="form-control"
        />
      </div>
    </div>
    <div class="row" style="margin-top: 25px">
      <div class="col-md-6">
        <label>Email (không được thay đổi)</label>
        <input
          type="email"
          :value="accountForm.email"
          class="form-control"
          disabled
        />
      </div>
      <div class="col-md-6">
        <label>Địa chỉ</label>
        <input
          type="text"
          :value="accountForm.address"
          @input="accountForm.address = $event.target.value"
          class="form-control"
        />
      </div>
    </div>
    <div style="margin-top: 35px">
      <button class="btn btn-update-account" @click="$emit('update-account')">
        CẬP NHẬT
      </button>
    </div>
  </div>
</template>
