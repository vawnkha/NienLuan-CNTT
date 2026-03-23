<template>
  <footer id="footer">
    <div class="footer">
      <div class="footer-top">
        <div class="container">
          <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <div class="block text">
                <div class="block-content">
                  <router-link to="/" class="logo-footer">
                    <img src="/img/logo-2.png" alt="Logo" />
                  </router-link>

                  <div class="contact">
                    <div class="item d-flex">
                      <div class="item-left">
                        <i class="zmdi zmdi-home"></i>
                      </div>
                      <div class="item-right">
                        <span>Khu 2, Đ. 3/2, P. Ninh Kiều, TP. Cần Thơ</span>
                      </div>
                    </div>

                    <div class="item d-flex">
                      <div class="item-left">
                        <i class="zmdi zmdi-phone-in-talk"></i>
                      </div>
                      <div class="item-right">
                        <span>0123456789<br />0987654321</span>
                      </div>
                    </div>

                    <div class="item d-flex">
                      <div class="item-left">
                        <i class="zmdi zmdi-email"></i>
                      </div>
                      <div class="item-right">
                        <span>
                          <a href="mailto:nvkha@gmail.com">nvkha@gmail.com</a
                          ><br />
                          <a href="mailto:nvkha@gmail.com">nvkha@gmail.com</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <div class="block instagram">
                <h2 class="block-title">Hình Ảnh Instagram</h2>

                <div class="block-content">
                  <div class="row margin-0">
                    <div
                      v-for="n in 8"
                      :key="n"
                      class="col-xs-3 col-sm-3 col-md-3 col-lg-3 padding-0"
                    >
                      <a href="#">
                        <img
                          :src="`/img/instagram-${n}.png`"
                          alt="Instagram Image"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <div class="block newsletter">
                <h2 class="block-title">Đăng Ký Nhận Tin</h2>

                <div class="block-content">
                  <p>
                    Nhập email của bạn để nhận tin tức mỗi ngày và nhận ngay mã
                    giảm giá 20% cho tất cả sản phẩm.
                  </p>

                  <form @submit.prevent>
                    <input type="email" placeholder="Nhập email của bạn" />
                    <button type="submit">Đăng Ký</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container">
          <div class="footer-bottom-inner">
            <div class="row">
              <div class="col-md-6">
                <div class="copyright">© 2026 FreshMart</div>
              </div>
              <div class="col-md-6 text-right">
                <img src="/img/payment.png" alt="Payment" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
