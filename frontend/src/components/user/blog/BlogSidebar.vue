<script setup>
const categories = [
  "Rau củ",
  "Trái cây tươi",
  "Thực phẩm hữu cơ",
  "Đồ ăn nhanh",
  "khác",
];

const recentPosts = [
  {
    id: 1,
    title: "5 Bữa tối nhanh gọn cho ngày trong tuần bận rộn",
    description:
      "Tiết kiệm thời gian với những công thức nấu ăn đơn giản nhưng vẫn đảm bảo dinh dưỡng cho cả gia đình...",
  },
  {
    id: 2,
    title: "Mẹo nhỏ giúp bạn chọn mua rau củ luôn tươi ngon",
    description:
      "Làm thế nào để phân biệt rau tươi và rau đã để lâu? Hãy cùng khám phá những bí quyết chọn thực phẩm cực chuẩn...",
  },
  {
    id: 3,
    title: "Ý tưởng bữa sáng lành mạnh cho mỗi buổi sáng",
    description:
      "Khởi đầu ngày mới tràn đầy năng lượng với danh sách các món ăn sáng vừa ngon vừa tốt cho sức khỏe...",
  },
];

const tags = ["Đồ ăn", "Hữu cơ", "Sức khỏe", "Trái cây", "Rau củ", "Nấu ăn"];
</script>

<template>
  <!-- Block - Product Categories -->
  <div class="block product-categories">
    <h3 class="block-title">Danh Mục</h3>

    <div class="block-content">
      <div class="item" v-for="category in categories" :key="category">
        <a class="category-title" href="#" @click.prevent>{{ category }}</a>
      </div>
    </div>
  </div>

  <!-- Block - Recent Posts -->
  <div class="block posts recent-posts">
    <h3 class="block-title">bài viết gần đây</h3>

    <div class="block-content">
      <div class="post-item" v-for="post in recentPosts" :key="post.id">
        <a href="#" class="post-title">{{ post.title }}</a>
        <div class="post-info">
          <span class="comment item"
            ><i class="zmdi zmdi-comments"></i>2 Bình Luận</span
          >
          <span class="date item"
            ><i class="zmdi zmdi-calendar-note"></i>14 Mar, 2018</span
          >
        </div>
        <div class="post-description">
          {{ post.description }}
        </div>
        <div class="post-readmore">
          <a href="#">xem thêm</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Block - Blog Tags -->
  <div class="block tags blog-tags">
    <h3 class="block-title">Từ Khóa</h3>

    <div class="block-content">
      <ul>
        <li v-for="tag in tags" :key="tag">
          <a href="#" @click.prevent :title="tag">{{ tag }}</a>
        </li>
      </ul>
    </div>
  </div>

  <!-- Block - Banner -->
  <div class="block banner">
    <div class="block-content">
      <div class="effect">
        <img class="img-responsive" src="/img/blog-banner.jpg" alt="Banner" />
      </div>
    </div>
  </div>
</template>
