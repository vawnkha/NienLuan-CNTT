const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const WishlistService = require("../services/wishlist.service");

exports.getWishlistByUser = async (req, res, next) => {
  try {
    const service = new WishlistService(MongoDB.client);
    const result = await service.getWishlistWithProducts(req.params.userId);
    return res.send(result);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách yêu thích"));
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;
    if (!productId) {
      return next(new ApiError(400, "ProductId là bắt buộc"));
    }
    const service = new WishlistService(MongoDB.client);
    const result = await service.addItem(userId, productId);
    if (!result) {
      return next(new ApiError(404, "Sản phẩm không tồn tại"));
    }
    return res.send({
      message: "Thêm sản phẩm vào wishlist thành công",
      data: result,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm sản phẩm vào wishlist"));
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    const service = new WishlistService(MongoDB.client);
    await service.removeItem(userId, productId);
    return res.send({
      message: "Xóa sản phẩm khỏi wishlist thành công",
      data: await service.getWishlistWithProducts(userId),
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa sản phẩm khỏi wishlist"));
  }
};

exports.toggleItem = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    const service = new WishlistService(MongoDB.client);
    const result = await service.toggleItem(userId, productId);
    if (result.error) {
      return next(new ApiError(404, result.error));
    }
    return res.send({
      message:
        result.action === "added"
          ? "Đã thêm vào wishlist"
          : "Đã xóa khỏi wishlist",
      data: result.wishlist,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật wishlist"));
  }
};

exports.clearWishlist = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const service = new WishlistService(MongoDB.client);
    await service.clear(userId);
    return res.send({
      message: "Đã xóa toàn bộ wishlist",
      data: await service.getWishlistWithProducts(userId),
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa toàn bộ wishlist"));
  }
};
