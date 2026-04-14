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
    const { user_id, address_id } = req.body;

    if (!user_id || !address_id) {
      return next(new ApiError(400, "user_id và address_id là bắt buộc"));
    }

    const ordersService = new OrdersService(MongoDB.client);
    const preview = await ordersService.getCheckoutPreview({
      userId: user_id,
      addressId: address_id,
    });

    if (preview?.error) {
      return next(new ApiError(400, preview.error));
    }

    const currency = process.env.PAYPAL_CURRENCY || "USD";
    const total =
      currency === "USD"
        ? vndToUsd(preview.total_price)
        : Number(preview.total_price);

    const pp = await paypalCreateOrder({
      total,
      currency,
      referenceId: `${user_id}|${address_id}`,
    });

    if (!pp?.id) {
      return next(new ApiError(500, "Không tạo được PayPal order"));
    }

    return res.send({ id: pp.id });
  } catch (error) {
    return next(new ApiError(500, error.message || "Lỗi tạo PAYPAL order"));
  }
};

exports.captureOrder = async (req, res, next) => {
  try {
    const { paypalOrderId, user_id, address_id } = req.body;

    if (!paypalOrderId || !user_id || !address_id) {
      return next(
        new ApiError(400, "paypalOrderId, user_id, address_id là bắt buộc"),
      );
    }

    const captured = await paypalCaptureOrder(paypalOrderId);

    const ordersService = new OrdersService(MongoDB.client);
    const rs = await ordersService.createFromCart({
      userId: user_id,
      addressId: address_id,
      payment_method: "paypal",
    });

    if (rs?.error || !rs?.ok || !rs?.order) {
      return next(new ApiError(400, rs?.error || "Không thể tạo đơn hàng"));
    }

    await ordersService.Payment.updateOne(
      { _id: rs.payment._id },
      {
        $set: {
          method: "paypal",
          transaction_id: paypalOrderId,
          status: "completed",
          paid_at: new Date(),
          updated_at: new Date(),
        },
      },
    );

    return res.send({
      message: "Thanh toán thành công",
      capture: captured,
      data: rs.order,
    });
  } catch (error) {
    return next(new ApiError(500, error.message || "Lỗi capture PAYPAL order"));
  }
};
