const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ApiError = require("../api-error.js");

const uploadDir = path.join(__dirname, "../../public/uploads/users");

try {
  fs.mkdirSync(uploadDir, { recursive: true });
} catch (_) {}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, `user_${Date.now()}_${Math.random()}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const ok = ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
    file.mimetype,
  );
  if (!ok) return cb(new ApiError(400, "Invalid file type"));
  cb(null, true);
}

const uploadUserImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = uploadUserImage;
