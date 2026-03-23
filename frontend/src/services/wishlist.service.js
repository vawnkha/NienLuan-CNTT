import api from "./api.service";

class WishlistService {
  constructor(baseUrl = "/api/wishlists") {
    this.api = api(baseUrl);
  }

  async getByUser(userId) {
    const res = await this.api.get(`/${userId}`);
    return res.data;
  }

  async addItem(userId, productId) {
    const res = await this.api.post(`/${userId}/items`, { productId });
    return res.data;
  }

  async toggleItem(userId, productId) {
    const res = await this.api.patch(`/${userId}/items/${productId}/toggle`);
    return res.data;
  }

  async removeItem(userId, productId) {
    const res = await this.api.delete(`/${userId}/items/${productId}`);
    return res.data;
  }

  async clear(userId) {
    const res = await this.api.delete(`/${userId}/items`);
    return res.data;
  }
}

export default new WishlistService();
