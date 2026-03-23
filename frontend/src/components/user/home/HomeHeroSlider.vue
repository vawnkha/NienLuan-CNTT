<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  { id: 1, image: "/img/slideshow/home1-slideshow-1.jpg" },
  { id: 2, image: "/img/slideshow/home1-slideshow-2.jpg" },
  { id: 3, image: "/img/slideshow/home1-slideshow-3.jpg" },
];

const modules = [Autoplay, Pagination];
</script>
<template>
  <div class="section slideshow">
    <div class="tiva-slideshow-wrapper">
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :pagination="{ clickable: true }"
        class="home-hero-swiper"
      >
        <SwiperSlide v-for="slide in slides" :key="slide.id">
          <a href="#">
            <img
              :src="slide.image"
              alt="Slideshow Image"
              class="img-responsive"
            />
          </a>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>
<style>
.tiva-slideshow-wrapper {
  position: relative;
  overflow: hidden;
  z-index: 9;
}
.swiper-pagination {
  font-size: 0px;
  position: absolute;
  bottom: 30px;
  left: 0px;
  right: 0px;
  width: 100%;
  z-index: 9;
  text-align: center;
  padding: 0;
}
.swiper-pagination-bullet {
  display: inline-block;
  vertical-align: middle;
  width: 10px;
  height: 10px;
  background-color: #ebebeb;
  border-radius: 50px;
  margin: 0px 4px;
  cursor: pointer;
  font-size: 0px;
}
.swiper-pagination-bullet-active {
  height: 1pc;
  width: 16px;
}
</style>
