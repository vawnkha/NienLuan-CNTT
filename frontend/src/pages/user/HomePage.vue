<script setup>
import { onMounted, ref } from "vue";
import HomeHeroSlider from "@/components/user/home/HomeHeroSlider.vue";
import HomeProductTabs from "@/components/user/home/HomeProductTabs.vue";
import HomeProductCarouselSection from "@/components/user/home/HomeProductCarouselSection.vue";
import HomeBlogSection from "@/components/user/home/HomeBlogSection.vue";
import HomeIntro from "@/components/user/home/HomeIntro.vue";
import productService from "@/services/product.service";
const featuredProducts = ref([]);

const bestSellerProducts = ref([]);

onMounted(async () => {
  try {
    const latest = await productService.getAll({ page: 1, limit: 12 });
    const items = latest.data || [];
    featuredProducts.value = items.slice(0, 6);
    bestSellerProducts.value = items.slice(6, 12);
  } catch (error) {
    console.error(error.message);
  }
});

const blogPosts = [
  {
    id: 1,
    title: "5 Quick Dinners for Busy Weeknights",
    slug: "5-quick-dinners-for-busy-weeknights",
    image: "/img/blog/blog-1.jpg",
    date: "10/05/2026",
    excerpt: "Những bữa tối nhanh, dễ làm và phù hợp cho ngày bận rộn.",
  },
  {
    id: 2,
    title: "Simple Tips for Choosing Fresh Vegetables",
    slug: "simple-tips-for-choosing-fresh-vegetables",
    image: "/img/blog/blog-2.jpg",
    date: "12/05/2026",
    excerpt: "Mẹo chọn rau củ tươi ngon khi đi chợ hoặc siêu thị.",
  },
  {
    id: 3,
    title: "Healthy Breakfast Ideas for Every Morning",
    slug: "healthy-breakfast-ideas-for-every-morning",
    image: "/img/blog/blog-3.jpg",
    date: "15/05/2026",
    excerpt: "Gợi ý bữa sáng lành mạnh và dễ chuẩn bị mỗi ngày.",
  },
];
</script>

<template>
  <div id="content" class="site-content">
    <!-- Slideshow -->
    <HomeHeroSlider />
    <!-- Products - New Arrivals-->
    <HomeProductTabs />
    <!-- Intro -->
    <HomeIntro />
    <!-- Product -->
    <div class="two-column">
      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <HomeProductCarouselSection
            title="Nổi Bật"
            highlight="Sản Phẩm"
            subtitle="Sản phẩm nổi bật từ cửa hàng"
            :products="featuredProducts"
          />
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <HomeProductCarouselSection
            title="Nhất"
            highlight="Bán Chạy"
            subtitle="Sản phẩm bán chạy nhất của cửa hàng"
            :products="bestSellerProducts"
          />
        </div>
      </div>
    </div>
    <!-- Banner -->
    <div class="section banners-block">
      <div class="row margin-0">
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 padding-0">
          <div class="banner-item effect">
            <a href="#">
              <img
                class="img-responsive"
                src="/img/banner/home1-banner-1.png"
                alt="Banner 1"
              />
            </a>
          </div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 padding-0">
          <div class="banner-item effect">
            <a href="#">
              <img
                class="img-responsive"
                src="/img/banner/home1-banner-2.png"
                alt="Banner 2"
              />
            </a>
          </div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 padding-0">
          <div class="banner-item effect">
            <a href="#">
              <img
                class="img-responsive"
                src="/img/banner/home1-banner-3.png"
                alt="Banner 3"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- Blog -->
    <HomeBlogSection :posts="blogPosts" />
  </div>
</template>
<style>
.swiper-button-prev .swiper-navigation-icon,
.swiper-button-next .swiper-navigation-icon {
  height: 70%;
  color: #78b144;
}
</style>
