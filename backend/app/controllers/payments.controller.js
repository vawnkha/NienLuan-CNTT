const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const OrdersService = require("../services/orders.service");
const PaymentsService = require("../services/payments.service");
const {
  paypalCreateOrder,
  paypalCaptureOrder,
} = require("../utils/paypal.util");

function vndToUsd(vnd) {
  const rate = Number(process.env.PAYPAL_USD_RATE || 25000);
  const usd = Number(vnd || 0) / rate;
  return Math.max(1, Number(usd.toFixed(2)));
}

exports.createOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return next(new ApiError(400, "orderId là bắt buộc"));

    const ordersService = new OrdersService(MongoDB.client);
    const paymentsService = new PaymentsService(MongoDB.client);

    const detail = await ordersService.getOrderDetail(orderId);
    if (!detail) return next(new ApiError(404, "Order không tồn tại"));

    if (detail.status === "canceled") {
      return next(new ApiError(400, "Order đã bị hủy"));
    }

    const payment = await paymentsService.findByOrderId(orderId);
    if (!payment) return next(new ApiError(404, "Payment không tồn tại"));

    if (payment.status === "completed") {
      return next(new ApiError(400, "Order đã thanh toán"));
    }

    if (payment.transaction_id) {
      return res.send({ id: payment.transaction_id });
    }

    const currency = process.env.PAYPAL_CURRENCY || "USD";
    const total =
      currency === "USD"
        ? vndToUsd(detail.total_price)
        : Number(detail.total_price);

    const pp = await paypalCreateOrder({
      total,
      currency,
      referenceId: String(detail._id),
    });

    if (!pp?.id) {
      return next(new ApiError(500, "Không tạo được PayPal order"));
    }

    await paymentsService.setMethodAndTransaction(orderId, "paypal", pp.id);

    return res.send({ id: pp.id });
  } catch (error) {
    console.error("PAYPAL CREATE ORDER ERROR:", error?.response?.data || error);
    return next(new ApiError(500, error.message || "Lỗi tạo PAYPAL order"));
  }
};

exports.captureOrder = async (req, res, next) => {
  try {
    const { paypalOrderId } = req.body;
    if (!paypalOrderId) {
      return next(new ApiError(400, "paypalOrderId là bắt buộc"));
    }

    const captured = await paypalCaptureOrder(paypalOrderId);

    const ordersService = new OrdersService(MongoDB.client);
    const rs = await ordersService.markPaidByPayPalTransaction(paypalOrderId);

    if (rs?.error) {
      return next(new ApiError(400, rs.error));
    }

    return res.send({
      message: "Thanh toán thành công",
      capture: captured,
      data: rs.order,
    });
  } catch (error) {
    console.error(
      "PAYPAL CAPTURE ERROR:",
      error?.response?.data || error.message || error,
    );
    return next(new ApiError(500, error.message || "Lỗi capture PAYPAL order"));
  }
};
