const MongoDB = require("../utils/mongodb.util");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const ApiError = require("../api-error");
const UserService = require("../services/user.service");
const { sendResetPasswordEmail } = require("../utils/mailer.util");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ApiError(400, "Email và mật khẩu là bắt buộc"));
    }

    const userService = new UserService(MongoDB.client);
    const user = await userService.findByEmail(email);
    if (!user) {
      return next(new ApiError(401, "Email hoặc mật khẩu không đúng"));
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return next(new ApiError(401, "Email hoặc mật khẩu không đúng"));
    }
    if (user.status !== "active") {
      return next(new ApiError(403, "Tài khoản chưa được kích hoạt"));
    }
    return res.send({
      message: "Đăng nhập thành công",
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi đăng nhập"));
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    if (!userId || !oldPassword || !newPassword) {
      return next(new ApiError(400, "Mật khẩu cũ và mật khẩu mới là bắt buộc"));
    }
    const userService = new UserService(MongoDB.client);
    const user = await userService.findById(userId);
    if (!user) {
      return next(new ApiError(404, "Người dùng không tồn tại"));
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(new ApiError(401, "Mật khẩu cũ không đúng"));
    }
    await userService.update(userId, { password: newPassword });
    return res.send({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi đổi mật khẩu"));
  }
};
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new ApiError(400, "Email không được để trống"));
    }
    const userService = new UserService(MongoDB.client);
    const user = await userService.findByEmail(email);
    if (!user) {
      return next(new ApiError(404, "Người dùng với email này không tồn tại"));
    }
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await userService.update(user._id, {
      resetToken: tokenHash,
      resetTokenExpiresAt: expiresAt,
    });
    const baseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${rawToken}`;

    await sendResetPasswordEmail({
      to: user.email,
      name: user.name,
      resetLink,
      expiresMinutes: 15,
    });
    return res.send({
      message:
        "Yêu cầu đặt lại mật khẩu đã được gửi, vui lòng kiểm tra email của bạn.",
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi yêu cầu đặt lại mật khẩu"));
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return next(new ApiError(400, "Token và mật khẩu mới là bắt buộc"));
    }
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const userService = new UserService(MongoDB.client);
    const user = await userService.findOne({
      resetToken: tokenHash,
      resetTokenExpiresAt: { $gt: new Date() },
    });
    if (!user) {
      return next(
        new ApiError(
          400,
          "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
        ),
      );
    }
    await userService.update(user._id, {
      password: newPassword,
      resetToken: null,
      resetTokenExpiresAt: null,
    });
    return res.send({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi đặt lại mật khẩu"));
  }
};
