<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ProfileSidebar from "@/components/user/profile/ProfileSidebar.vue";
import ProfileOrdersTab from "@/components/user/profile/ProfileOrdersTab.vue";
import ProfileAddressesTab from "@/components/user/profile/ProfileAddressesTab.vue";
import ProfileAccountTab from "@/components/user/profile/ProfileAccountTab.vue";
import ProfilePasswordTab from "@/components/user/profile/ProfilePasswordTab.vue";
import ProfileOrderDetailTab from "@/components/user/profile/ProfileOrderDetailTab.vue";
import { useAuthStore } from "@/stores/user/auth";
import userService from "@/services/user.service";
import authService from "@/services/auth.service";
import ordersService from "@/services/orders.service";
import addressService from "@/services/address.service";

const router = useRouter();
const authStore = useAuthStore();

const userId = computed(() => authStore.userId);
const loadingProfile = ref(false);
const loadingOrders = ref(false);
const loadingAddresses = ref(false);
const activeTab = ref("dashboard");
const selectedOrder = ref(null);
const isAddressModalOpen = ref(false);

const menuItems = [
  { key: "dashboard", label: "Bảng điều khiển", icon: "fa fa-home" },
  { key: "orders", label: "Đơn hàng", icon: "fa fa-file-text" },
  { key: "addresses", label: "Địa chỉ", icon: "fa fa-map-marker" },
  { key: "account", label: "Chi tiết tài khoản", icon: "fa fa-user" },
  { key: "password", label: "Đổi mật khẩu", icon: "fa fa-key" },
];

const userProfile = reactive({
  name: "",
  phone: "",
  email: "",
  address: "",
  avatar: "",
});

const accountForm = reactive({
  name: "",
  phone: "",
  email: "",
  address: "",
});

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const orders = ref([]);
const addresses = ref([]);

const newAddressForm = reactive({
  full_name: "",
  address: "",
  city: "",
  phone: "",
  isDefault: false,
});

function formatDate(dateValue) {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return dateValue;
  return d.toLocaleDateString("vi-VN");
}

function getImageUrl(path) {
  if (!path) return "/img/avatar.jpg";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads")) return path;
  return path;
}

function normalizeOrder(raw) {
  const shipping = raw.shipping_address || {};

  const items = Array.isArray(raw.items)
    ? raw.items.map((item, index) => ({
        id: item.product_id || item._id || item.id || index,
        name: item.name || "Sản phẩm",
        thumbnail: getImageUrl(item.thumbnail || "/img/product/1.jpg"),
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        subtotal: Number(
          item.subtotal || Number(item.price || 0) * Number(item.quantity || 1),
        ),
      }))
    : [];

  const paymentMethod =
    raw.payment_method === "cash" ? "cod" : raw.payment_method || "cod";

  return {
    id: raw._id || raw.id,
    _id: raw._id || raw.id,
    orderDate: formatDate(raw.created_at || raw.orderDate),
    status: raw.status_text || raw.status || "Chờ xác nhận",
    rawStatus: raw.status || "",
    paymentMethod,
    total: Number(raw.total_price || raw.total || 0),
    items,
    shipping: {
      fullName: shipping.fullName || shipping.full_name || shipping.name || "",
      address:
        shipping.address || shipping.address_line || shipping.street || "",
      city: shipping.city || shipping.province || "",
      phone: shipping.phone || shipping.phoneNumber || "",
    },
    timeline: Array.isArray(raw.timeline) ? raw.timeline : [],
  };
}

function normalizeAddress(raw) {
  return {
    id: raw._id || raw.id,
    full_name: raw.full_name || raw.full_name || raw.name || "",
    address: raw.address_line || raw.street || "",
    city: raw.city || raw.province || "",
    phone: raw.phone || raw.phoneNumber || "",
    isDefault: !!(raw.isDefault || raw.is_default),
  };
}

async function fetchUserProfile() {
  if (!userId.value) {
    alert("Bạn chưa đăng nhập");
    router.push("/login");
    return;
  }

  try {
    loadingProfile.value = true;
    const user = await userService.getUserById(userId.value);

    userProfile.name = user.name || "";
    userProfile.phone = user.phone || "";
    userProfile.email = user.email || "";
    userProfile.address = user.address || "";
    userProfile.avatar = getImageUrl(
      user.avatar_url || user.avatar || "/img/avatar.jpg",
    );

    accountForm.name = user.name || "";
    accountForm.phone = user.phone || "";
    accountForm.email = user.email || "";
    accountForm.address = user.address || "";
  } catch (error) {
    alert(
      error?.response?.data?.message || "Không tải được thông tin tài khoản",
    );
  } finally {
    loadingProfile.value = false;
  }
}

