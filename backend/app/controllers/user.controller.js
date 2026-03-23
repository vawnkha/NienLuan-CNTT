const fs = require("fs");
const path = require("path");
const UserService = require("../services/users.service");
const MongoDB = require("../utils/mongodb.util");
const { sendActivationEmail } = require("../utils/mailer.util");
const ApiError = require("../api-error");

async function safeDeleteLocalImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return;
  if (!imageUrl.startsWith("/uploads/")) return;

  const relative = imageUrl.replace(/^\/uploads\//, "");
  const filePath = path.join(process.cwd(), "public/uploads", relative);
  try {
    await fs.promises.unlink(filePath);
  } catch (_) {}
}

exports.create = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const existed = await userService.findByEmail(req.body.email);
    if (existed) {
      return next(new ApiError(400, "Email đã được sử dụng"));
    }
    const { insertedId, rawToken } = await userService.create(req.body);

    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    const activationLink = `${baseUrl}/api/users/activate/${insertedId}?token=${rawToken}`;

    await sendActivationEmail({
      to: req.body.email,
      name: req.body.name,
      activationLink,
    });
    return res.status(201).json({
      message:
        "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.",
      userId: insertedId,
    });
  } catch (error) {
    next(error);
  }
};

exports.activate = async (req, res, next) => {
  const frontendBaseUrl =
    process.env.FRONTEND_BASE_URL || "http://localhost:3001";

  try {
    const { id } = req.params;
    const token = req.query.token;

    if (!token) {
      return res.redirect(
        `${frontendBaseUrl}/login?status=error&message=${encodeURIComponent(
          "Token kích hoạt không được để trống",
        )}`,
      );
    }

    const userService = new UserService(MongoDB.client);
    const existed = await userService.findById(id);

    if (!existed) {
      return res.redirect(
        `${frontendBaseUrl}/login?status=error&message=${encodeURIComponent(
          "Tài khoản không tồn tại",
        )}`,
      );
    }

    if (existed.status === "active") {
      return res.redirect(
        `${frontendBaseUrl}/login?status=success&message=${encodeURIComponent(
          "Tài khoản đã được kích hoạt trước đó. Bạn có thể đăng nhập.",
        )}`,
      );
    }

    const user = await userService.activateByUserIdAndToken(id, token);

    if (!user) {
      return res.redirect(
        `${frontendBaseUrl}/login?status=error&message=${encodeURIComponent(
          "Token kích hoạt không hợp lệ hoặc đã hết hạn",
        )}`,
      );
    }

    return res.redirect(
      `${frontendBaseUrl}/login?status=success&message=${encodeURIComponent(
        "Kích hoạt tài khoản thành công! Bạn có thể đăng nhập.",
      )}`,
    );
  } catch (error) {
    return res.redirect(
      `${frontendBaseUrl}/login?status=error&message=${encodeURIComponent(
        "Có lỗi xảy ra khi kích hoạt tài khoản",
      )}`,
    );
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const users = await userService.findAll();
    res.send(users);
  } catch (error) {
    next(error);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const user = await userService.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const userService = new UserService(MongoDB.client);
    const result = await userService.update(req.params.id, req.body);
    if (!result) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send({ message: "User updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating user with id=${req.params.id}`),
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const result = await userService.delete(req.params.id);
    if (!result) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.updateAvatar = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const existed = await userService.findById(req.params.id);

    if (!existed) {
      if (req.file) {
        await safeDeleteLocalImage(`/uploads/users/${req.file.filename}`);
      }
      return next(new ApiError(404, "User không tồn tại"));
    }

    if (!req.file) {
      return next(new ApiError(400, "Vui lòng chọn ảnh đại diện"));
    }

    const newAvatarUrl = `/uploads/users/${req.file.filename}`;

    if (existed.avatar_url) {
      await safeDeleteLocalImage(existed.avatar_url);
    }

    const result = await userService.update(req.params.id, {
      avatar_url: newAvatarUrl,
    });

    if (!result) {
      await safeDeleteLocalImage(newAvatarUrl);
      return next(new ApiError(500, "Cập nhật ảnh đại diện thất bại"));
    }

    return res.send({
      message: "Cập nhật ảnh đại diện thành công",
      data: result,
    });
  } catch (error) {
    if (req.file) {
      await safeDeleteLocalImage(`/uploads/users/${req.file.filename}`);
    }
    return next(new ApiError(500, error.message || "Lỗi cập nhật avatar"));
  }
};
