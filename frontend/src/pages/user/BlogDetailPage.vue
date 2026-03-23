<script setup>
import BlogSidebar from "@/components/user/blog/BlogSidebar.vue";
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
          <div class="blog-detail">
            <div class="post-item">
              <div class="post-image">
                <img
                  class="img-responsive"
                  src="/img/blog/blog-1.jpg"
                  alt="Blog Image"
                />
              </div>

              <h1 class="post-title">
                5 Loại Trái Cây Tốt Nhất Giúp Bạn Luôn Tươi Trẻ Và Khỏe Mạnh
              </h1>

              <div class="post-content border-bottom">
                <p>
                  Chế độ ăn uống đóng vai trò then chốt trong việc duy trì năng
                  lượng và vẻ ngoài rạng rỡ. Việc bổ sung trái cây tươi không
                  chỉ cung cấp vitamin thiết yếu mà còn giúp cơ thể thanh lọc,
                  tăng cường sức đề kháng từ bên trong. Mỗi loại quả đều mang
                  trong mình những dưỡng chất quý giá, giúp nuôi dưỡng làn da và
                  cải thiện hệ tiêu hóa một cách tự nhiên nhất.
                </p>
                <h5>Dưới đây là những nội dung chi tiết:</h5>
                <p>
                  Việc lựa chọn thực phẩm sạch, nguồn gốc rõ ràng là bước đầu
                  tiên để bảo vệ sức khỏe gia đình. Không chỉ dừng lại ở hương
                  vị thơm ngon, các loại trái cây này còn chứa hàm lượng chất
                  chống oxy hóa cao, giúp ngăn ngừa lão hóa và mang lại cảm giác
                  nhẹ nhàng cho cơ thể sau những giờ làm việc căng thẳng. Hãy
                  cùng chúng tôi điểm qua chi tiết những lợi ích tuyệt vời mà
                  chúng mang lại ngay sau đây.
                </p>
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <img
                      class="img-responsive"
                      src="/img/blog/blog-detail-1.jpg"
                      alt=""
                    />
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <img
                      class="img-responsive"
                      src="/img/blog/blog-detail-2.jpg"
                      alt=""
                    />
                  </div>
                </div>
                <p>
                  Chế độ dinh dưỡng hợp lý không chỉ mang lại nguồn năng lượng
                  dồi dào mà còn giúp cơ thể duy trì trạng thái cân bằng, đẩy
                  lùi bệnh tật. Việc lựa chọn thực phẩm tươi sạch mỗi ngày chính
                  là chìa khóa để bảo vệ sức khỏe cho cả gia đình. Chúng tôi tin
                  rằng, một bữa ăn ngon phải đi đôi với sự an toàn và giá trị
                  dinh dưỡng thuần khiết nhất. Những loại rau củ quả mọng nước,
                  thực phẩm hữu cơ không chất bảo quản sẽ giúp thanh lọc cơ thể,
                  cải thiện làn da và nâng cao chất lượng cuộc sống của bạn một
                  cách tự nhiên.
                </p>
              </div>

              <div class="post-meta border-bottom">
                <div class="post-info">
                  <span class="date item"
                    ><i class="zmdi zmdi-calendar-note"></i>14 Mar, 2018</span
                  >
                  <span class="comment item"
                    ><i class="zmdi zmdi-comments"></i>2 Bình Luận</span
                  >
                  <span class="author item"
                    ><i class="zmdi zmdi-account"></i>Ivan</span
                  >
                </div>

                <div class="post-share">
                  <div class="item">
                    <a href="#"
                      ><i class="zmdi zmdi-share" aria-hidden="true"></i
                      ><span class="text">Chia sẻ</span></a
                    >
                  </div>
                  <div class="item">
                    <a href="#"
                      ><i class="zmdi zmdi-email" aria-hidden="true"></i
                      ><span class="text">Gửi cho bạn bè</span></a
                    >
                  </div>
                  <div class="item">
                    <a href="#"
                      ><i class="zmdi zmdi-print" aria-hidden="true"></i
                      ><span class="text">In</span></a
                    >
                  </div>
                </div>
              </div>

              <div class="post-author d-flex">
                <div class="author-left">
                  <div class="avatar">
                    <img
                      src="/img/avatar.jpg"
                      alt=""
                      width="100"
                      height="100"
                    />
                  </div>
                </div>
                <div class="author-body">
                  <div class="author-meta">
                    <span class="name">Ivan</span> |
                    <span class="role">Người dùng</span>
                  </div>
                  <div class="author-info">
                    Hãy nhìn vào ánh hoàng hôn kia mà xem, cuộc sống này thật
                    tuyệt vời, cuộc sống thật tươi đẹp; đời là do chính tay bạn
                    nhào nặn nên. Để thành công, trước hết bạn phải có lòng tin.
                    Khi đã tin tưởng, bạn chắc chắn sẽ thành công. Trên đường
                    đời sẽ luôn có những rào cản, nhưng chúng ta sẽ vượt qua tất
                    cả thôi. Hãy ăn mừng chiến thắng một cách xứng đáng, đó là
                    con đường duy nhất. Các quý cô cứ luôn hỏi: 'Ivan, sao anh
                    thơm thế?', tôi chẳng dùng nước hoa đâu nhé. Bí kíp nằm ở bơ
                    ca cao đấy!
                  </div>
                </div>
              </div>

              <div class="clear"></div>

              <div class="latest-news layout-2">
                <div class="block-title">
                  <h2 class="title"><span>Tin</span> liên quan</h2>
                </div>

                <div class="block-content">
                  <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                      <div class="blog-item">
                        <div class="blog-image">
                          <a href="#" class="zoom-effect">
                            <img src="/img/blog/blog-1.jpg" alt="Blog Image" />
                          </a>
                        </div>
                        <div class="blog-info">
                          <div class="blog-title">
                            <a href="#"
                              >5 Loại trái cây tốt nhất giúp bạn luôn tươi trẻ
                              và khỏe mạnh</a
                            >
                          </div>
                          <div class="blog-desc">
                            Khám phá những bí quyết dinh dưỡng từ thiên nhiên để
                            tăng cường sức đề kháng, cải thiện làn da và duy trì
                            nguồn năng lượng tích cực mỗi ngày...
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                      <div class="blog-item">
                        <div class="blog-image">
                          <a href="#" class="zoom-effect">
                            <img src="/img/blog/blog-2.jpg" alt="Blog Image" />
                          </a>
                        </div>
                        <div class="blog-info">
                          <div class="blog-title">
                            <a href="#"
                              >5 Loại trái cây tốt nhất giúp bạn luôn tươi trẻ
                              và khỏe mạnh</a
                            >
                          </div>
                          <div class="blog-desc">
                            Khám phá những bí quyết dinh dưỡng từ thiên nhiên để
                            tăng cường sức đề kháng, cải thiện làn da và duy trì
                            nguồn năng lượng tích cực mỗi ngày...
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                      <div class="blog-item">
                        <div class="blog-image">
                          <a href="#" class="zoom-effect">
                            <img src="/img/blog/blog-3.jpg" alt="Blog Image" />
                          </a>
                        </div>
                        <div class="blog-info">
                          <div class="blog-title">
                            <a href="#"
                              >5 Loại trái cây tốt nhất giúp bạn luôn tươi trẻ
                              và khỏe mạnh</a
                            >
                          </div>
                          <div class="blog-desc">
                            Khám phá những bí quyết dinh dưỡng từ thiên nhiên để
                            tăng cường sức đề kháng, cải thiện làn da và duy trì
                            nguồn năng lượng tích cực mỗi ngày...
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="post-reviews reviews">
                <div class="comments-list">
                  <div class="block-title">
                    <h2 class="title"><span>Bình Luận</span></h2>
                  </div>

                  <div class="item d-flex">
                    <div class="comment-left">
                      <div class="avatar">
                        <img
                          src="/img/avatar.jpg"
                          alt=""
                          width="70"
                          height="70"
                        />
                      </div>
                      <div class="product-rating">
                        <div class="star on"></div>
                        <div class="star on"></div>
                        <div class="star on"></div>
                        <div class="star on"></div>
                        <div class="star on"></div>
                      </div>
                    </div>
                    <div class="comment-body">
                      <div class="comment-meta">
                        <span class="author">Peter</span> -
                        <span class="time">June 02, 2018</span>
                      </div>
                      <div class="comment-content">
                        Hãy nhìn vào ánh hoàng hôn kia mà xem, cuộc sống này
                        thật tuyệt vời, cuộc sống thật tươi đẹp; đời là do chính
                        tay bạn nhào nặn nên. Để thành công, trước hết bạn phải
                        có lòng tin. Khi đã tin tưởng, bạn chắc chắn sẽ thành
                        công. Trên đường đời sẽ luôn có những rào cản, nhưng
                        chúng ta sẽ vượt qua tất cả thôi. Hãy ăn mừng chiến
                        thắng một cách xứng đáng, đó là con đường duy nhất. Các
                        quý cô cứ luôn hỏi: 'Ivan, sao anh thơm thế?', tôi chẳng
                        dùng nước hoa đâu nhé. Bí kíp nằm ở bơ ca cao đấy!
                      </div>
                    </div>
                  </div>

                  <div class="item d-flex">
                    <div class="comment-left">
                      <div class="avatar">
                        <img
                          src="/img/avatar.jpg"
                          alt=""
                          width="70"
                          height="70"
                        />
                      </div>
                      <div class="product-rating">
                        <div class="star on"></div>
                        <div class="star on"></div>
                        <div class="star on"></div>
                        <div class="star on"></div>
                        <div class="star"></div>
                      </div>
                    </div>
                    <div class="comment-body">
                      <div class="comment-meta">
                        <span class="author">Merry</span> -
                        <span class="time">June 17, 2018</span>
                      </div>
                      <div class="comment-content">
                        Hãy nhìn vào ánh hoàng hôn kia mà xem, cuộc sống này
                        thật tuyệt vời, cuộc sống thật tươi đẹp; đời là do chính
                        tay bạn nhào nặn nên. Để thành công, trước hết bạn phải
                        có lòng tin. Khi đã tin tưởng, bạn chắc chắn sẽ thành
                        công. Trên đường đời sẽ luôn có những rào cản, nhưng
                        chúng ta sẽ vượt qua tất cả thôi. Hãy ăn mừng chiến
                        thắng một cách xứng đáng, đó là con đường duy nhất. Các
                        quý cô cứ luôn hỏi: 'Ivan, sao anh thơm thế?', tôi chẳng
                        dùng nước hoa đâu nhé. Bí kíp nằm ở bơ ca cao đấy!
                      </div>
                    </div>
                  </div>
                </div>

                <div class="review-form">
                  <div class="block-title">
                    <h2 class="title">Gửi <span>bình luận</span></h2>
                  </div>

                  <form action="#" method="post" class="form-validate">
                    <div class="form-group">
                      <div class="text">Đánh Giá</div>
                      <div class="product-rating">
                        <div class="star"></div>
                        <div class="star"></div>
                        <div class="star"></div>
                        <div class="star"></div>
                        <div class="star"></div>
                      </div>
                    </div>

                    <div class="form-group">
                      <div class="text">
                        Nội Dung Bình Luận<sup class="required">*</sup>
                      </div>
                      <textarea
                        id="comment"
                        name="comment"
                        cols="45"
                        rows="6"
                        aria-required="true"
                      ></textarea>
                    </div>

                    <div class="form-group">
                      <button class="btn btn-primary">Gửi Bình Luận</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
