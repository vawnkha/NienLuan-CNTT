<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import categoryService from "@/services/category.service";
import productService from "@/services/product.service";

const router = useRouter();
const categories = ref([]);
const thumbnailPreview = ref("");
const imagePreviews = ref([]);
const loading = ref(false);

const form = reactive({
  name: "",
  category_id: "",
  description: "",
  price: "",
  stock: "",
  unit: "",
  thumbnail: null,
  images: [],
});

async function fetchCategories() {
  const res = await categoryService.getAll();
  categories.value = res?.data || res || [];
}

function onThumbnailChange(event) {
  const file = event.target.files?.[0] || null;
  form.thumbnail = file;
  thumbnailPreview.value = file ? URL.createObjectURL(file) : "";
}

function onImagesChange(event) {
  const files = Array.from(event.target.files || []).slice(0, 4);
  form.images = files;
  imagePreviews.value = files.map((file) => URL.createObjectURL(file));
}

async function submitForm() {
  loading.value = true;
  try {
    const data = new FormData();
    data.append("name", form.name);
    data.append("category_id", form.category_id);
    data.append("description", form.description);
    data.append("price", String(form.price));
    data.append("stock", String(form.stock));
    data.append("unit", form.unit);

    if (form.thumbnail) {
      data.append("thumbnail", form.thumbnail);
    }

    form.images.forEach((file) => {
      data.append("images", file);
    });

    await productService.create(data);
    router.push({ name: "admin-products" });
  } catch (error) {
    console.error("Lỗi thêm sản phẩm:", error);
    alert(error?.response?.data?.message || "Thêm sản phẩm thất bại");
  } finally {
    loading.value = false;
  }
}

onMounted(fetchCategories);
</script>

<template>
  <div>
    <div class="admin-page-title">Thêm sản phẩm</div>

    <section class="admin-panel">
      <div class="admin-panel__header">Thêm Sản Phẩm Mới</div>

      <div class="admin-panel__body">
        <form class="admin-form" @submit.prevent="submitForm">
          <div class="admin-form__row">
            <label class="admin-form__label">Tên sản phẩm *</label>
            <input v-model="form.name" class="admin-form__control" required />
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Danh mục *</label>
            <select
              v-model="form.category_id"
              class="admin-form__select"
              required
            >
              <option value="">Chọn danh mục</option>
              <option
                v-for="item in categories"
                :key="item._id || item.id"
                :value="item._id || item.id"
              >
                {{ item.name }}
              </option>
            </select>
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Mô tả</label>
            <textarea
              v-model="form.description"
              class="admin-form__textarea"
            ></textarea>
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Giá *</label>
            <input
              v-model="form.price"
              type="number"
              min="0"
              class="admin-form__control"
              required
            />
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Số lượng *</label>
            <input
              v-model="form.stock"
              type="number"
              min="0"
              class="admin-form__control"
              required
            />
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Đơn vị</label>
            <input v-model="form.unit" class="admin-form__control" />
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Ảnh đại diện</label>
            <div>
              <input type="file" accept="image/*" @change="onThumbnailChange" />
              <div v-if="thumbnailPreview" style="margin-top: 10px">
                <img
                  :src="thumbnailPreview"
                  style="
                    width: 110px;
                    height: 110px;
                    object-fit: cover;
                    border: 1px solid #ddd;
                  "
                />
              </div>
            </div>
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Ảnh chi tiết</label>
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                @change="onImagesChange"
              />
              <div
                style="
                  display: flex;
                  gap: 10px;
                  flex-wrap: wrap;
                  margin-top: 10px;
                "
              >
                <img
                  v-for="(img, index) in imagePreviews"
                  :key="index"
                  :src="img"
                  style="
                    width: 110px;
                    height: 110px;
                    object-fit: cover;
                    border: 1px solid #ddd;
                  "
                />
              </div>
            </div>
          </div>

          <div class="admin-form__actions">
            <button type="reset" class="admin-btn admin-btn--secondary">
              Reset
            </button>
            <button
              type="submit"
              class="admin-btn admin-btn--success"
              :disabled="loading"
            >
              {{ loading ? "Đang thêm..." : "Thêm sản phẩm" }}
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>
