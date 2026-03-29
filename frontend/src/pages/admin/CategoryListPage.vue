<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import categoryService from "@/services/category.service";
import AdminPagination from "@/components/common/AdminPagination.vue";

const categories = ref([]);
const keyword = ref("");
const showEditModal = ref(false);
const saving = ref(false);
const preview = ref("");

const currentPage = ref(1);
const pageSize = ref(12);

const editForm = reactive({
  _id: "",
  name: "",
  slug: "",
  description: "",
  image: null,
});

const filteredCategories = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return categories.value;

  return categories.value.filter((item) => {
    return [item.name, item.slug, item.description]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
  });
});

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredCategories.value.slice(start, end);
});

const totalCategories = computed(() => filteredCategories.value.length);
const categoriesWithImage = computed(
  () => filteredCategories.value.filter((item) => !!item.image_url).length,
);
const categoriesWithoutImage = computed(
  () => filteredCategories.value.filter((item) => !item.image_url).length,
);

async function fetchCategories() {
  try {
    const res = await categoryService.getAll();
    categories.value = res?.data || res || [];
  } catch (error) {
    console.error("Lỗi tải danh mục:", error);
    alert(error?.response?.data?.message || "Không thể tải danh sách danh mục");
  }
}

function openEditModal(item) {
  editForm._id = item._id || item.id;
  editForm.name = item.name || "";
  editForm.slug = item.slug || "";
  editForm.description = item.description || "";
  editForm.image = null;
  preview.value = item.image_url || "";
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
}

function onEditImageChange(event) {
  const file = event.target.files?.[0] || null;
  editForm.image = file;
  if (file) preview.value = URL.createObjectURL(file);
}

async function submitEdit() {
  saving.value = true;
  try {
    const data = new FormData();
    data.append("name", editForm.name);
    data.append("slug", editForm.slug);
    data.append("description", editForm.description);
    if (editForm.image) data.append("image", editForm.image);

    await categoryService.update(editForm._id, data);
    showEditModal.value = false;
    await fetchCategories();
    alert("Cập nhật danh mục thành công");
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    alert(error?.response?.data?.message || "Cập nhật danh mục thất bại");
  } finally {
    saving.value = false;
  }
}

async function removeCategory(id) {
  if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

  try {
    await categoryService.delete(id);
    await fetchCategories();
    alert("Xóa danh mục thành công");
  } catch (error) {
    console.error("Lỗi xóa danh mục:", error);
    alert(error?.response?.data?.message || "Xóa danh mục thất bại");
  }
}

watch(keyword, () => {
  currentPage.value = 1;
});

watch(filteredCategories, (list) => {
  const maxPage = Math.max(1, Math.ceil(list.length / pageSize.value));
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage;
  }
});

onMounted(fetchCategories);
</script>

