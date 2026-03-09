const { ObjectId } = require("mongodb");

class PaymentsService {
  constructor(client) {
    this.Payment = client.db().collection("payments");
    this.Payment.createIndex({ order_id: 1 }, { unique: true });
    this.Payment.createIndex({ transaction_id: 1 });
    this.Payment.createIndex({ status: 1, created_at: -1 });
  }

  async findByOrderId(orderId) {
    return await this.Payment.findOne({
      order_id: ObjectId.isValid(orderId) ? new ObjectId(orderId) : null,
    });
  }

  async setMethodAndTransaction(orderId, method, transactionId) {
    const oid = ObjectId.isValid(orderId) ? new ObjectId(orderId) : null;
    if (!oid) return null;
    return await this.Payment.findOneAndUpdate(
      { order_id: oid },
      { $set: { method, transaction_id: transactionId } },
      { returnDocument: "after" },
    );
  }
}

module.exports = PaymentsService;
