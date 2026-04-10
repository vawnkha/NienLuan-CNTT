const fs = require("fs");
const path = require("path");
const ApiError = require("../api-error");
const ProductsService = require("../services/products.service");
const CategoryService = require("../services/categories.service");
const MongoDB = require("../utils/mongodb.util");

async function safeDeleteLocalImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return;
  if (!imageUrl.startsWith("/uploads/")) return;

  const relative = imageUrl.replace(/^\/uploads\//, "");
  const filePath = path.join(process.cwd(), "public/uploads", relative);
  try {
    await fs.promises.unlink(filePath);
  } catch (_) {}
}

async function safeDeleteLocalImages(urls) {
  if (!Array.isArray(urls)) return;
  await Promise.all(urls.map((u) => safeDeleteLocalImage(u)));
}

function buildUrl(file) {
  return `/uploads/products/${file.filename}`;
}

exports.create = async (req, res, next) => {
  try {
    const { name, category_id, price, stock, unit, description } = req.body;
    if (!name) return next(new ApiError(400, "name là bắt buộc"));
    if (!category_id) return next(new ApiError(400, "category_id là bắt buộc"));

    const thumbFile = req.files?.thumbnail?.[0];
    const imageFiles = req.files?.images || [];

    if (!thumbFile)
      return next(new ApiError(400, "Vui lòng chọn thumbnail cho sản phẩm"));
    if (imageFiles.length > 4)
      return next(new ApiError(400, "Images tối đa 4 ảnh"));
    const service = new ProductsService(MongoDB.client);
    const thumbnail = buildUrl(thumbFile);
    const images = imageFiles.map(buildUrl);

    const created = await service.create({
      name,
      category_id,
      price,
      stock,
      unit,
      description,
      thumbnail,
      images,
    });
    return res.status(201).send({
      message: "Tạo sản phẩm thành công",
      data: created,
    });
  } catch (error) {
    return next(new ApiError(400, error.message || "Lỗi tạo sản phẩm"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const productService = new ProductsService(MongoDB.client);

    if (req.query.category_slug) {
      const categoryService = new CategoryService(MongoDB.client);
      const cat = await categoryService.findBySlug(req.query.category_slug);

      if (!cat) {
        return res.send({
          data: [],
          pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
        });
      }

      req.query.category_id = String(cat._id);
    }

    const result = await productService.search(req.query);

    return res.send({
      data: result.data || [],
      pagination: result.pagination || {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      },
    });
  } catch (error) {
    return next(
      new ApiError(500, error.message || "Lỗi khi truy xuất sản phẩm"),
    );
  }
};

exports.findByCategory = async (req, res, next) => {
  try {
    const productService = new ProductsService(MongoDB.client);
    const result = await productService.findByCategoryId(
      req.params.categoryId,
      req.query,
    );
    return res.send(result);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi truy xuất sản phẩm"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const productService = new ProductsService(MongoDB.client);
    const document = await productService.findById(req.params.id);
    if (!document) return next(new ApiError(404, "Sản phẩm không tồn tại"));
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi truy xuất sản phẩm"));
  }
};

async function cleanUploadedFiles(req) {
  const thumb = req.files?.thumbnail?.[0];
  const images = req.files?.images || [];
  if (thumb) await safeDeleteLocalImage(buildUrl(thumb));
  if (images.length) await safeDeleteLocalImages(images.map(buildUrl));
}

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu để cập nhật không được để trống"));
  }
  try {
    const productService = new ProductsService(MongoDB.client);
    const existed = await productService.findById(req.params.id);
    if (!existed) {
      await cleanUploadedFiles(req);
      return next(new ApiError(404, "Sản phẩm không tồn tại"));
    }

    const payload = {
      name: req.body.name,
      category_id: req.body.category_id,
      price: req.body.price,
      stock: req.body.stock,
      unit: req.body.unit,
      description: req.body.description,
    };
    const newThumbFile = req.files?.thumbnail?.[0];
    const newImageFiles = req.files?.images || [];
    if (newImageFiles.length > 4) {
      await cleanUploadedFiles(req);
      return next(new ApiError(400, "Images tối đa 4 ảnh"));
    }
    if (newThumbFile) {
      const newThumbUrl = buildUrl(newThumbFile);
      await safeDeleteLocalImage(existed.thumbnail);
      payload.thumbnail = newThumbUrl;
    }
    if (newImageFiles.length > 0) {
      const newImages = newImageFiles.map(buildUrl);
      await safeDeleteLocalImages(existed.images);
      payload.images = newImages;
    }
    const result = await productService.update(req.params.id, payload);
    if (!result) {
      await cleanUploadedFiles(req);
      return next(new ApiError(500, "Lỗi khi cập nhật sản phẩm"));
    }
    return res.send({
      message: "Cập nhật sản phẩm thành công",
      data: result,
    });
  } catch (error) {
    await cleanUploadedFiles(req);
    return next(
      new ApiError(500, error.message || "Lỗi khi cập nhật sản phẩm"),
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const productService = new ProductsService(MongoDB.client);
    const existed = await productService.findById(req.params.id);
    if (!existed) {
      return next(new ApiError(404, "Sản phẩm không tồn tại"));
    }
    await safeDeleteLocalImage(existed.thumbnail);
    await safeDeleteLocalImages(existed.images);
    await productService.delete(req.params.id);
    return res.send({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa sản phẩm"));
  }
};

exports.search = async (req, res, next) => {
  try {
    const productService = new ProductsService(MongoDB.client);

    if (req.query.category_slug) {
      const categoryService = new CategoryService(MongoDB.client);
      const cat = await categoryService.findBySlug(req.query.category_slug);

      if (!cat) {
        return res.send({
          message: "Tìm kiếm sản phẩm thành công",
          data: [],
          pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
        });
      }

      req.query.category_id = String(cat._id);
    }

    const result = await productService.search(req.query);
    return res.send({
      message: "Tìm kiếm sản phẩm thành công",
      ...result,
    });
  } catch (error) {
    return next(
      new ApiError(500, error.message || "Lỗi khi tìm kiếm sản phẩm"),
    );
  }
};
