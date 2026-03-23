<script setup>
import { computed, ref } from "vue";
import BlogCard from "@/components/user/blog/BlogCard.vue";
import BlogSidebar from "@/components/user/blog/BlogSidebar.vue";

const currentPage = ref(1);
const perPage = 8;

const posts = ref([
  {
    id: 1,
    title: "5 Bữa tối nhanh gọn cho ngày trong tuần bận rộn",
    slug: "5-bua-toi-nhanh-gon-cho-ngay-trong-tuan-ban-ron",
    image: "/img/blog/blog-1.jpg",
    date: "10 Tháng 5, 2026",
    excerpt:
      "Khám phá 5 ý tưởng bữa tối dễ làm và ngon miệng mà bạn có thể chuẩn bị nhanh chóng sau một ngày dài. Lựa chọn hoàn hảo cho các gia đình bận rộn và sinh viên.",
  },
  {
    id: 2,
    title: "Mẹo đơn giản để chọn mua rau củ tươi ngon",
    slug: "meo-don-gian-de-chon-mua-rau-cu-tuoi-ngon",
    image: "/img/blog/blog-2.jpg",
    date: "12 Tháng 5, 2026",
    excerpt:
      "Học cách nhận biết rau củ tươi tại chợ và bí quyết bảo quản chúng ở trạng thái tốt nhất trong thời gian dài tại nhà.",
  },
  {
    id: 3,
    title: "Ý tưởng bữa sáng lành mạnh cho mỗi buổi sáng",
    slug: "y-tuong-bua-sang-lanh-manh-cho-moi-buoi-sang",
    image: "/img/blog/blog-3.jpg",
    date: "15 Tháng 5, 2026",
    excerpt:
      "Bắt đầu ngày mới đúng cách với những ý tưởng bữa sáng đơn giản, tốt cho sức khỏe, thiết thực và phù hợp với nhịp sống hối hả.",
  },
  {
    id: 4,
    title: "Tại sao thực phẩm hữu cơ ngày càng được ưa chuộng",
    slug: "tai-sao-thuc-pham-huu-co-ngay-cang-duoc-ua-chuong",
    image: "/img/blog/blog-4.jpg",
    date: "18 Tháng 5, 2026",
    excerpt:
      "Thực phẩm hữu cơ đang trở thành xu hướng mạnh mẽ. Hãy cùng tìm hiểu lý do đằng sau sự phổ biến này và ý nghĩa của nó đối với người tiêu dùng.",
  },
  {
    id: 5,
    title: "Cách bảo quản trái cây đúng cách tại nhà",
    slug: "cach-bao-quan-trai-cay-dung-cach-tai-nha",
    image: "/img/blog/blog-5.jpg",
    date: "20 Tháng 5, 2026",
    excerpt:
      "Bảo quản đúng cách giúp trái cây tươi lâu hơn và giữ trọn hương vị. Dưới đây là những mẹo lưu trữ thực tế cho các loại quả phổ biến.",
  },
  {
    id: 6,
    title: "Top 7 thực phẩm giúp tăng cường hệ miễn dịch",
    slug: "top-7-thuc-pham-giup-tang-cuong-he-mien-dich",
    image: "/img/blog/blog-6.jpg",
    date: "22 Tháng 5, 2026",
    excerpt:
      "Một chế độ ăn uống cân bằng có thể hỗ trợ hệ thống miễn dịch của bạn. Đây là 7 nhóm thực phẩm đáng để thêm vào thực đơn hàng ngày.",
  },
  {
    id: 7,
    title: "Lợi ích bất ngờ của việc uống đủ nước mỗi ngày",
    slug: "loi-ich-bat-ngo-cua-viec-uong-du-nuoc-moi-ngay",
    image: "/img/blog/blog-7.jpg",
    date: "25 Tháng 5, 2026",
    excerpt:
      "Nước đóng vai trò quan trọng trong mọi hoạt động của cơ thể. Khám phá những lợi ích tuyệt vời mà thói quen uống đủ nước mang lại cho làn da và sức khỏe.",
  },
  {
    id: 8,
    title: "Nghệ thuật trang trí món ăn đẹp mắt như đầu bếp",
    slug: "nghe-thuat-trang-tri-mon-an-dep-mat-nhu-dau-bep",
    image: "/img/blog/blog-8.jpg",
    date: "28 Tháng 5, 2026",
    excerpt:
      "Món ăn ngon cần đi đôi với trình bày đẹp. Tìm hiểu những quy tắc cơ bản về màu sắc và bố cục để nâng tầm bữa cơm gia đình bạn.",
  },
]);

const totalPages = computed(() => Math.ceil(posts.value.length / perPage));

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return posts.value.slice(start, end);
});

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}
</script>

<template>
  <div id="content" class="site-content">
    <div id="breadcrumb">
      <div class="container">
        <h2 class="title">Blog</h2>

        <ul class="breadcrumb">
          <li><router-link to="/">Trang Chủ</router-link></li>
          <li><span>Blog</span></li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div
          id="left-column"
          class="sidebar col-lg-3 col-md-3 col-sm-3 col-xs-12"
        >
          <BlogSidebar />
        </div>

        <div id="center-column" class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
          <div class="blog-list layout-2">
            <div class="posts-list">
              <BlogCard
                v-for="post in paginatedPosts"
                :key="post.id"
                :post="post"
              />
            </div>

            <div class="pagination-bar">
              <div class="pagination">
                <ul class="page-list">
                  <li>
                    <a
                      href="#"
                      class="prev"
                      @click.prevent="goToPage(currentPage - 1)"
                    >
                      Previous
                    </a>
                  </li>

                  <li v-for="page in totalPages" :key="page">
                    <a
                      href="#"
                      :class="{ current: page === currentPage }"
                      @click.prevent="goToPage(page)"
                    >
                      {{ page }}
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      class="next"
                      @click.prevent="goToPage(currentPage + 1)"
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
