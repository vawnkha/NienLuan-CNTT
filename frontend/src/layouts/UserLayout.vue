<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useAppLoading } from "@/stores/user/appLoading";
import UserHeader from "@/components/user/layout/UserHeader.vue";
import UserFooter from "@/components/user/layout/UserFooter.vue";

const showGoUp = ref(false);
const { isPageLoading } = useAppLoading();

const handleScroll = () => {
  showGoUp.value = window.scrollY > 400;
};
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="home home-1">
    <div id="all">
      <UserHeader />
      <router-view />
      <UserFooter />
      <div v-show="showGoUp" class="go-up">
        <a href="#" @click.prevent="scrollToTop">
          <i class="fa fa-long-arrow-up"></i>
        </a>
      </div>

      <!-- Page Loader -->
      <div v-if="isPageLoading" id="page-preloader">
        <div class="page-loading">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>
