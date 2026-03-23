const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const OrdersService = require("../services/orders.service");
const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
  try {
    const { user_id, address_id, payment_method } = req.body;

    if (!user_id || !address_id) {
      return next(new ApiError(400, "user_id và address_id là bắt buộc"));
    }

    const service = new OrdersService(MongoDB.client);
    const rs = await service.createFromCart({
      userId: user_id,
      addressId: address_id,
      payment_method: payment_method || "cash",
    });

    if (rs?.error) {
      return next(new ApiError(400, rs.error));
    }

    return res.send({
      message: "Đặt hàng thành công",
      data: rs,
    });
  } catch (error) {
    return next(new ApiError(500, error.message || "Lỗi khi đặt hàng"));
  }
};

exports.findByUser = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) return next(new ApiError(400, "userId là bắt buộc"));

    const service = new OrdersService(MongoDB.client);
    const docs = await service.findByUser(userId);

    return res.send(docs);
  } catch (error) {
    return next(
      new ApiError(500, error.message || "Lỗi lấy danh sách đơn hàng"),
    );
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = new OrdersService(MongoDB.client);
    const doc = await service.getOrderDetail(id);

    if (!doc) {
      return next(new ApiError(404, "Đơn hàng không tồn tại"));
    }

    return res.send(doc);
  } catch (error) {
    return next(
      new ApiError(500, error.message || "Lỗi lấy chi tiết đơn hàng"),
    );
  }
};
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return next(new ApiError(400, "status là bắt buộc"));
    }

    const service = new OrdersService(MongoDB.client);
    const doc = await service.pushStatus(id, status, note || "");

    if (!doc) {
      return next(new ApiError(404, "Đơn hàng không tồn tại"));
    }

    return res.send(doc);
  } catch (error) {
    return next(
      new ApiError(500, error.message || "Lỗi cập nhật trạng thái đơn hàng"),
    );
  }
};

exports.cancel = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = new OrdersService(MongoDB.client);
    const current = await service.getOrderDetail(id);

    if (!current) {
      return next(new ApiError(404, "Đơn hàng không tồn tại"));
    }

    if (current.status !== "pending") {
      return next(new ApiError(400, "Chỉ được hủy đơn đang chờ xác nhận"));
    }

    const doc = await service.pushStatus(
      id,
      "canceled",
      "Người dùng hủy đơn hàng",
    );

    return res.send(doc);
  } catch (error) {
    return next(new ApiError(500, error.message || "Lỗi hủy đơn hàng"));
  }
};
