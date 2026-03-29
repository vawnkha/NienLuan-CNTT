<script setup>
import { ref } from "vue";

const notifications = ref([
  {
    id: 1,
    title: "Có đơn hàng mới",
    content: "Có đơn đặt hàng mới từ dien.nguyen.novasquare@gmail.com",
    time: "01:49 PM 18-08-2025",
  },
  {
    id: 2,
    title: "Có liên hệ mới",
    content: "Có đơn liên hệ từ minhdien246@gmail.com",
    time: "11:04 AM 18-08-2025",
  },
  {
    id: 3,
    title: "Có liên hệ mới",
    content: "Có đơn liên hệ từ minhdien@example.com",
    time: "11:03 AM 18-08-2025",
  },
]);
</script>

<template>
  <div>
    <div class="admin-page-title">Thông báo</div>

    <section class="admin-panel">
      <div class="admin-panel__header">
        Tại đây, bạn có thể xem và quản lý các thông báo liên lạc hoặc đơn hàng
        từ khách hàng
      </div>

      <div class="admin-panel__body">
        <div
          v-for="item in notifications"
          :key="item.id"
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 8px;
            border-bottom: 1px solid #e6ebf1;
          "
        >
          <div class="d-flex align-items-center gap-3">
            <div style="font-size: 30px">🔔</div>
            <div>
              <div style="font-size: 22px; font-weight: 700; color: #6e83a0">
                {{ item.title }}
              </div>
              <div style="color: #8192a7">{{ item.content }}</div>
            </div>
          </div>

          <div style="color: #8d9db0">{{ item.time }}</div>
        </div>
      </div>
    </section>
  </div>
</template>