async function fetchOrders() {
  if (!userId.value) return;

  try {
    loadingOrders.value = true;
    const rawOrders = await ordersService.getByUser(userId.value);
    orders.value = rawOrders.map(normalizeOrder);
  } catch (error) {
    console.error("fetchOrders error:", error);
    alert(
      error?.response?.data?.message || "Không tải được danh sách đơn hàng",
    );
    orders.value = [];
  } finally {
    loadingOrders.value = false;
  }
}

async function fetchAddresses() {
  if (!userId.value) return;

  try {
    loadingAddresses.value = true;
    const res = await addressService.getByUser(userId.value);

    const rawAddresses = Array.isArray(res)
      ? res
      : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.addresses)
          ? res.addresses
          : [];

    addresses.value = rawAddresses.map(normalizeAddress);
  } catch (error) {
    console.error("fetchAddresses error:", error);
    alert(error?.response?.data?.message || "Không tải được danh sách địa chỉ");
    addresses.value = [];
  } finally {
    loadingAddresses.value = false;
  }
}

async function updateAvatar(file) {
  try {
    const res = await userService.updateAvatar(userId.value, file);

    if (res.avatar_url) {
      userProfile.avatar = getImageUrl(res.avatar_url);
    } else {
      await fetchUserProfile();
    }

    alert(res.message || "Cập nhật ảnh đại diện thành công");
  } catch (error) {
    alert(error?.response?.data?.message || "Cập nhật ảnh đại diện thất bại");
  }
}

async function updateAccount() {
  if (
    !accountForm.name.trim() ||
    !accountForm.phone.trim() ||
    !accountForm.address.trim()
  ) {
    alert("Vui lòng nhập đầy đủ thông tin tài khoản");
    return;
  }

  try {
    const res = await userService.updateUser(userId.value, {
      name: accountForm.name,
      phone: accountForm.phone,
      address: accountForm.address,
    });

    userProfile.name = accountForm.name;
    userProfile.phone = accountForm.phone;
    userProfile.address = accountForm.address;

    alert(res.message || "Cập nhật thông tin thành công");
  } catch (error) {
    alert(error?.response?.data?.message || "Cập nhật thông tin thất bại");
  }
}

