import api from "./api.service";

class CategoryService {
  constructor(baseUrl = "/api/categories") {
    this.api = api(baseUrl);
  }

  async getAll(params = {}) {
    const res = await this.api.get("/", { params });
    return res.data;
  }

  async getBySlug(slug) {
    const res = await this.api.get(`/${slug}`);
    return res.data;
  }

  async create(formData) {
    const res = await this.api.post("/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  async update(id, formData) {
    const res = await this.api.put(`/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  async delete(id) {
    const res = await this.api.delete(`/${id}`);
    return res.data;
  }
}

export default new CategoryService();
