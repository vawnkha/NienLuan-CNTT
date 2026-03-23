<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "@/stores/user/cart";
import { useWishlistStore } from "@/stores/user/wishlist";
import { useAuthStore } from "@/stores/user/auth";
import productService from "@/services/product.service";
import reviewService from "@/services/review.service";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const route = useRoute();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();

const loading = ref(false);
const product = ref(null);
const relatedProducts = ref([]);
const reviews = ref([]);
const reviewStats = ref({ total_reviews: 0, average_rating: 0 });
const canReview = ref(false);
const canReviewMessage = ref("");
const quantity = ref(1);
const selectedImage = ref("");
const activeTab = ref("description");

const reviewForm = reactive({
  rating: 0,
  comment: "",
});

const swiperModules = [Navigation];
const relatedSwiperModules = [Navigation, Autoplay];

const productId = computed(() => route.params.id);
const isLoved = computed(() => wishlistStore.isInWishlist(productId.value));

const productGallery = computed(() => {
  if (!product.value) return [];
  return [
    ...new Set(
      [product.value.thumbnail, ...(product.value.images || [])].filter(
        Boolean,
      ),
    ),
  ];
});

async function fetchProductDetail() {
  loading.value = true;
  try {
    const data = await productService.getById(productId.value);
    product.value = data;
    selectedImage.value = data.thumbnail || "";

    reviews.value = data.reviews || [];
    reviewStats.value = {
      total_reviews: data.total_reviews || 0,
      average_rating: data.average_rating || 0,
    };

    if (authStore.userId) {
      const permission = await reviewService.canReview(
        authStore.userId,
        productId.value,
      );
      canReview.value = !!permission.canReview;
      canReviewMessage.value = permission.message || "";
    }

    if (data.category_id) {
      const related = await productService.getByCategory(data.category_id, {
        page: 1,
        limit: 8,
      });

      let list = related.data || [];

      list = list.filter((item) => String(item._id) !== String(data._id));

      if (list.length < 8) {
        const fallback = await productService.getAll({ page: 1, limit: 8 });

        list = [
          ...list,
          ...(fallback.data || []).filter(
            (item) =>
              String(item._id) !== String(data._id) &&
              !list.some((p) => p._id === item._id),
          ),
        ];
      }

      relatedProducts.value = list;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

function changeImage(image) {
  selectedImage.value = image;
}
function increaseQty() {
  if (quantity.value < Number(product.value.stock || 0)) {
    quantity.value++;
  }
}
function decreaseQty() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

async function addCurrentProductToCart() {
  if (!authStore.userId) {
    alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
    return;
  }

  if (!product.value || Number(product.value.stock || 0) <= 0) {
    alert("Sản phẩm đã hết hàng");
    return;
  }

  try {
    await cartStore.addToCart(
      authStore.userId,
      product.value._id,
      quantity.value,
    );
    alert("Đã thêm sản phẩm vào giỏ hàng");
  } catch (error) {
    alert(error.message);
  }
}

async function toggleWishlist() {
  if (!authStore.userId) {
    alert("Vui lòng đăng nhập để thêm vào yêu thích");
    return;
  }

  try {
    const result = await wishlistStore.toggleWishlist(
      authStore.userId,
      productId.value,
    );
    alert(result.message);
  } catch (error) {
    alert(error.message);
  }
}

async function submitReview() {
  if (!authStore.userId) {
    alert("Vui lòng đăng nhập để đánh giá");
    return;
  }

  if (!canReview.value) {
    alert(canReviewMessage.value || "Bạn chưa thể đánh giá sản phẩm này");
    return;
  }

  if (!reviewForm.comment.trim()) {
    alert("Vui lòng nhập nội dung đánh giá");
    return;
  }

  try {
    await reviewService.create({
      user_id: authStore.userId,
      product_id: productId.value,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });

    reviewForm.rating = 5;
    reviewForm.comment = "";
    activeTab.value = "review";
    await fetchProductDetail();
    alert("Đánh giá sản phẩm thành công");
  } catch (error) {
    alert(error.message);
  }
}

function setReviewRating(star) {
  reviewForm.rating = star;
}

async function addToCart(productId) {
  if (!authStore.userId) {
    alert("Vui lòng đăng nhập");
    return;
  }

  await cartStore.addToCart(authStore.userId, productId, 1);
}

async function toggleWishlistItem(productId) {
  if (!authStore.userId) return alert("Vui lòng đăng nhập");

  try {
    const res = await wishlistStore.toggleWishlist(authStore.userId, productId);
    alert(res.message);
  } catch (error) {
    alert(error.message);
  }
}

watch(
  () => route.params.id,
  () => {
    quantity.value = 1;
    activeTab.value = "description";
    fetchProductDetail();
  },
  { immediate: true },
);

function printPage() {
  window.print();
}
</script>

<template>
  <div id="content" class="site-content">
    <!-- Breadcrumb -->
    <div v-if="product">
      <div id="breadcrumb">
        <div class="container">
          <h2 class="title">{{ product.name }}</h2>

          <ul class="breadcrumb">
            <li><router-link to="/">Trang Chủ</router-link></li>
            <li><router-link to="/products">Sản Phẩm</router-link></li>
            <li>
              <span>{{ product.name }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="container">
        <div class="product-detail">
          <div class="products-block layout-5">
            <div class="product-item">
              <div class="product-title">{{ product.name }}</div>

              <div class="row">
                <div class="product-left col-md-4 col-sm-4 col-xs-12">
                  <div class="product-image horizontal">
                    <div class="main-image">
                      <img
                        class="img-responsive"
                        :src="selectedImage"
                        :alt="product.name"
                      />
                    </div>
                    <div class="thumb-images thumb-swiper-wrapper">
                      <Swiper
                        :modules="swiperModules"
                        :slides-per-view="4"
                        :space-between="10"
                        :navigation="true"
                        class="thumb-swiper"
                        :breakpoints="{
                          0: { slidesPerView: 2 },
                          576: { slidesPerView: 3 },
                          768: { slidesPerView: 4 },
                        }"
                      >
                        <SwiperSlide
                          v-for="(image, index) in productGallery"
                          :key="index"
                        >
                          <div
                            class="thumb-item"
                            :class="{ active: selectedImage === image }"
                            @click="changeImage(image)"
                          >
                            <img
                              class="img-responsive"
                              :src="image"
                              :alt="product.name"
                            />
                          </div>
                        </SwiperSlide>
                      </Swiper>
                    </div>
                  </div>
                </div>

                <div class="product-right col-md-5 col-sm-4 col-xs-12">
                  <div class="product-info">
                    <div class="product-price">
                      <span class="sale-price"
                        >{{ Number(product.price).toLocaleString("vi-VN") }} đ /
                        {{ product.unit }}</span
                      >
                    </div>

                    <div class="product-stock">
                      <span class="availability">Tình Trạng :</span
                      ><i class="fa fa-check-square-o" aria-hidden="true"></i>
                      {{ product.stock > 0 ? "Còn Hàng" : "Hết Hàng" }}
                    </div>

                    <div class="product-short-description">
                      {{ product.description }}
                    </div>

                    <div class="product-variants border-bottom">
                      <div class="product-variants-item"></div>

                      <div class="product-variants-item"></div>
                    </div>

                    <div class="product-add-to-cart border-bottom">
                      <div class="product-quantity">
                        <span class="control-label">SL :</span>
                        <div class="qty">
                          <div class="input-group">
                            <input :value="quantity" data-min="1" readonly />
                            <span class="adjust-qty">
                              <span class="adjust-btn plus" @click="increaseQty"
                                >+</span
                              >
                              <span
                                class="adjust-btn minus"
                                @click="decreaseQty"
                                >-</span
                              >
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="product-buttons" style="margin-right: 20px">
                        <a
                          class="add-to-cart"
                          href="#"
                          @click.prevent="addCurrentProductToCart"
                        >
                          <i
                            class="fa fa-shopping-basket"
                            aria-hidden="true"
                          ></i>
                          <span>Thêm giỏ hàng</span>
                        </a>
                        <a
                          class="add-wishlist"
                          href="#"
                          @click.prevent="toggleWishlist"
                        >
                          <i
                            class="fa fa-heart"
                            :style="{ color: isLoved ? 'red' : '' }"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </div>
                    </div>

                    <div class="product-share border-bottom">
                      <div class="item">
                        <a href="#" @click.prevent
                          ><i class="zmdi zmdi-share" aria-hidden="true"></i
                          ><span class="text">Chia sẻ</span></a
                        >
                      </div>
                      <div class="item">
                        <a href="#" @click.prevent
                          ><i class="zmdi zmdi-email" aria-hidden="true"></i
                          ><span class="text">Gửi cho bạn bè</span></a
                        >
                      </div>
                      <div class="item">
                        <a href="#" @click.prevent="printPage"
                          ><i class="zmdi zmdi-print" aria-hidden="true"></i
                          ><span class="text">In</span></a
                        >
                      </div>
                    </div>

                    <div class="product-review border-bottom">
                      <div class="item">
                        <div class="product-quantity">
                          <span class="control-label">Đánh Giá:</span>
                          <div class="product-rating">
                            <div
                              v-for="star in 5"
                              :key="star"
                              class="star"
                              :class="{
                                on:
                                  star <=
                                  Math.round(reviewStats.average_rating || 0),
                              }"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div class="item">
                        <a href="#" @click.prevent="activeTab = 'review'"
                          ><i class="zmdi zmdi-comments" aria-hidden="true"></i
                          ><span class="text"
                            >Đọc Đánh Giá ({{ reviews.length }})</span
                          ></a
                        >
                      </div>

                      <div class="item">
                        <a href="#" @click.prevent="activeTab = 'review'"
                          ><i class="zmdi zmdi-edit" aria-hidden="true"></i
                          ><span class="text">Viết Đánh Giá</span></a
                        >
                      </div>
                    </div>

                    <div class="product-extra">
                      <div class="item">
                        <!-- <span class="control-label">Review :</span
                          ><span class="control-label">E-02154</span> -->
                      </div>
                      <div class="item">
                        <span class="control-label">Danh Mục :</span>
                        <a href="#">{{ product.category_name }}</a>
                      </div>
                      <div class="item">
                        <!-- <span class="control-label">Tags :</span>
                          <a href="#" title="Vegetables">Hot Trend,</a>
                          <a href="#" title="Fruits">Summer</a> -->
                      </div>
                    </div>
                  </div>
                </div>

                <div class="payment-intro col-md-3 col-sm-4 col-xs-12">
                  <div class="block-content">
                    <div class="item">
                      <img
                        class="img-responsive"
                        src="/img/home2-payment-1.png"
                        alt="Payment Intro"
                      />
                      <h3 class="title">Miễn phí vận chuyển</h3>
                      <div class="content">
                        Sản phẩm chất lượng cao với dịch vụ giao hàng nhanh
                        chóng và uy tín trên toàn quốc.
                      </div>
                    </div>
                    <div class="item">
                      <img
                        class="img-responsive"
                        src="/img/home2-payment-2.png"
                        alt="Payment Intro"
                      />
                      <h3 class="title">Thanh toán bảo mật</h3>
                      <div class="content">
                        Cam kết bảo mật thông tin thanh toán và đa dạng các
                        phương thức trả tiền an toàn.
                      </div>
                    </div>
                    <div class="item">
                      <img
                        class="img-responsive"
                        src="/img/home2-payment-3.png"
                        alt="Payment Intro"
                      />
                      <h3 class="title">Hoàn tiền 100%</h3>
                      <div class="content">
                        Cam kết hoàn trả chi phí nếu sản phẩm không đúng mô tả
                        hoặc gặp lỗi từ nhà sản xuất.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="product-tab">
                <!-- Tab Navigation -->
                <div class="tab-nav">
                  <ul>
                    <li :class="{ active: activeTab === 'description' }">
                      <a href="#" @click.prevent="activeTab = 'description'">
                        <span>Mô Tả</span>
                      </a>
                    </li>

                    <li :class="{ active: activeTab === 'review' }">
                      <a href="#" @click.prevent="activeTab = 'review'">
                        <span>Đánh Giá</span>
                      </a>
                    </li>
                  </ul>
                </div>

                <!-- Tab Content -->
                <div class="tab-content">
                  <!-- Description -->
                  <div
                    v-if="activeTab === 'description'"
                    role="tabpanel"
                    class="tab-pane fade in active"
                    id="description"
                  >
                    <p>
                      {{ product.description }}
                    </p>
                  </div>

                  <!-- Review -->
                  <div
                    v-if="activeTab === 'review'"
                    role="tabpanel"
                    class="tab-pane fade in active"
                    id="review"
                  >
                    <div class="reviews">
                      <div
                        class="comments-list"
                        v-for="comment in reviews"
                        :key="comment.id"
                      >
                        <div class="item">
                          <div class="comment-left pull-left">
                            <div class="avatar">
                              <img
                                src="/img/avatar.jpg"
                                alt=""
                                width="70"
                                height="70"
                              />
                            </div>
                            <div class="product-rating">
                              <div
                                v-for="star in 5"
                                :key="star"
                                class="star"
                                :class="{ on: star <= comment.rating }"
                              ></div>
                            </div>
                          </div>
                          <div class="comment-body">
                            <div class="comment-meta">
                              <span class="author">{{ comment.author }}</span> -
                              <span class="time">{{ comment.time }}</span>
                            </div>
                            <div class="comment-content">
                              {{ comment.content }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="review-form">
                        <h4 class="title">Viết Đánh Giá</h4>

                        <form
                          @submit.prevent="submitReview"
                          action="#"
                          method="post"
                          class="form-validate"
                        >
                          <div class="form-group">
                            <div class="text">Đánh Giá</div>
                            <div class="product-rating">
                              <div
                                v-for="star in 5"
                                :key="star"
                                class="star"
                                :class="{ on: star <= reviewForm.rating }"
                                @click="setReviewRating(star)"
                                style="cursor: pointer"
                              ></div>
                            </div>
                          </div>
                          <div class="form-group">
                            <div class="text">
                              Nội Dung<sup class="required">*</sup>
                            </div>
                            <textarea
                              v-model="reviewForm.comment"
                              id="comment"
                              name="comment"
                              cols="45"
                              rows="6"
                              aria-required="true"
                            ></textarea>
                          </div>

                          <div class="form-group">
                            <button class="btn btn-primary">
                              Gửi Đánh Giá
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div class="products-block related-products item-4">
          <div class="block-title">
            <h2 class="title"><span>Sản Phẩm</span> Tương Tự</h2>
          </div>

          <div v-if="relatedProducts.length" class="block-content">
            <Swiper
              class="related-products-swiper"
              :modules="relatedSwiperModules"
              :slides-per-view="4"
              :space-between="30"
              :navigation="true"
              :loop="relatedProducts.length > 4"
              :breakpoints="{
                0: { slidesPerView: 1, spaceBetween: 12 },
                576: { slidesPerView: 2, spaceBetween: 16 },
                992: { slidesPerView: 3, spaceBetween: 20 },
                1200: { slidesPerView: 4, spaceBetween: 30 },
              }"
            >
              <SwiperSlide v-for="item in relatedProducts" :key="item._id">
                <div class="product-item">
                  <div class="product-image">
                    <router-link
                      :to="`/products/${item._id}`"
                      class="product-image-link"
                    >
                      <img :src="item.thumbnail" :alt="item.name" />
                    </router-link>
                  </div>

                  <div class="product-title">
                    <router-link :to="`/products/${item._id}`">
                      {{ item.name }}
                    </router-link>
                  </div>

                  <div class="product-rating">
                    <div
                      v-for="star in 5"
                      :key="star"
                      class="star"
                      :class="{ on: star <= item.rating }"
                    ></div>
                  </div>

                  <div class="product-price">
                    <span class="sale-price"
                      >{{ Number(item.price).toLocaleString("vi-VN") }} đ</span
                    >
                  </div>

                  <div class="product-buttons">
                    <a
                      class="add-to-cart"
                      href="#"
                      @click.prevent="addToCart(item._id)"
                    >
                      <i class="fa fa-shopping-basket" aria-hidden="true"></i>
                    </a>

                    <a
                      class="add-wishlist"
                      href="#"
                      @click.prevent="toggleWishlistItem(item._id)"
                    >
                      <i
                        class="fa fa-heart"
                        aria-hidden="true"
                        :style="{
                          color: wishlistStore.isInWishlist(item._id)
                            ? 'red'
                            : '',
                        }"
                      ></i>
                    </a>

                    <router-link
                      class="quickview"
                      :to="`/products/${item._id}`"
                    >
                      <i class="fa fa-eye" aria-hidden="true"></i>
                    </router-link>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
    <div v-else id="content" class="site-content">
      <div id="breadcrumb">
        <div class="container">
          <h2 class="title"></h2>

          <ul class="breadcrumb">
            <li><router-link to="/">Trang Chủ</router-link></li>
            <li><router-link to="/products">Sản Phẩm</router-link></li>
          </ul>
        </div>
      </div>
      <div class="container text-center">
        <h2>Không tìm thấy sản phẩm</h2>
      </div>
    </div>
  </div>
</template>
<style>
.thumb-swiper-wrapper {
  margin-top: 15px;
}

.thumb-swiper {
  position: relative;
}

.thumb-swiper .swiper-slide {
  height: auto;
}

.thumb-item {
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s ease;
  background: #fff;
}

.thumb-item.active {
  border-color: #7a9c59;
}

.thumb-item img {
  display: block;
  width: 100%;
  height: auto;
}

.thumb-swiper .swiper-button-prev,
.thumb-swiper .swiper-button-next {
  width: 28px;
  height: 28px;
  margin-top: -14px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #78b144;
}
.thumb-swiper .swiper-button-prev .swiper-navigation-icon,
.thumb-swiper .swiper-button-next .swiper-navigation-icon {
  height: 70%;
  color: #78b144;
}

/* Related Product */

.related-products .block-content {
  position: relative;
}

.related-products-swiper {
  width: 100%;
  padding: 5px 2px;
}

.related-products-swiper .swiper-slide {
  height: auto;
  box-sizing: border-box;
}

.related-products-swiper .product-item {
  width: 100%;
  height: 100%;
  background: #fff;
  border: 1px solid #e5dfd3;
  padding: 20px 15px;
  text-align: center;
  overflow: hidden;
  box-sizing: border-box;
}

.related-products-swiper .product-image {
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  overflow: hidden;
}

.related-products-swiper .product-image-link {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.related-products-swiper .product-image img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.related-products-swiper .swiper-button-prev .swiper-navigation-icon,
.related-products-swiper .swiper-button-next .swiper-navigation-icon {
  height: 70%;
  color: #78b144;
}
</style>
