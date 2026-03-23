import api from "./api.service";

class AddressService {
  constructor(baseUrl = "/api/addresses") {
    this.api = api(baseUrl);
  }

  async getByUser(userId) {
    const res = await this.api.get("/", {
      params: { userId },
    });
    return res.data;
  }

  async create(data) {
    const res = await this.api.post("/", data);
    return res.data;
  }

  async update(id, data) {
    const res = await this.api.put(`/${id}`, data);
    return res.data;
  }

  async delete(id) {
    const res = await this.api.delete(`/${id}`);
    return res.data;
  }
}

export default new AddressService();
