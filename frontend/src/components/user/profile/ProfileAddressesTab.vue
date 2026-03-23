<script setup>
defineProps({
  addresses: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  "open-address-modal",
  "remove-address",
  "set-default-address",
]);
</script>
<template>
  <div class="profile-content-box">
    <div class="address-note">
      Các địa chỉ sau sẽ được sử dụng trên trang thanh toán theo mặc định.
    </div>

    <div class="table-responsive">
      <table class="table profile-table address-table">
        <thead>
          <tr>
            <th>Tên người nhận</th>
            <th>Địa chỉ</th>
            <th>Thành phố</th>
            <th>Số điện thoại</th>
            <th>Mặc định</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in addresses" :key="item.id">
            {{
              console.log(item)
            }}
            <td>{{ item.full_name }}</td>
            <td>{{ item.address }}</td>
            <td>{{ item.city }}</td>
            <td>{{ item.phone }}</td>
            <td>
              <span v-if="item.isDefault" class="default-badge">Mặc định</span>
              <button
                v-else
                class="btn btn-set-default"
                @click="$emit('set-default-address', item.id)"
              >
                Chọn
              </button>
            </td>
            <td>
              <button
                class="btn btn-delete-address"
                @click="$emit('remove-address', item.id)"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button class="btn btn-add-address" @click="$emit('open-address-modal')">
      Thêm địa chỉ mới
    </button>
  </div>
</template>
