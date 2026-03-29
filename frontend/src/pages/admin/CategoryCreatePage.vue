<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import categoryService from "@/services/category.service";

const router = useRouter();
const preview = ref("");

const form = reactive({
  name: "",
  slug: "",
  description: "",
  image: null,
});

function onImageChange(event) {
  const file = event.target.files?.[0];
  form.image = file || null;
  preview.value = file ? URL.createObjectURL(file) : "";
}

async function submitForm() {
  const data = new FormData();
  data.append("name", form.name);
  data.append("slug", form.slug);
  data.append("description", form.description);
  if (form.image) data.append("image", form.image);

  await categoryService.create(data);
  router.push({ name: "admin-categories" });
}
</script>

<template>
  <div>
    <div class="admin-page-title">Tạo Danh Mục</div>

    <section class="admin-panel">
      <div class="admin-panel__header">Thêm Danh Mục Mới</div>
      <div class="admin-panel__body">
        <form class="admin-form" @submit.prevent="submitForm">
          <div class="admin-form__row">
            <label class="admin-form__label">Tên Danh Mục *</label>
            <input v-model="form.name" class="admin-form__control" />
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Slug *</label>
            <input v-model="form.slug" class="admin-form__control" />
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Mô tả *</label>
            <input v-model="form.description" class="admin-form__control" />
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Hình ảnh</label>
            <div>
              <input type="file" @change="onImageChange" />
              <img
                v-if="preview"
                :src="preview"
                style="
                  width: 120px;
                  height: 120px;
                  object-fit: cover;
                  margin-top: 10px;
                  border: 1px solid #ddd;
                "
              />
            </div>
          </div>

          <div class="admin-form__actions">
            <button type="reset" class="admin-btn admin-btn--primary">
              Reset
            </button>
            <button type="submit" class="admin-btn admin-btn--success">
              Thêm Danh Mục
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>
