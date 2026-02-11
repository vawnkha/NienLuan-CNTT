const { ObjectId } = require("mongodb");

class CategoriesService {
  constructor(client) {
    this.Category = client.db().collection("categories");
    this.Category.createIndex({ slug: 1 }, { unique: true });
    this.Category.createIndex({ created_at: -1 });
  }
  extractData(payload) {
    const category = {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      image_url: payload.image_url,
      created_at: new Date(),
      updated_at: new Date(),
    };
    Object.keys(category).forEach(
      (key) => category[key] === undefined && delete category[key],
    );
    return category;
  }

  async create(payload) {
    const data = this.extractData(payload);
    const result = await this.Category.insertOne(data);
    return result;
  }

  async find(filter) {
    const cursor = await this.Category.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findBySlug(slug) {
    return this.Category.findOne({ slug });
  }

  async findById(id) {
    return this.Category.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractData(payload);
    const result = await this.Category.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" },
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.Category.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = CategoriesService;
