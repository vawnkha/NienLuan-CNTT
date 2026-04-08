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
    if (typeof images === "string" && images.trim() !== "") {
      return [images.trim()];
    }
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
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  buildWordRegex(word = "") {
    const escaped = this.escapeRegex(this.normalizeText(word));
    return new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "i");
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
      price: Number(payload.price || 0),
      stock: Number(payload.stock || 0),
      status: this.compluteStatus(payload.stock),
      unit: payload.unit,
      description: payload.description,
      thumbnail: payload.thumbnail,
      images: this.normalizeImages(payload.images).slice(0, 4),
      search_text: this.buildSerchText({
        name: payload.name,
        description: payload.description,
      }),
      created_at: new Date(),
      updated_at: new Date(),
    };

    Object.keys(product).forEach((key) => {
      if (product[key] === undefined) delete product[key];
    });

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
      price: payload.price !== undefined ? Number(payload.price) : undefined,
      stock: payload.stock !== undefined ? Number(payload.stock) : undefined,
      unit: payload.unit,
      description: payload.description,
      thumbnail: payload.thumbnail,
      images: payload.images
        ? this.normalizeImages(payload.images).slice(0, 4)
        : undefined,
      updated_at: new Date(),
    };

    if (payload.stock !== undefined) {
      product.status = this.compluteStatus(payload.stock);
    }

    Object.keys(product).forEach((key) => {
      if (product[key] === undefined) delete product[key];
    });

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
      name: { $regex: new RegExp(this.escapeRegex(name), "i") },
    });
  }

  buildSearchFilter(query = {}) {
    const q = (
      query.q ||
      query.name ||
      query.search ||
      query.keyword ||
      ""
    ).trim();

    const categoryId = query.category_id;
    const filter = {};

    if (q) {
      const normalizedQ = this.normalizeText(q);
      const tokens = normalizedQ.split(" ").filter(Boolean);
      const searchableFields = ["search_text", "name", "description"];

      filter.$and = tokens.map((token) => {
        const wordRegex = this.buildWordRegex(token);

        return {
          $or: searchableFields.map((field) => ({
            [field]: { $regex: wordRegex },
          })),
        };
      });
    }

    if (categoryId !== undefined && categoryId !== "") {
      filter.category_id = ObjectId.isValid(categoryId)
        ? new ObjectId(categoryId)
        : null;
    }

    return filter;
  }

  buildPopulatePipeline({ match = {}, skip = 0, limit = 10 } = {}) {
    return [
      { $match: match },
      { $sort: { created_at: -1 } },

      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "reviews",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$product_id", "$$productId"] },
              },
            },
            {
              $group: {
                _id: "$product_id",
                total_reviews: { $sum: 1 },
                average_rating: { $avg: "$rating" },
              },
            },
          ],
          as: "review_stats",
        },
      },
      {
        $unwind: {
          path: "$review_stats",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          category_name: "$category.name",
          category_slug: "$category.slug",
          average_rating: {
            $ifNull: [{ $round: ["$review_stats.average_rating", 1] }, 0],
          },
          total_reviews: {
            $ifNull: ["$review_stats.total_reviews", 0],
          },
        },
      },

      {
        $project: {
          review_stats: 0,
          search_text: 0,
        },
      },

      { $skip: skip },
      { $limit: limit },
    ];
  }

  async findByCategoryId(categoryId, query = {}) {
    const category_id = ObjectId.isValid(categoryId)
      ? new ObjectId(categoryId)
      : null;

    const { page, limit, skip } = buildPagination(query);
    const filter = { category_id };
    const total = await this.count(filter);

    const data = await this.Product.aggregate(
      this.buildPopulatePipeline({
        match: filter,
        skip,
        limit,
      }),
    ).toArray();

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
    const filter = this.buildSearchFilter(query);
    const total = await this.count(filter);

    const data = await this.Product.aggregate(
      this.buildPopulatePipeline({
        match: filter,
        skip,
        limit,
      }),
    ).toArray();

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
    const _id = ObjectId.isValid(id) ? new ObjectId(id) : null;

    const result = await this.Product.aggregate([
      { $match: { _id } },

      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "reviews",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$product_id", "$$productId"] },
              },
            },
            { $sort: { created_at: -1 } },
            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                user_id: 1,
                product_id: 1,
                rating: 1,
                comment: 1,
                created_at: 1,
                user_name: "$user.name",
                user_email: "$user.email",
                user_avatar: "$user.avatar_url",
              },
            },
          ],
          as: "reviews",
        },
      },

      {
        $addFields: {
          category_name: "$category.name",
          category_slug: "$category.slug",
          total_reviews: { $size: "$reviews" },
          average_rating: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              {
                $round: [
                  {
                    $avg: {
                      $map: {
                        input: "$reviews",
                        as: "review",
                        in: "$$review.rating",
                      },
                    },
                  },
                  1,
                ],
              },
              0,
            ],
          },
        },
      },

      {
        $project: {
          search_text: 0,
        },
      },
    ]).toArray();

    return result[0] || null;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const current = await this.Product.findOne(filter);
    if (!current) return null;

    const update = this.extractUpdateData(payload);

    if (payload.name !== undefined || payload.description !== undefined) {
      update.search_text = this.buildSerchText({
        name: payload.name ?? current.name ?? "",
        description: payload.description ?? current.description ?? "",
      });
    }

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
}

module.exports = ProductsService;
