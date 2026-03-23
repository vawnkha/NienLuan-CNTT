<script setup>
import { computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/user/auth";
import { useCartStore } from "@/stores/user/cart";
import { useWishlistStore } from "@/stores/user/wishlist";

const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

const { items: wishlistItems, loading } = storeToRefs(wishlistStore);

const normalizedWishlistItems = computed(() =>
  (wishlistItems.value || []).map((item) => ({
    ...item,
    productId: item.product_id || item._id || item.id,
  })),
);

async function fetchWishlistData() {
  if (!authStore.userId) return;
  try {
    await wishlistStore.fetchWishlist(authStore.userId);
  } catch (error) {
    console.error(error.message);
  }
}

onMounted(fetchWishlistData);

watch(
  () => authStore.userId,
  async (newUserId) => {
    if (newUserId) {
      await fetchWishlistData();
    }
  },
);

async function handleRemoveFromWishlist(productId) {
  if (!authStore.userId) {
    alert("Vui lòng đăng nhập");
    return;
  }

  if (!productId) {
    alert("Không xác định được sản phẩm cần xóa");
    return;
  }

  try {
    const result = await wishlistStore.removeFromWishlist(
      authStore.userId,
      productId,
    );
    alert(result?.message || "Đã xóa khỏi danh sách yêu thích");
  } catch (error) {
    alert(error.message);
  }
}

async function addToCart(item) {
  if (!authStore.userId) {
    alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
    return;
  }

  if (Number(item.stock || 0) <= 0) {
    alert("Sản phẩm đã hết hàng");
    return;
  }

  if (!item.productId) {
    alert("Không xác định được sản phẩm");
    return;
  }

  try {
    await cartStore.addToCart(authStore.userId, item.productId, 1);
    alert(`Đã thêm "${item.name}" vào giỏ hàng`);
  } catch (error) {
    alert(error.message);
  }
}
</script>

<template>
  <div id="content" class="site-content">
    <div id="breadcrumb">
      <div class="container">
        <h2 class="title">Yêu Thích</h2>

        <ul class="breadcrumb">
          <li><router-link to="/">Trang Chủ</router-link></li>
          <li><span>Yêu Thích</span></li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div class="page-cart">
        <div v-if="loading" class="wishlist-empty">
          <h3>Đang tải danh sách yêu thích...</h3>
        </div>

        <div
          v-else-if="!normalizedWishlistItems.length"
          class="wishlist-empty text-center"
        >
          <h3>Danh sách yêu thích đang trống</h3>
          <p>Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.</p>
          <router-link to="/products" class="btn btn-primary pull-center">
            <span>Đi đến trang sản phẩm</span>
            <i class="fa fa-angle-right ml-xs"></i>
          </router-link>
        </div>

        <div v-else class="table-responsive">
          <table class="wishlist-table">
            <tbody>
              <tr v-for="item in normalizedWishlistItems" :key="item.productId">
                <td class="wishlist-remove">
                  <a
                    href="#"
                    @click.prevent="handleRemoveFromWishlist(item.productId)"
                  >
                    x
                  </a>
                </td>

                <td class="wishlist-image">
                  <router-link :to="`/products/${item.productId}`">
                    <img :src="item.thumbnail" :alt="item.name" />
                  </router-link>
                </td>

                <td class="wishlist-name">
                  <router-link :to="`/products/${item.productId}`">
                    {{ item.name }}
                  </router-link>
                </td>

                <td class="wishlist-price">
                  {{ Number(item.price || 0).toLocaleString("vi-VN") }}đ/{{
                    item.unit
                  }}
                </td>

                <td class="wishlist-status">
                  {{ Number(item.stock || 0) > 0 ? "Còn hàng" : "Hết hàng" }}
                </td>

                <td class="wishlist-action">
                  <button class="btn-wishlist-cart" @click="addToCart(item)">
                    Thêm vào giỏ hàng
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wishlist-subtitle {
  color: #8db600;
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.wishlist-title {
  margin: 0;
  color: #fff;
  font-size: 72px;
  font-weight: 700;
  line-height: 1.05;
}

.wishlist-table {
  width: 100%;
  border-collapse: collapse;
}

.wishlist-table tr {
  border-bottom: 1px solid #ececec;
}

.wishlist-table td {
  padding: 28px 20px;
  vertical-align: middle;
  font-size: 18px;
  color: #555;
}

.wishlist-remove {
  width: 60px;
  text-align: center;
}

.wishlist-remove a {
  color: #666;
  text-decoration: none;
  font-size: 24px;
  line-height: 1;
}

.wishlist-image {
  width: 140px;
}

.wishlist-image img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  display: block;
}

.wishlist-name a {
  color: #1d1d1d;
  font-size: 24px;
  font-weight: 700;
  text-decoration: none;
}

.wishlist-price,
.wishlist-status {
  white-space: nowrap;
  font-size: 18px;
}

.wishlist-action {
  text-align: right;
  min-width: 220px;
}

.btn-wishlist-cart {
  background: #78b144;
  color: #fff;
  border: none;
  padding: 14px 28px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}

.btn-wishlist-cart:hover {
  background: #3ba66b;
  opacity: 0.95;
}

@media (max-width: 991px) {
  .wishlist-title {
    font-size: 52px;
  }

  .wishlist-table td {
    padding: 22px 14px;
    font-size: 16px;
  }

  .wishlist-name a {
    font-size: 20px;
  }

  .btn-wishlist-cart {
    padding: 12px 20px;
    font-size: 16px;
  }
}

@media (max-width: 767px) {
  .wishlist-title {
    font-size: 40px;
  }

  .wishlist-hero {
    padding: 36px 0 48px;
  }

  .wishlist-hero-right {
    font-size: 16px;
    margin-top: 0;
  }
}
</style>
