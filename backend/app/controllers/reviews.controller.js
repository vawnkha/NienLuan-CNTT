const ApiError = require("../api-error");
const ReviewsService = require("../services/reviews.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  try {
    const { user_id, product_id, rating, comment } = req.body;

    if (!user_id) return next(new ApiError(400, "user là bắt buộc"));
    if (!product_id) return next(new ApiError(400, "product là bắt buộc"));
    if (rating === undefined)
      return next(new ApiError(400, "rating là bắt buộc"));
    const ratingNumber = Number(rating);
    if (
      !Number.isInteger(ratingNumber) ||
      ratingNumber < 1 ||
      ratingNumber > 5
    ) {
      return next(new ApiError(400, "rating phải là số nguyên từ 1 đến 5"));
    }

    const reviewService = new ReviewsService(MongoDB.client);
    const document = await reviewService.create({
      user_id,
      product_id,
      rating: ratingNumber,
      comment,
    });

    if (document?.error) {
      return next(new ApiError(400, document.error));
    }
    return res.send({
      message: "Đánh giá sản phẩm thành công",
      data: document,
    });
  } catch (error) {
    return next(new ApiError(500, error.message || "Lỗi khi tạo review"));
  }
};

exports.findByProduct = async (req, res, next) => {
  try {
    const reviewService = new ReviewsService(MongoDB.client);
    const reviews = await reviewService.findByProductId(req.params.productId);
    const stats = await reviewService.getReviewStats(req.params.productId);

    return res.send({
      stats,
      reviews,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách review"));
  }
};
exports.canReview = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    const reviewService = new ReviewsService(MongoDB.client);
    const result = await reviewService.canReview(userId, productId);
    return res.send(result);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi kiểm tra quyền đánh giá"));
  }
};
