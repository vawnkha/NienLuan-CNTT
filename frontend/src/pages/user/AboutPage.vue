<template>
  <div id="content" class="site-content padding-btm">
    <!-- Breadcrumb -->
    <div id="breadcrumb">
      <div class="container">
        <h2 class="title">Giới Thiệu</h2>

        <ul class="breadcrumb">
          <li><router-link to="/">Trang Chủ</router-link></li>
          <li><span>Giới thiệu</span></li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div class="about-us intro">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div class="intro-header">
                <h3>Chào Mừng Đến Với FreshMart</h3>
                <p>
                  Chúng tôi tự hào là đơn vị cung cấp thực phẩm sạch hàng đầu,
                  mang đến cho gia đình bạn những bữa ăn an toàn, giàu dinh
                  dưỡng và trọn vẹn hương vị tự nhiên từ những nông trại uy tín
                  nhất.
                </p>
              </div>
            </div>

            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <div class="intro-left">
                <div class="intro-item">
                  <p><img src="/img/intro-icon-1.png" alt="Intro Image" /></p>
                  <h4>Luôn Tươi Ngon</h4>
                  <p>
                    Sản phẩm được nhập mới mỗi ngày, đảm bảo độ tươi tối đa khi
                    đến tay người tiêu dùng.
                  </p>
                </div>

                <div class="intro-item">
                  <p><img src="/img/intro-icon-3.png" alt="Intro Image" /></p>
                  <h4>Tốt Cho Sức Khỏe</h4>
                  <p>
                    Thực phẩm không chỉ sạch mà còn chứa hàm lượng dinh dưỡng
                    cao, giúp tăng cường sức đề kháng.
                  </p>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <div class="effect">
                <a href="#">
                  <img
                    class="img-responsive"
                    src="/img/intro-1.png"
                    alt="Intro Image"
                  />
                </a>
              </div>
            </div>

            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <div class="intro-right">
                <div class="intro-item">
                  <p><img src="/img/intro-icon-2.png" alt="Intro Image" /></p>
                  <h4>100% Tự Nhiên</h4>
                  <p>
                    Cam kết không sử dụng hóa chất bảo quản hay thuốc trừ sâu
                    độc hại, an toàn tuyệt đối.
                  </p>
                </div>

                <div class="intro-item">
                  <p><img src="/img/intro-icon-4.png" alt="Intro Image" /></p>
                  <h4>Chất Lượng Thượng Hạng</h4>
                  <p>
                    Quy trình tuyển chọn và kiểm soát chất lượng nghiêm ngặt
                    theo tiêu chuẩn quốc tế.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
[class~="home-1"] [class~="about-us"] {
  margin-top: 0;
  padding-top: 0;
}
.padding-btm {
  padding-bottom: 0;
}
</style>
