const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class UserService {
  constructor(client) {
    this.User = client.db().collection("users");
    this.User.createIndex({ email: 1 }, { unique: true });
    this.User.createIndex({ created_at: -1 });
  }

  extractData(payload) {
    const user = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      avatar_url: payload.avatar_url,
      address: payload.address,
      role: payload.role || "user",
      oauth: { google_id: payload.oauth.google_id },
      status: payload.status || "pending",
      activation_token: payload.activation_token,
      created_at: new Date(),
      updated_at: new Date(),
    };

    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key],
    );
    return user;
  }

  async create(payload) {}

  async findById(id) {}

  async findByEmail(email) {}

  async find(filter = {}, options = {}) {}

  async update(id, payload) {}

  async updateStatus(id, status) {}

  async delete(id) {}
}

module.exports = UserService;
