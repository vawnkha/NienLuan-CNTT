const ApiError = require("../api-error");
const CategoryService = require("../services/categories.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Tên danh mục không được để trống"));
  }

  try {
    const categoryService = new CategoryService(MongoDB.client);
    const existed = await categoryService.findBySlug(req.body.slug);
    if (existed) {
      return next(new ApiError(400, "Slug danh mục đã được sử dụng"));
    }
    const result = await categoryService.create(req.body);
    return res.send({ message: "Tạo danh mục thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo danh mục"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await categoryService.findByName(name);
    } else {
      documents = await categoryService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi truy xuất danh mục"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const document = await categoryService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Danh mục không tồn tại"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi truy xuất danh mục"));
  }
};
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu để cập nhật không được để trống"));
  }
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const existed = await categoryService.findById(req.params.id);
    if (!existed) {
      return next(new ApiError(404, "Danh mục không tồn tại"));
    }
    const result = await categoryService.update(req.params.id, req.body);
    return res.send({ message: "Cập nhật danh mục thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật danh mục"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const existed = await categoryService.findById(req.params.id);
    if (!existed) {
      return next(new ApiError(404, "Danh mục không tồn tại"));
    }
    await categoryService.delete(req.params.id);
    return res.send({ message: "Xóa danh mục thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa danh mục"));
  }
};
