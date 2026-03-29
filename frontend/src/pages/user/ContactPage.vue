<script setup>
import { reactive, ref } from "vue";
import contactService from "@/services/contact.service";

const contactForm = reactive({
  name: "",
  email: "",
  subject: "",
  content: "",
});

const submitting = ref(false);

async function handleSubmit() {
  if (
    !contactForm.name.trim() ||
    !contactForm.email.trim() ||
    !contactForm.subject.trim() ||
    !contactForm.content.trim()
  ) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  try {
    submitting.value = true;

    await contactService.create({
      name: contactForm.name,
      email: contactForm.email,
      subject: contactForm.subject,
      content: contactForm.content,
    });

    alert("Gửi liên hệ thành công");

    contactForm.name = "";
    contactForm.email = "";
    contactForm.subject = "";
    contactForm.content = "";
  } catch (error) {
    alert(error?.response?.data?.message || "Không thể gửi liên hệ");
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div id="content" class="site-content">
    <div id="breadcrumb">
      <div class="container">
        <h2 class="title">Liên Hệ</h2>

        <ul class="breadcrumb">
          <li><router-link to="/">Trang Chủ</router-link></li>
          <li><span>Liên Hệ</span></li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div class="contact-page">
        <div class="contact-info">
          <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <div class="item d-flex">
                <div class="item-left">
                  <div class="icon"><i class="zmdi zmdi-email"></i></div>
                </div>
                <div class="item-right d-flex">
                  <div class="title">Email:</div>
                  <div class="content">
                    <a href="mailto:nvkha@gmail.com">nvkha@gmail.com</a><br />
                    <a href="mailto:nvkha@gmail.com">nvkha@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <div class="item d-flex justify-content-center">
                <div class="item-left">
                  <div class="icon"><i class="zmdi zmdi-home"></i></div>
                </div>
                <div class="item-right d-flex">
                  <div class="title">Địa Chỉ:</div>
                  <div class="content">
                    Khu 2, Đ. 3/2, P. Ninh Kiều, TP. Cần Thơ
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <div class="item d-flex justify-content-end">
                <div class="item-left">
                  <div class="icon"><i class="zmdi zmdi-phone"></i></div>
                </div>
                <div class="item-right d-flex">
                  <div class="title">Holine:</div>
                  <div class="content">
                    0123456789<br />
                    0987654321
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="contact-map">
          <div
            id="map"
            style="
              width: 100%;
              min-height: 420px;
              background: #f5f5f5;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <span>Map placeholder</span>
          </div>

          <div class="hidden-lg hidden-md hidden-sm hidden-xs contact-address">
            Khu 2, Đ. 3/2, P. Ninh Kiều, TP. Cần Thơ
          </div>
        </div> -->

        <div class="contact-intro">
          <p>
            "Sức khỏe của khách hàng là ưu tiên hàng đầu của chúng tôi.
            FreshMart luôn nỗ lực không ngừng để cải thiện chất lượng dịch vụ,
            từ khâu sản xuất đến tận tay người tiêu dùng, đảm bảo giữ trọn vẹn
            hương vị tự nhiên và giá trị dinh dưỡng cao nhất trong từng sản phẩm
            cung cấp."
          </p>
          <img src="/img/contact-icon.png" alt="Contact Comment" />
        </div>

        <div class="contact-form form">
          <form @submit.prevent="handleSubmit">
            <div class="form-group row">
              <div class="col-md-6">
                <input
                  v-model="contactForm.name"
                  type="text"
                  name="name"
                  placeholder="HỌ TÊN"
                />
              </div>

              <div class="col-md-6">
                <input
                  v-model="contactForm.email"
                  type="email"
                  name="email"
                  placeholder="EMAIL"
                />
              </div>
            </div>

            <div class="form-group">
              <input
                v-model="contactForm.subject"
                type="text"
                name="subject"
                placeholder="CHỦ ĐỀ"
              />
            </div>

            <div class="form-group">
              <textarea
                v-model="contactForm.content"
                rows="10"
                name="content"
                placeholder="NỘI DUNG"
              ></textarea>
            </div>

            <div class="form-group text-center">
              <input
                type="submit"
                class="btn btn-primary"
                :value="submitting ? 'Đang gửi...' : 'Gửi'"
                :disabled="submitting"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
