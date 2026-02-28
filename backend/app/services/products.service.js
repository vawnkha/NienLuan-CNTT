const { ObjectId } = require("mongodb");

class ProductsService {
  constructor(client) {
    this.Product = client.db().collection("products");
    this.Product.createIndex({ slug: 1 }, { unique: true });
    this.Product.createIndex({ created_at: -1 });
    this.Product.createIndex({ category_id: 1 });
  }

  normalizeImages(images) {
    if (!images) return [];
    if (Array.isArray(images)) return images.filter(Boolean);
    if (typeof images === "string" && images.trim() !== "")
      return [images.trim()];
    return [];
  }

  compluteStatus(stock) {
    const n = Number(stock);
    if (!Number.isFinite(n) || n <= 0) return "out_stock";
    return "in_stock";
  }

  extractCreateData(payload) {
    const product = {
      name: payload.name,
      slug: payload.slug,
      category_id: payload.category_id
        ? ObjectId.isValid(payload.category_id)
          ? new ObjectId(payload.category_id)
          : null
        : undefined,
      price: payload.price,
      stock: payload.stock,
      status: this.compluteStatus(payload.stock),
      unit: payload.unit,
      description: payload.description,
      thumbnail: payload.thumbnail,
      images: (this.normalizeImages(payload.images) || []).slice(0, 4),
      created_at: new Date(),
      updated_at: new Date(),
    };
    Object.keys(product).forEach(
      (key) => product[key] === undefined && delete product[key],
    );
    return product;
  }

  extractUpdateData(payload) {
    const product = {
      name: payload.name,
      slug: payload.slug,
      category_id: payload.category_id
        ? ObjectId.isValid(payload.category_id)
          ? new ObjectId(payload.category_id)
          : null
        : undefined,
      price: payload.price,
      stock: payload.stock,
      status: payload.status,
      unit: payload.unit,
      description: payload.description,
      thumbnail: payload.thumbnail,
      images: payload.images
        ? this.normalizeImages(payload.images).slice(0, 4)
        : [],
      updated_at: new Date(),
    };
    if (payload.stock !== undefined) {
      product.status = this.compluteStatus(payload.stock);
    }
    Object.keys(product).forEach(
      (key) => product[key] === undefined && delete product[key],
    );
    return product;
  }

  async create(payload) {
    const product = this.extractCreateData(payload);
    const result = await this.Product.insertOne(product);
    return { insertedId: result.insertedId, ...product };
  }

  async find(filter = {}, options = {}) {
    const cursor = await this.Product.find(filter, options);
    return await cursor.toArray();
  }
  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findBySlug(slug) {
    return this.Product.findOne({ slug });
  }

  async findById(id) {
    return this.Product.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractUpdateData(payload);
    const result = await this.Product.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" },
    );
    return result;
  }

  async delete(id) {
    const result = await this.Product.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async addImages(id, imageUrls = []) {
    const imgs = (this.normalizeImages(imageUrls) || []).slice(0, 4);
    if (imgs.length === 0) return null;
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
      $expr: {
        $lte: [
          { $add: [{ $size: { $ifNull: ["$images", []] } }, imgs.length] },
          4,
        ],
      },
    };
    const result = await this.Product.findOneAndUpdate(
      filter,
      { $push: { images: { $each: imgs } }, $set: { updated_at: new Date() } },
      { returnDocument: "after" },
    );
    return result;
  }

  async removeImage(id, imageUrl) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    return await this.Product.findOneAndUpdate(
      filter,
      { $pull: { images: imageUrl }, $set: { updated_at: new Date() } },
      { returnDocument: "after" },
    );
  }

  async swapImange(id, oldUrl, newUrl) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
      images: oldUrl,
    };
    return await this.Product.findOneAndUpdate(
      filter,
      { $set: { "images.$": newUrl, updated_at: new Date() } },
      { returnDocument: "after" },
    );
  }

  async replaceImages(id, imanges) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const imgs = this.normalizeImages(images).slice(0, 4);
    return await this.Product.findOneAndUpdate(
      filter,
      { $set: { images: imgs, updated_at: new Date() } },
      { returnDocument: "after" },
    );
  }

  async updateThumbnail(id, thumbnailUrl) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    return await this.Product.findOneAndUpdate(
      filter,
      { $set: { thumbnail: thumbnailUrl, updated_at: new Date() } },
      { returnDocument: "after" },
    );
  }
}
module.exports = ProductsService;
