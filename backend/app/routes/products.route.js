const express = require("express");
const router = express.Router();
const products = require("../controllers/products.controller");
const uploadProductImage = require("../middlewares/product-upload.middleware");
const { route } = require("./categories.route");

router.get("/", products.findAll);
router.get("/:id", products.findOne);
router.post(
  "/",
  uploadProductImage.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  products.create,
);
router.put(
  "/:id",
  uploadProductImage.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  products.update,
);
router.delete("/:id", products.delete);

module.exports = router;