<template>
  <div class="admin-page">
    <div class="admin-page-title admin-page-title--stack">
      <h1>Quản lý danh mục</h1>
      <p>Danh sách tất cả danh mục</p>
    </div>

    <div class="admin-stat-row admin-stat-row--categories">
      <div class="admin-stat-card">
        <div class="admin-stat-card__label">Tổng danh mục</div>
        <div class="admin-stat-card__value">{{ totalCategories }}</div>
      </div>

      <div class="admin-stat-card">
        <div class="admin-stat-card__label">Có hình ảnh</div>
        <div class="admin-stat-card__value">{{ categoriesWithImage }}</div>
      </div>

      <div class="admin-stat-card">
        <div class="admin-stat-card__label">Chưa có hình</div>
        <div class="admin-stat-card__value">{{ categoriesWithoutImage }}</div>
      </div>

      <div class="admin-stat-card">
        <div class="admin-stat-card__label">Đang hiển thị/trang</div>
        <div class="admin-stat-card__value">{{ pageSize }}</div>
      </div>
    </div>

    <section class="admin-panel admin-panel--categories">
      <div class="admin-panel__header admin-panel__header--flex">
        <div>
          <div class="admin-panel__header-title">Danh sách danh mục</div>
          <div class="admin-panel__header-subtitle">
            Trang quản lý danh mục cho phép admin chỉnh sửa và xóa các danh mục
            sản phẩm.
          </div>
        </div>

        <button class="admin-btn admin-btn--secondary" @click="fetchCategories">
          Làm mới
        </button>
      </div>

      <div class="admin-panel__body">
        <div class="admin-toolbar admin-toolbar--single">
          <input
            v-model="keyword"
            type="text"
            class="admin-toolbar__input"
            placeholder="Tìm kiếm"
          />
        </div>

        <div class="admin-export-tools">
          <span>Copy</span>
          <span>CSV</span>
          <span>Excel</span>
          <span>PDF</span>
          <span>Print</span>
        </div>

        <div v-if="!filteredCategories.length" class="admin-empty-state">
          Không có danh mục phù hợp
        </div>

        <div v-else class="table-responsive">
          <table class="admin-table admin-table--categories">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên danh mục</th>
                <th>Slug</th>
                <th>Mô tả</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in paginatedCategories"
                :key="item._id || item.id"
              >
                <td>
                  <div class="admin-category-thumb-wrap">
                    <img
                      v-if="item.image_url"
                      :src="item.image_url"
                      class="admin-thumb admin-thumb--category"
                      :alt="item.name"
                    />
                    <div v-else class="admin-thumb-placeholder">Không ảnh</div>
                  </div>
                </td>

                <td>
                  <div class="admin-category-info">
                    <strong>{{ item.name }}</strong>
                  </div>
                </td>

                <td>
                  <span class="admin-slug">{{ item.slug || "---" }}</span>
                </td>

                <td>
                  <div class="admin-description-cell">
                    {{ item.description || "---" }}
                  </div>
                </td>

                <td>
                  <div class="admin-action-stack admin-action-stack--row">
                    <button
                      class="admin-btn admin-btn--success"
                      @click="openEditModal(item)"
                    >
                      <i class="fa-solid fa-pen-to-square me-1"></i>
                      Chỉnh sửa
                    </button>

                    <button
                      class="admin-btn admin-btn--danger"
                      @click="removeCategory(item._id || item.id)"
                    >
                      <i class="fa-solid fa-xmark me-1"></i>
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <AdminPagination
            v-model="currentPage"
            :total-items="filteredCategories.length"
            :page-size="pageSize"
          />
        </div>
      </div>
    </section>

    <div
      v-if="showEditModal"
      class="admin-modal-mask"
      @click.self="closeEditModal"
    >
      <div class="admin-modal admin-modal--category">
        <div class="admin-modal__header">
          <div class="admin-modal__title">Chỉnh sửa danh mục</div>
          <button
            class="admin-btn admin-btn--secondary"
            @click="closeEditModal"
          >
            ×
          </button>
        </div>

        <div class="admin-modal__body">
          <div class="admin-form__row">
            <label class="admin-form__label">Tên danh mục *</label>
            <input v-model="editForm.name" class="admin-form__control" />
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Slug *</label>
            <input v-model="editForm.slug" class="admin-form__control" />
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Mô tả *</label>
            <textarea
              v-model="editForm.description"
              class="admin-form__textarea"
              rows="5"
            />
          </div>

          <div class="admin-form__row">
            <label class="admin-form__label">Hình ảnh</label>
            <div class="admin-image-block">
              <div v-if="preview" class="admin-image-grid">
                <div class="admin-image-card admin-image-card--large">
                  <div class="admin-image-preview admin-image-preview--large">
                    <img :src="preview" alt="preview-category" />
                  </div>
                  <div class="admin-image-meta">Ảnh xem trước</div>
                </div>
              </div>

              <div v-else class="admin-empty-box admin-empty-box--large">
                Chưa có hình ảnh
              </div>

              <div class="admin-upload-box">
                <input
                  type="file"
                  accept="image/*"
                  @change="onEditImageChange"
                />
                <div class="admin-note mt-2">
                  Chọn ảnh mới để thay thế ảnh danh mục hiện tại.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="admin-modal__footer">
          <button
            class="admin-btn admin-btn--secondary"
            @click="closeEditModal"
          >
            Quay lại
          </button>
          <button
            class="admin-btn admin-btn--primary"
            :disabled="saving"
            @click="submitEdit"
          >
            {{ saving ? "Đang lưu..." : "Chỉnh sửa" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
