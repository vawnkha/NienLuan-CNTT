<script setup>
import { computed } from "vue";
import { useWishlistStore } from "@/stores/user/wishlist";
import { useCartStore } from "@/stores/user/cart";
import { useAuthStore } from "@/stores/user/auth";

const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const authStore = useAuthStore();

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const productId = computed(() => props.product._id || props.product.id);
const productLink = computed(() => `/products/${productId.value}`);
const isLoved = computed(() => wishlistStore.isInWishlist(productId.value));

async function addToCart() {
  if (!authStore.userId) {
    alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
    return;
  }

  if (Number(props.product.stock) <= 0) {
    alert("Sản phẩm đã hết hàng");
    return;
  }

  try {
    await cartStore.addToCart(authStore.userId, productId.value, 1);
    alert("Đã thêm sản phẩm vào giỏ hàng");
  } catch (error) {
    alert(error.message);
  }
}

async function handleToggleWishlist() {
  if (!authStore.userId) {
    alert("Vui lòng đăng nhập để thêm vào yêu thích");
    return;
  }
  try {
    const result = await wishlistStore.toggleWishlist(
      authStore.userId,
      productId.value,
    );
    alert(result.message || "Đã cập nhật danh sách yêu thích");
  } catch (error) {
    alert(error.message || "Cập nhật danh sách yêu thích thất bại");
  }
}
</script>

<template>
  <div class="product-item">
    <div class="row">
      <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
        <div class="product-image">
          <router-link :to="productLink">
            <img
              class="img-responsive"
              :src="product.thumbnail"
              :alt="product.name"
            />
          </router-link>
        </div>
      </div>

      <div class="col-lg-9 col-md-9 col-sm-8 col-xs-12">
        <div class="product-info">
          <div class="product-title">
            <router-link :to="productLink">
              {{ product.name }}
            </router-link>
          </div>

          <div class="product-rating">
            <div
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{
                on:
                  star <=
                  Math.round(product.average_rating || product.rating || 5),
              }"
            ></div>
            <span class="review-count"
              >({{ product.total_reviews }} Đánh giá)</span
            >
          </div>

          <div class="product-price">
            <span class="sale-price"
              >{{ Number(product.price).toLocaleString("vi-VN") }} đ</span
            >
          </div>

          <div class="product-stock">
            <i class="fa-regular fa-square-check" aria-hidden="true"></i>
            {{ product.stock > 0 ? "Còn hàng" : "Hết hàng" }}
          </div>

          <div class="product-description">
            {{ product.description }}
          </div>

          <div class="product-buttons">
            <a class="add-to-cart" href="#" @click.prevent="addToCart">
              <i class="fa fa-shopping-basket" aria-hidden="true"></i>
              <span>Add To Cart</span>
            </a>

            <a
              class="add-wishlist"
              href="#"
              @click.prevent="handleToggleWishlist"
            >
              <i
                class="fa fa-heart"
                aria-hidden="true"
                :style="{ color: isLoved ? 'red' : '' }"
              ></i>
            </a>

            <router-link class="quickview" :to="productLink">
              <i class="fa fa-eye" aria-hidden="true"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
