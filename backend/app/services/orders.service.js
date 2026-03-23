const { ObjectId } = require("mongodb");

class OrdersService {
  constructor(client) {
    this.Order = client.db().collection("orders");
    this.Cart = client.db().collection("carts");
    this.Product = client.db().collection("products");
    this.Address = client.db().collection("addresses");
    this.Payment = client.db().collection("payments");

    this.Order.createIndex({ user_id: 1, created_at: -1 });
    this.Order.createIndex({ status: 1, created_at: -1 });
  }

  timelineItem(status, note = "") {
    return { status, changed_at: new Date(), note };
  }

  mapStatusText(status) {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipping":
        return "Đang giao";
      case "completed":
        return "Hoàn thành";
      case "canceled":
        return "Đã hủy";
      default:
        return status || "";
    }
  }

  mapPaymentMethod(method) {
    if (!method) return "cod";
    return method === "cash" ? "cod" : method;
  }

  normalizeOrder(doc) {
    return {
      _id: doc._id,
      user_id: doc.user_id,

      status: doc.status,
      status_text: this.mapStatusText(doc.status),

      payment_method: this.mapPaymentMethod(doc.payment?.method),

      total_price: Number(doc.total_price || 0),

      created_at: doc.created_at,

      items: (doc.items || []).map((it) => ({
        product_id: it.product_id,
        name: it.name,
        quantity: it.quantity,
        price: it.price,
        thumbnail: it.thumbnail,
        subtotal: it.price * it.quantity,
      })),

      shipping_address: doc.address
        ? {
            _id: doc.address._id,
            fullName:
              doc.address.fullName ||
              doc.address.full_name ||
              doc.address.name ||
              "",
            address: doc.address.address_line || "",
            city: doc.address.city || "",
            phone: doc.address.phone || "",
          }
        : null,

      timeline: doc.timeline || [],
    };
  }

  async deductStockForOrderItems(orderItems) {
    for (const it of orderItems) {
      const rs = await this.Product.updateOne(
        { _id: it.product_id, stock: { $gte: it.quantity } },
        {
          $inc: { stock: -it.quantity },
          $set: { updated_at: new Date() },
        },
      );

      if (rs.modifiedCount !== 1) {
        return {
          error: `Không trừ tồn kho cho "${it.name}" (có thể vừa hết hàng)`,
        };
      }
    }

    return { ok: true };
  }

  async findByUser(userId) {
    const uid = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
    if (!uid) return [];

    const docs = await this.Order.aggregate([
      { $match: { user_id: uid } },

      {
        $lookup: {
          from: "addresses",
          localField: "address_id",
          foreignField: "_id",
          as: "address",
        },
      },
      { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "order_id",
          as: "payment",
        },
      },
      { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },

      { $sort: { created_at: -1 } },
    ]).toArray();

    return docs.map((doc) => this.normalizeOrder(doc));
  }

  async clearUserCart(userId) {
    await this.Cart.updateOne(
      { user_id: userId },
      { $set: { items: [], updated_at: new Date() } },
    );
  }

  async createFromCart({ userId, addressId, payment_method }) {
    const uid = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
    const aid = ObjectId.isValid(addressId) ? new ObjectId(addressId) : null;
    const method = payment_method || "cash";

    if (!uid || !aid) {
      return { error: "userId và addressId không hợp lệ" };
    }

    const cart = await this.Cart.findOne({ user_id: uid });
    if (!cart || !cart.items?.length) {
      return { error: "Giỏ hàng trống" };
    }

    const address = await this.Address.findOne({ _id: aid, user_id: uid });
    if (!address) {
      return { error: "Địa chỉ giao hàng không hợp lệ" };
    }

    const ids = cart.items.map((i) => i.product_id);
    const products = await this.Product.find({ _id: { $in: ids } })
      .project({ name: 1, price: 1, stock: 1, thumbnail: 1 })
      .toArray();

    const map = new Map(products.map((p) => [String(p._id), p]));

    let total = 0;
    const orderItems = [];

    for (const it of cart.items) {
      const p = map.get(String(it.product_id));
      if (!p) continue;

      const qty = Math.max(parseInt(it.quantity, 10) || 1, 1);
      if (Number(p.stock || 0) < qty) {
        return { error: `Sản phẩm "${p.name}" không đủ tồn kho` };
      }

      const price = Number(p.price || 0);
      total += price * qty;

      orderItems.push({
        product_id: p._id,
        name: p.name,
        quantity: qty,
        price,
        thumbnail: p.thumbnail || "",
      });
    }

    if (!orderItems.length) {
      return { error: "Giỏ hàng không hợp lệ" };
    }

    const initialStatus = method === "cash" ? "processing" : "pending";
    const orderDoc = {
      user_id: uid,
      items: orderItems,
      address_id: aid,
      total_price: total,
      status: initialStatus,
      timeline: [
        this.timelineItem("pending", "Tạo đơn hàng"),
        ...(method === "cash"
          ? [this.timelineItem("processing", "Đơn COD đã được xác nhận")]
          : []),
      ],
      created_at: new Date(),
    };

    const orderRs = await this.Order.insertOne(orderDoc);

    const paymentDoc = {
      order_id: orderRs.insertedId,
      method,
      transaction_id: null,
      amount: total,
      status: method === "cash" ? "pending" : "pending",
      paid_at: null,
      created_at: new Date(),
    };

    const paymentRs = await this.Payment.insertOne(paymentDoc);

    if (method === "cash") {
      const stockRs = await this.deductStockForOrderItems(orderItems);

      if (stockRs?.error) {
        await this.Payment.updateOne(
          { _id: paymentRs.insertedId },
          { $set: { status: "failed" } },
        );

        await this.Order.updateOne(
          { _id: orderRs.insertedId },
          {
            $set: { status: "canceled" },
            $push: {
              timeline: this.timelineItem("canceled", stockRs.error),
            },
          },
        );

        return { error: stockRs.error };
      }
    }

    await this.clearUserCart(uid);

    return {
      ok: true,
      order: { _id: orderRs.insertedId, ...orderDoc },
      payment: { _id: paymentRs.insertedId, ...paymentDoc },
    };
  }

  async getOrderDetail(orderId) {
    const oid = ObjectId.isValid(orderId) ? new ObjectId(orderId) : null;
    if (!oid) return null;

    const [doc] = await this.Order.aggregate([
      { $match: { _id: oid } },

      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "order_id",
          as: "payment",
        },
      },
      { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "addresses",
          localField: "address_id",
          foreignField: "_id",
          as: "address",
        },
      },
      { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },
    ]).toArray();

    if (!doc) return null;

    return this.normalizeOrder(doc);
  }

  async pushStatus(orderId, status, note = "") {
    const oid = ObjectId.isValid(orderId) ? new ObjectId(orderId) : null;
    if (!oid) return null;

    return await this.Order.findOneAndUpdate(
      { _id: oid },
      {
        $set: { status },
        $push: { timeline: this.timelineItem(status, note) },
      },
      { returnDocument: "after" },
    );
  }

  async markPaidByPayPalTransaction(paypalOrderId) {
    const payment = await this.Payment.findOne({
      transaction_id: paypalOrderId,
    });

    if (!payment) {
      return { error: "Không tìm thấy payment" };
    }

    if (payment.status === "completed") {
      const order = await this.getOrderDetail(String(payment.order_id));
      return { ok: true, order };
    }

    const order = await this.Order.findOne({ _id: payment.order_id });
    if (!order) {
      return { error: "Không tìm thấy order" };
    }

    const stockRs = await this.deductStockForOrderItems(order.items);
    if (stockRs?.error) {
      await this.Payment.updateOne(
        { _id: payment._id },
        { $set: { status: "failed" } },
      );

      await this.pushStatus(order._id, "canceled", stockRs.error);
      return { error: stockRs.error };
    }

    await this.Payment.updateOne(
      { _id: payment._id },
      {
        $set: {
          status: "completed",
          paid_at: new Date(),
        },
      },
    );

    await this.pushStatus(
      order._id,
      "processing",
      "Thanh toán PAYPAL thành công",
    );

    const detail = await this.getOrderDetail(String(order._id));
    return { ok: true, order: detail };
  }
}

module.exports = OrdersService;
