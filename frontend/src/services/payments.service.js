import api from "./api.service";

class PaymentService {
  constructor(baseUrl = "/api/payment") {
    this.api = api(baseUrl);
  }

  async createPaypalOrder(orderId) {
    const res = await this.api.post("/create-order", { orderId });
    return res.data;
  }

  async capturePaypalOrder(paypalOrderId) {
    const res = await this.api.post("/capture-order", { paypalOrderId });
    return res.data;
  }
}

export default new PaymentService();
