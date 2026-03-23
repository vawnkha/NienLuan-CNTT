<script setup>
defineProps({
  orders: {
    type: Array,
    required: true,
  },
});

defineEmits(["view-order-detail"]);

function getStatusClass(status) {
  switch ((status || "").toLowerCase()) {
    case "chờ xác nhận":
      return "status-pending";
    case "đã xác nhận":
    case "đang xử lý":
      return "status-processing";
    case "đang giao":
      return "status-shipping";
    case "đã giao":
    case "hoàn thành":
      return "status-success";
    case "đã hủy":
      return "status-cancelled";
    default:
      return "status-pending";
  }
}
</script>

<template>
  <div class="profile-content-box">
    <div class="table-responsive">
      <table class="table profile-table">
        <thead>
          <tr>
            <th>Đơn hàng</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!orders.length">
            <td colspan="5" class="text-center">Chưa có đơn hàng nào</td>
          </tr>

          <tr v-for="order in orders" :key="order.id || order._id">
            <td>#{{ order.id || order._id }}</td>
            <td>{{ order.orderDate }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </td>
            <td>
              {{ Number(order.total).toLocaleString("vi-VN") }}
              đ
            </td>
            <td>
              <button
                class="btn btn-view-order"
                @click="$emit('view-order-detail', order)"
              >
                Xem chi tiết
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
