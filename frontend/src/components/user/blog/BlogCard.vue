<script setup>
import { computed } from "vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const postLink = computed(() => `/blog/${props.post.slug}`);
</script>

<template>
  <!-- <div class="post-item">
    <div class="post-image">
      <router-link :to="postLink">
        <img class="img-responsive" :src="post.image" :alt="post.title" />
      </router-link>
    </div>

    <div class="post-content">
      <h2 class="post-title">
        <router-link :to="postLink">
          {{ post.title }}
        </router-link>
      </h2>

      <div class="post-meta">
        <span class="post-date">
          <i class="zmdi zmdi-calendar-note"></i>
          {{ post.date }}
        </span>

        <span class="post-author">
          <i class="zmdi zmdi-account"></i>
          {{ post.author }}
        </span>
      </div>

      <div class="post-description">
        {{ post.excerpt }}
      </div>

      <div class="post-read-more">
        <router-link :to="postLink" class="btn btn-primary">
          Read More
        </router-link>
      </div>
    </div>
  </div> -->

  <div class="post-item">
    <div class="row">
      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 post-left">
        <div class="post-image">
          <router-link :to="postLink">
            <img class="img-responsive" :src="post.image" :alt="post.title" />
          </router-link>
        </div>
      </div>
      <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12 post-right">
        <router-link :to="postLink">
          <a class="post-title">{{ post.title }}</a>
        </router-link>
        <div class="post-info">
          <span class="comment item"
            ><i class="zmdi zmdi-comments"></i>2 Bình Luận</span
          >
          <span class="date item"
            ><i class="zmdi zmdi-calendar-note"></i>{{ post.date }}</span
          >
        </div>
        <div class="post-description">
          {{ post.excerpt }}...
          <span class="post-readmore">
            <router-link :to="postLink">
              <a>Xem Thêm</a>
            </router-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
