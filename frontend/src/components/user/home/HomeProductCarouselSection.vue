<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import { useAuthStore } from "@/stores/user/auth";
import { useCartStore } from "@/stores/user/cart";
import { useWishlistStore } from "@/stores/user/wishlist";

import "swiper/css";
import "swiper/css/navigation";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  highlight: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  products: {
    type: Array,
    required: true,
  },
});
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const modules = [Navigation];

async function addToCart(product) {
  if (!authStore.userId) {
    alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
    return;
  }

  if (product.stock <= 0) {
    alert("Sản phẩm đã hết hàng");
    return;
  }

  await cartStore.addToCart(authStore.userId, product._id, 1);
  alert("Đã thêm sản phẩm vào giỏ hàng");
}

async function toggleWishlistItem(product) {
  if (!authStore.userId) return alert("Vui lòng đăng nhập");

  try {
    const res = await wishlistStore.toggleWishlist(
      authStore.userId,
      product._id,
    );
    alert(res.message);
  } catch (error) {
    alert(error.message);
  }
}
</script>

<template>
  <div class="section products-block category-double no-border">
    <div class="block-title">
      <h2 class="title">
        <span>{{ highlight }}</span> {{ title }}
      </h2>
      <div v-if="subtitle" class="sub-title">{{ subtitle }}</div>
    </div>

    <div class="block-content">
      <div class="products">
        <Swiper
          :modules="modules"
          :slides-per-view="3"
          :space-between="20"
          :navigation="true"
          :breakpoints="{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 3 },
          }"
          class="products-swiper"
        >
          <SwiperSlide v-for="product in products" :key="product._id">
            <div class="product-item">
              <div class="product-image">
                <router-link :to="`/products/${product._id}`">
                  <img :src="product.thumbnail" alt="Product Image" />
                </router-link>
              </div>

              <div class="product-title">
                <router-link :to="`/products/${product._id}`">
                  {{ product.name }}
                </router-link>
              </div>

              <div class="product-rating">
                <div
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{ on: star <= Number(product.average_rating || 0) }"
                ></div>
              </div>

              <div class="product-price">
                <span class="sale-price">
                  {{ Number(product.price).toLocaleString("vi-VN") }} đ
                </span>
              </div>

              <div class="product-buttons">
                <a
                  class="add-to-cart"
                  href="#"
                  @click.prevent="addToCart(product._id)"
                >
                  <i class="fa fa-shopping-basket" aria-hidden="true"></i>
                </a>

                <a
                  class="add-wishlist"
                  href="#"
                  @click.prevent="toggleWishlistItem(product._id)"
                >
                  <i
                    class="fa fa-heart"
                    aria-hidden="true"
                    :style="{
                      color: wishlistStore.isInWishlist(product._id)
                        ? 'red'
                        : '',
                    }"
                  ></i>
                </a>

                <router-link class="quickview" :to="`/products/${product._id}`">
                  <i class="fa fa-eye" aria-hidden="true"></i>
                </router-link>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>