async function changePassword() {
  if (
    !passwordForm.currentPassword.trim() ||
    !passwordForm.newPassword.trim() ||
    !passwordForm.confirmPassword.trim()
  ) {
    alert("Vui lòng nhập đầy đủ thông tin đổi mật khẩu");
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert("Mật khẩu mới không khớp");
    return;
  }

  try {
    const res = await authService.changePassword({
      userId: userId.value,
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";

    alert(res.message || "Đổi mật khẩu thành công");
  } catch (error) {
    alert(error?.response?.data?.message || "Đổi mật khẩu thất bại");
  }
}

function viewOrderDetail(order) {
  selectedOrder.value = order;
}

async function backToOrders() {
  selectedOrder.value = null;
  await fetchOrders();
}

function openTab(tabKey) {
  activeTab.value = tabKey;
  if (tabKey !== "orders") {
    selectedOrder.value = null;
  }
}

function openAddressModal() {
  newAddressForm.full_name = "";
  newAddressForm.address_line = "";
  newAddressForm.city = "";
  newAddressForm.phone = "";
  newAddressForm.isDefault = false;
  isAddressModalOpen.value = true;
}

function closeAddressModal() {
  isAddressModalOpen.value = false;
}

async function saveNewAddress() {
  if (
    !newAddressForm.full_name.trim() ||
    !newAddressForm.address.trim() ||
    !newAddressForm.city.trim() ||
    !newAddressForm.phone.trim()
  ) {
    alert("Vui lòng nhập đầy đủ thông tin địa chỉ");
    return;
  }

  try {
    await addressService.create({
      user_id: userId.value,
      full_name: newAddressForm.full_name,
      address_line: newAddressForm.address,
      city: newAddressForm.city,
      phone: newAddressForm.phone,
      is_default: newAddressForm.isDefault,
    });

    isAddressModalOpen.value = false;
    await fetchAddresses();
    alert("Đã thêm địa chỉ mới");
  } catch (error) {
    alert(error?.response?.data?.message || "Thêm địa chỉ thất bại");
  }
}

async function removeAddress(id) {
  try {
    await addressService.delete(id);
    await fetchAddresses();
    alert("Đã xóa địa chỉ");
  } catch (error) {
    alert(error?.response?.data?.message || "Xóa địa chỉ thất bại");
  }
}

async function setDefaultAddress(id) {
  try {
    await addressService.update(id, { is_default: true });
    await fetchAddresses();
    alert("Đã cập nhật địa chỉ mặc định");
  } catch (error) {
    alert(
      error?.response?.data?.message || "Cập nhật địa chỉ mặc định thất bại",
    );
  }
}

async function cancelOrder(orderId) {
  try {
    const updated = await ordersService.cancel(orderId);
    const normalized = normalizeOrder(updated);

    const index = orders.value.findIndex(
      (item) => item.id === orderId || item._id === orderId,
    );

    if (index !== -1) {
      orders.value[index] = normalized;
    }

    if (
      selectedOrder.value &&
      (selectedOrder.value.id === orderId ||
        selectedOrder.value._id === orderId)
    ) {
      selectedOrder.value = normalized;
    }

    alert("Hủy đơn hàng thành công");
  } catch (error) {
    alert(error?.response?.data?.message || "Hủy đơn hàng thất bại");
  }
}

onMounted(async () => {
  await Promise.all([fetchUserProfile(), fetchOrders(), fetchAddresses()]);
});
</script>

<template>
  <div id="content" class="site-content">
    <div id="breadcrumb">
      <div class="container">
        <h2 class="title">Tài khoản của tôi</h2>

        <ul class="breadcrumb">
          <li><router-link to="/">Trang Chủ</router-link></li>
          <li><span>Tài khoản của tôi</span></li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div class="user-profile-page">
        <div class="row">
          <div
            v-if="!(activeTab === 'orders' && selectedOrder)"
            class="col-md-3 col-sm-4 col-xs-12"
          >
            <ProfileSidebar
              :menu-items="menuItems"
              :active-tab="activeTab"
              @change-tab="openTab"
            />
          </div>

          <div
            :class="
              activeTab === 'orders' && selectedOrder
                ? 'col-md-12 col-sm-12 col-xs-12'
                : 'col-md-9 col-sm-8 col-xs-12'
            "
          >
            <div v-if="activeTab === 'dashboard'" class="profile-content-box">
              <h3 class="profile-section-title">Bảng điều khiển</h3>
              <p>
                Xin chào <strong>{{ userProfile.name }}</strong
                >.
              </p>
              <p>
                Từ trang tài khoản, bạn có thể xem đơn hàng gần đây, quản lý địa
                chỉ giao hàng, và cập nhật thông tin tài khoản hoặc mật khẩu.
              </p>
            </div>

            <ProfileOrdersTab
              v-else-if="activeTab === 'orders' && !selectedOrder"
              :orders="orders"
              @view-order-detail="viewOrderDetail"
            />

            <ProfileOrderDetailTab
              v-else-if="activeTab === 'orders' && selectedOrder"
              :order="selectedOrder"
              @back-to-orders="backToOrders"
              @cancel-order="cancelOrder"
            />

            <ProfileAddressesTab
              v-else-if="activeTab === 'addresses'"
              :addresses="addresses"
              @open-address-modal="openAddressModal"
              @remove-address="removeAddress"
              @set-default-address="setDefaultAddress"
            />

            <ProfileAccountTab
              v-else-if="activeTab === 'account'"
              :user-profile="userProfile"
              :account-form="accountForm"
              @update-account="updateAccount"
              @update-avatar="updateAvatar"
            />

            <ProfilePasswordTab
              v-else-if="activeTab === 'password'"
              :password-form="passwordForm"
              @change-password="changePassword"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isAddressModalOpen"
      class="address-modal-overlay"
      @click="closeAddressModal"
    >
      <div class="address-modal" @click.stop>
        <div class="address-modal-header">
          <h3>Thêm địa chỉ mới</h3>
          <button class="address-modal-close" @click="closeAddressModal">
            ×
          </button>
        </div>

        <div class="address-modal-body">
          <div class="form-group">
            <label>Tên người dùng</label>
            <input
              v-model="newAddressForm.full_name"
              type="text"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Địa chỉ</label>
            <input
              v-model="newAddressForm.address"
              type="text"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Thành phố</label>
            <input
              v-model="newAddressForm.city"
              type="text"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Số điện thoại</label>
            <input
              v-model="newAddressForm.phone"
              type="text"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label class="address-default-check">
              <input v-model="newAddressForm.isDefault" type="checkbox" />
              Đặt làm địa chỉ mặc định
            </label>
          </div>
        </div>

        <div class="address-modal-footer">
          <button class="btn btn-address-save" @click="saveNewAddress">
            Lưu địa chỉ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.user-profile-page {
  padding: 20px 0 50px;
}

.profile-sidebar {
  border: 1px solid #e5e5e5;
  background: #fff;
}

.profile-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #222;
}

.profile-menu-item:last-child {
  border-bottom: none;
}

.profile-menu-item.active {
  background: #001f28;
  color: #fff;
}

.profile-content-box {
  min-height: 420px;
}

.profile-section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 25px;
}

