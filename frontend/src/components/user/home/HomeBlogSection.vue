<script setup>
defineProps({
  posts: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="section latest-news layout-2">
    <div class="block-title">
      <h2 class="title"><span>Blog</span></h2>
      <div class="sub-title">
        Lorem ipsum dolor sit amet consectetur adipiscing elit eiusmod tempor
      </div>
    </div>

    <div class="block-content">
      <div class="container">
        <div class="row">
          <div
            v-for="post in posts"
            :key="post.id"
            class="col-lg-4 col-md-4 col-sm-4 col-xs-12"
          >
            <div class="blog-item">
              <div class="blog-image">
                <router-link :to="`/blog/${post.id}`" class="zoom-effect">
                  <img :src="post.image" :alt="post.title" />
                </router-link>
              </div>

              <div class="blog-info">
                <div class="blog-title">
                  <router-link :to="`/blog/${post.slug}`">
                    {{ post.title }}
                  </router-link>
                </div>

                <div class="blog-time">
                  <span class="post-date">{{ post.date }}</span>
                </div>

                <div class="blog-desc">
                  {{ post.excerpt }}
                </div>
                <div class="readmore">
                  <router-link :to="`/blog/${post.id}`"> Xem thêm </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
