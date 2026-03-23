import api from "./api.service";

class ReviewService {
  constructor(baseUrl = "/api/reviews") {
    this.api = api(baseUrl);
  }

  async getByProduct(productId) {
    const res = await this.api.get(`/product/${productId}`);
    return res.data;
  }

  async canReview(userId, productId) {
    const res = await this.api.get(`/can-review/${userId}/${productId}`);
    return res.data;
  }

  async create(data) {
    const res = await this.api.post("/", data);
    return res.data;
  }
}

export default new ReviewService();