.profile-table {
  width: 100%;
  background: #fff;
}

.profile-table thead th {
  font-size: 16px;
  font-weight: 700;
  border-bottom: 2px solid #bfbfbf;
  padding: 14px 12px;
}

.profile-table tbody td {
  padding: 14px 12px;
  vertical-align: middle;
  border-top: 1px solid #e5e5e5;
}

.address-note {
  background: #f8f6ed;
  padding: 18px 20px;
  margin-bottom: 22px;
  color: #555;
}

.default-badge {
  display: inline-block;
  background: #1f8c5a;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 2px;
}

.btn-set-default {
  background: #2bb3df;
  color: #fff;
  border: none;
  padding: 8px 14px;
}

.btn-delete-address {
  background: #ef4a43;
  color: #fff;
  border: none;
  padding: 10px 24px;
}

.btn-add-address {
  margin-top: 20px;
  background: #8db600;
  color: #fff;
  border: none;
  padding: 14px 28px;
  font-weight: 700;
}

.btn-view-order {
  background: #2bb3df;
  color: #111;
  border: none;
  padding: 12px 26px;
  font-weight: 700;
}

.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 3px;
  font-size: 13px;
  font-weight: 700;
}

.status-pending {
  background: #ffc423;
  color: #fff;
}

.account-avatar-wrap {
  text-align: center;
  margin-bottom: 25px;
}

.account-avatar {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #e5e5e5;
}

.profile-content-box label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.profile-content-box .form-control {
  height: 50px;
  border-radius: 0;
  border: 1px solid #ddd;
  box-shadow: none;
}

.btn-update-account,
.btn-change-password {
  background: #8db600;
  color: #fff;
  border: none;
  padding: 14px 34px;
  font-weight: 700;
  min-width: 190px;
}

.password-form-wrap {
  border: 1px solid #e5e5e5;
  padding: 28px;
  margin-bottom: 25px;
}

.password-form-wrap .form-group {
  margin-bottom: 24px;
}

.address-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.address-modal {
  width: 100%;
  max-width: 560px;
  background: #fff;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
}

.address-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #e5e5e5;
}

.address-modal-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #222;
}

.address-modal-close {
  border: none;
  background: transparent;
  font-size: 34px;
  line-height: 1;
  color: #777;
  cursor: pointer;
}

.address-modal-body {
  padding: 24px 36px 10px;
}

.address-modal-body .form-group {
  margin-bottom: 24px;
}

.address-modal-body label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #444;
}

.address-modal-body .form-control {
  height: 50px;
  border-radius: 0;
  box-shadow: none;
  border: 1px solid #ddd;
}

.address-default-check {
  display: flex !important;
  align-items: center;
  gap: 10px;
  font-weight: 500 !important;
  margin-bottom: 0 !important;
}

.address-default-check input {
  margin: 0;
}

.address-modal-footer {
  padding: 0 36px 30px;
}

.btn-address-save {
  background: #8db600;
  color: #fff;
  border: none;
  min-width: 170px;
  height: 46px;
  font-weight: 700;
}

@media (max-width: 767px) {
  .profile-content-box {
    margin-top: 25px;
  }

  .profile-table {
    min-width: 780px;
  }

  .address-modal {
    max-width: 100%;
  }

  .address-modal-body {
    padding: 20px 20px 10px;
  }

  .address-modal-footer {
    padding: 0 20px 24px;
  }
}

.btn-change-avatar {
  background: #8db600;
  color: #fff;
  border: none;
  padding: 10px 22px;
  font-weight: 700;
}

.btn-change-avatar:hover {
  color: #fff;
  opacity: 0.95;
}

.order-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.order-detail-meta p,
.order-detail-shipping p {
  font-size: 16px;
  margin-bottom: 18px;
}

.order-detail-subtitle {
  font-size: 22px;
  font-weight: 700;
  margin: 30px 0 16px;
}

.payment-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 3px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.payment-paypal {
  background: #1f78ff;
}

.payment-cod {
  background: #666;
}

.btn-back-order {
  background: #f5f5f5;
  border: 1px solid #ddd;
  color: #222;
  padding: 10px 18px;
  font-weight: 600;
}

.btn-cancel-order {
  background: #ef4a43;
  color: #fff;
  border: none;
  padding: 14px 28px;
  font-weight: 700;
}

.order-detail-actions {
  margin-top: 28px;
}

.status-processing {
  background: #17a2b8;
  color: #fff;
}

.status-shipping {
  background: #007bff;
  color: #fff;
}

.status-success {
  background: #28a745;
  color: #fff;
}

.status-cancelled {
  background: #dc3545;
  color: #fff;
}
</style>
