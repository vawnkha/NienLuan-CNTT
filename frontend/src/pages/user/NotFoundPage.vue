<script>
import "@/assets/css/user/style.css";
import "@/assets/css/user/responsive.css";
</script>

<template>
  <div id="content" class="site-content page-404">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 page-left">
          <div class="image">
            <img
              class="img-responsive"
              src="/img/404-left.png"
              alt="Image 404"
            />
          </div>
          <div class="title">
            Rất tiếc — Đã có lỗi xảy ra từ phía hệ thống của chúng tôi.
          </div>
          <div class="content">
            Nếu sự cố này vẫn tiếp diễn, vui lòng liên hệ với Quản trị viên hệ
            thống để được hỗ trợ và báo cáo lỗi chi tiết bên dưới.
          </div>

          <router-link to="/" class="btn btn-primary"
            ><i class="fa fa-home" aria-hidden="true"></i
            ><span>Quay Lại Trang Chủ</span></router-link
          >
        </div>

        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 page-right">
          <div class="image">
            <img
              class="img-responsive"
              src="/img/404-right.jpg"
              alt="Image 404"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
