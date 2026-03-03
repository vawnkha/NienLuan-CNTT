const { ObjectId } = require("mongodb");
const { buildPagination } = require("../utils/pagination.util");

class ProductsService {
  constructor(client) {
    this.Product = client.db().collection("products");
    this.Product.createIndex({ created_at: -1 });
    this.Product.createIndex({ category_id: 1 });
    this.Product.createIndex({ name: "text", description: "text" });
  }

  normalizeImages(images) {
    if (!images) return [];
    if (Array.isArray(images)) return images.filter(Boolean);
    if (typeof images === "string" && images.trim() !== "")
      return [images.trim()];
    return [];
  }

  normalizeText(str = "") {
    return String(str)
      .toLocaleLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s+/g, " ")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim();
  }

  buildSerchText({ name = "", description = "" } = {}) {
    const base = this.normalizeText(`${name} ${description}`);
    const noSpace = base.replace(/\s/g, "");
    return `${base} ${noSpace}`.trim();
  }

  escapeRegex(s = "") {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  compluteStatus(stock) {
    const n = Number(stock);
    if (!Number.isFinite(n) || n <= 0) return "out_stock";
    return "in_stock";
  }

  extractCreateData(payload) {
    const product = {
      name: payload.name,
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
      search_text: this.buildSerchText({
        name: payload.name,
        description: payload.description,
      }),
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
    const nextName = payload.name;
    const nextDescription = payload.description;
    if (nextName !== undefined || nextDescription !== undefined) {
      product.search_text = this.buildSerchText({
        name: nextName ?? "",
        description: nextDescription ?? "",
      });
    }
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

  async count(filter = {}) {
    return await this.Product.countDocuments(filter);
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findByCategoryId(categoryId, query = {}) {
    const category_id = ObjectId.isValid(categoryId)
      ? new ObjectId(categoryId)
      : null;
    const { page, limit, skip } = buildPagination(query);
    const filter = { category_id };
    const total = await this.count(filter);
    const data = await this.Product.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async search(query = {}) {
    const { page, limit, skip } = buildPagination(query);

    const q = (query.q || query.name || "").trim();
    const categoryId = query.category_id;
    const filter = {};
    if (q) {
      const n = this.normalizeText(q);
      const noSpace = n.replace(/\s/g, "");
      const tokens = n.split(" ").filter(Boolean);

      const p1 = new RegExp(this.escapeRegex(n), "i");
      const p2 = new RegExp(this.escapeRegex(noSpace), "i");
      const p3 = tokens.map((t) => new RegExp(this.escapeRegex(t), "i"));
      let pFuzzy = null;
      if (noSpace.length >= 2 && noSpace.length <= 30) {
        const fuzzy = noSpace.split("").map(this.escapeRegex).join(".*");
        pFuzzy = new RegExp(fuzzy, "i");
      }
      filter.$or = [
        { search_text: { $regex: p1 } },
        { search_text: { $regex: p2 } },
        ...(pFuzzy ? [{ search_text: { $regex: pFuzzy } }] : []),
        ...p3.map((rx) => ({ search_text: { $regex: rx } })),
      ];
    }
    if (categoryId !== undefined && categoryId !== "") {
      filter.category_id = ObjectId.isValid(categoryId)
        ? new ObjectId(categoryId)
        : null;
    }
    const total = await this.count(filter);
    const data = await this.Product.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
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

  // async addImages(id, imageUrls = []) {
  //   const imgs = (this.normalizeImages(imageUrls) || []).slice(0, 4);
  //   if (imgs.length === 0) return null;
  //   const filter = {
  //     _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  //     $expr: {
  //       $lte: [
  //         { $add: [{ $size: { $ifNull: ["$images", []] } }, imgs.length] },
  //         4,
  //       ],
  //     },
  //   };
  //   const result = await this.Product.findOneAndUpdate(
  //     filter,
  //     { $push: { images: { $each: imgs } }, $set: { updated_at: new Date() } },
  //     { returnDocument: "after" },
  //   );
  //   return result;
  // }

  // async removeImage(id, imageUrl) {
  //   const filter = {
  //     _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  //   };
  //   return await this.Product.findOneAndUpdate(
  //     filter,
  //     { $pull: { images: imageUrl }, $set: { updated_at: new Date() } },
  //     { returnDocument: "after" },
  //   );
  // }

  // async swapImange(id, oldUrl, newUrl) {
  //   const filter = {
  //     _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  //     images: oldUrl,
  //   };
  //   return await this.Product.findOneAndUpdate(
  //     filter,
  //     { $set: { "images.$": newUrl, updated_at: new Date() } },
  //     { returnDocument: "after" },
  //   );
  // }

  // async replaceImages(id, imanges) {
  //   const filter = {
  //     _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  //   };
  //   const imgs = this.normalizeImages(images).slice(0, 4);
  //   return await this.Product.findOneAndUpdate(
  //     filter,
  //     { $set: { images: imgs, updated_at: new Date() } },
  //     { returnDocument: "after" },
  //   );
  // }

  // async updateThumbnail(id, thumbnailUrl) {
  //   const filter = {
  //     _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  //   };
  //   return await this.Product.findOneAndUpdate(
  //     filter,
  //     { $set: { thumbnail: thumbnailUrl, updated_at: new Date() } },
  //     { returnDocument: "after" },
  //   );
  // }
}
module.exports = ProductsService;
