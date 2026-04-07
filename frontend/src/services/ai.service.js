import api from "./api.service";

class AIService {
  constructor(baseUrl = "/api/ai") {
    this.api = api(baseUrl);
  }

  async chat(message) {
    const res = await this.api.post("/chat", { message });
    return res.data;
  }
}

export default new AIService();
