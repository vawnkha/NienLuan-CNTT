import api from "./api.service";

class ContactService {
  constructor(baseUrl = "/api/contacts") {
    this.api = api(baseUrl);
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async reply(id, data) {
    return (await this.api.patch(`/${id}/reply`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new ContactService();
