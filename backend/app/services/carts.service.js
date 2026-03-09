const { ObjectId } = require("mongodb");
const { update } = require("../controllers/addresses.controller");

class CartService {
  constructor(client) {
    this.Cart = client.db().collection("carts");
    this.Product = client.db().collection("products");
    this.Cart.createIndex({ user_id: 1 }, { unique: true });
    this.Cart.createIndex({ updated_at: -1 });
  }

  async getOrCreate(userId) {
    const uid = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
    let cart = await this.Cart.findOne({ user_id: uid });
    if (cart) return cart;
    const document = { user_id: uid, items: [], updated_at: new Date() };
    await this.Cart.insertOne(document);
    return document;
  }

  async addItem(userId, productId, quantity = 1) {
    const uid = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
    const pid = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!uid || !pid) return { error: "userId hoặc productId không hợp lệ" };
    const q = Math.max(parseInt(quantity, 10) || 1, 1);
    const p = await this.Product.findOne(
      { _id: pid },
      { projection: { stock: 1, name: 1 } },
    );
    if (!p) return { error: "Sản phẩm không tồn tại" };
    const stock = Number(p.stock || 0);
    if (stock <= 0) return { error: "Sản phẩm đã hết hàng" };
    const cart = await this.Cart.findOne(
      { user_id: uid },
      { projection: { items: 1 } },
    );

    const existedItem = cart?.items?.find(
      (it) => String(it.product_id) === String(pid),
    );
    const currentQty = existedItem ? Number(existedItem.quantity || 0) : 0;
    const nextQty = currentQty + q;
    if (nextQty > stock) {
      return {
        error: `Số lượng vượt tồn kho. Hiện còn ${stock} sản phẩm.`,
        stock,
        currentQty,
        requestedQty: q,
        nextQty,
      };
    }
    if (existedItem) {
      await this.Cart.updateOne(
        { user_id: uid, "items.product_id": pid },
        {
          $inc: { "items.$.quantity": q },
          $set: { updated_at: new Date() },
        },
      );
    } else {
      await this.Cart.updateOne(
        { user_id: uid },
        {
          $setOnInsert: { user_id: uid },
          $push: { items: { product_id: pid, quantity: q } },
          $set: { updated_at: new Date() },
        },
        { upsert: true },
      );
    }
    return { ok: true };
  }

  async updateItem(userId, productId, quantity) {
    const uid = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
    const pid = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    const q = parseInt(quantity, 10);
    if (!Number.isFinite(q) || q < 0) {
      await this.Cart.updateOne(
        { user_id: uid },
        {
          $pull: { items: { product_id: pid } },
          $set: { updated_at: new Date() },
        },
      );
      return { ok: true };
    }

    const product = await this.Product.findOne(
      { _id: pid },
      { projection: { name: 1, stock: 1 } },
    );

    if (!product) {
      return { error: "Sản phẩm không tồn tại" };
    }

    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      return { error: "Sản phẩm đã hết hàng" };
    }

    if (q > stock) {
      return {
        error: `Số lượng vượt tồn kho. Hiện chỉ còn ${stock} sản phẩm.`,
        stock,
        requestedQty: q,
      };
    }

    const rs = await this.Cart.updateOne(
      {
        user_id: uid,
        items: {
          $elemMatch: {
            product_id: pid,
          },
        },
      },
      {
        $set: {
          "items.$.quantity": q,
          updated_at: new Date(),
        },
      },
    );
    if (rs.matchedCount === 0) {
      return { error: "Sản phẩm chưa có trong giỏ hàng" };
    }
    return { ok: true, stock, quantity: q };
  }

  async removeItem(userId, productId) {
    const uid = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
    const pid = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    await this.Cart.updateOne(
      { user_id: uid },
      {
        $pull: { items: { product_id: pid } },
        $set: { updated_at: new Date() },
      },
    );
    return { ok: true };
  }

  async clearCart(userId) {
    const uid = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
    await this.Cart.updateOne(
      { user_id: uid },
      { $set: { items: [], updated_at: new Date() } },
      { upsert: true },
    );
    return { ok: true };
  }

  async getDetailedCart(userId) {
    const uid = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
    const cart = await this.Cart.findOne({ user_id: uid });
    if (!cart) return { items: [], updated_at: null };

    const ids = cart.items.map((i) => i.product_id);
    const products = await this.Product.find({ _id: { $in: ids } })
      .project({ name: 1, price: 1, thumbnail: 1 })
      .toArray();
    const map = new Map(products.map((p) => [String(p._id), p]));
    const items = cart.items
      .map((it) => {
        const p = map.get(String(it.product_id));
        if (!p) return null;
        return {
          product_id: it.product_id,
          quantity: it.quantity,
          name: p.name,
          price: p.price,
          stock: p.stock,
          unit: p.unit,
          thumbnail: p.thumbnail || "",
          line_total: Number(p.price || 0) * Number(it.quantity || 0),
        };
      })
      .filter(Boolean);
    const subtotal = items.reduce((s, i) => s + i.line_total, 0);
    return { items, subtotal, updated_at: cart.updated_at };
  }
}

module.exports = CartService;
