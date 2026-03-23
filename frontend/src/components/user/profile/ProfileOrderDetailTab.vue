<script setup>
defineProps({
  order: {
    type: Object,
    required: true,
  },
});

defineEmits(["back-to-orders", "cancel-order"]);

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
    <div class="order-detail-header">
      <h3 class="profile-section-title">Chi tiết đơn hàng #{{ order.id }}</h3>
      <button class="btn btn-back-order" @click="$emit('back-to-orders')">
        Quay lại
      </button>
    </div>

    <div class="order-detail-meta">
      <p><strong>Ngày đặt:</strong> {{ order.orderDate }}</p>
      <p>
        <strong>Trạng Thái:</strong>
        <span class="status-badge" :class="getStatusClass(order.status)">
          {{ order.status }}
        </span>
      </p>
      <p>
        <strong>Phương thức thanh toán:</strong>
        <span
          class="payment-badge"
          :class="
            order.paymentMethod === 'paypal' ? 'payment-paypal' : 'payment-cod'
          "
        >
          {{
            order.paymentMethod === "paypal"
              ? "Thanh toán bằng Paypal"
              : "Thanh toán khi nhận hàng"
          }}
        </span>
      </p>
      <p>
        <strong>Tổng tiền:</strong>
        {{ Number(order.total).toLocaleString("vi-VN") }} đ
      </p>
    </div>

    <div class="order-detail-products">
      <h4 class="order-detail-subtitle">Sản phẩm trong đơn hàng</h4>

      <div class="table-responsive">
        <table class="table profile-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!order.items?.length">
              <td colspan="5" class="text-center">Không có sản phẩm</td>
            </tr>

            <tr v-for="item in order.items" :key="item.id">
              <td>
                <img
                  :src="item.thumbnail"
                  :alt="item.name"
                  width="60"
                  height="60"
                  style="object-fit: cover"
                />
              </td>
              <td>{{ item.name }}</td>
              <td>{{ Number(item.price).toLocaleString("vi-VN") }} đ</td>
              <td>{{ item.quantity }}</td>
              <td>
                {{ Number(item.price * item.quantity).toLocaleString("vi-VN") }}
                đ
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="order-detail-shipping">
      <h4 class="order-detail-subtitle">Thông tin giao hàng</h4>
      <p><strong>Người nhận:</strong> {{ order.shipping?.fullName || "" }}</p>
      <p><strong>Địa chỉ:</strong> {{ order.shipping?.address || "" }}</p>
      <p><strong>Thành phố:</strong> {{ order.shipping?.city || "" }}</p>
      <p><strong>Số điện thoại:</strong> {{ order.shipping?.phone || "" }}</p>
    </div>

    <div class="order-detail-actions">
      <button
        v-if="order.rawStatus === 'pending'"
        class="btn btn-cancel-order"
        @click="$emit('cancel-order', order.id)"
      >
        Hủy đơn hàng
      </button>
    </div>
  </div>
</template>
