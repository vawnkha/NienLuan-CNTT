const express = require("express");
const router = express.Router();
const reviews = require("../controllers/reviews.controller");

router.get("/product/:productId", reviews.findByProduct);
router.get("/can-review/:userId/:productId", reviews.canReview);
router.post("/", reviews.create);

module.exports = router;
