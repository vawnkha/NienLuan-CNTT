const multer = require("multer");
const path = require("path");
const ApiError = require("../api-error");

const uploadDir = path.join(__dirname, "../../public/uploads/categories");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `cat_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const ok = ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
    file.mimetype,
  );
  if (!ok) return cb(new ApiError(400, "Invalid file type"));
  cb(null, true);
}

const uploadCategoryImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = uploadCategoryImage;
