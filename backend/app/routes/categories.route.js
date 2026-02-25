const express = require("express");
const router = express.Router();
const categories = require("../controllers/categories.controller");

const uploadCategoryImage = require("../middlewares/category-upload.middleware");

router.get("/", categories.findAll);
router.post("/", uploadCategoryImage.single("image"), categories.create);
router.get("/:id", categories.findOne);
router.put("/:id", uploadCategoryImage.single("image"), categories.update);
router.delete("/:id", categories.delete);

module.exports = router;
