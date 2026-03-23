const express = require("express");
const router = express.Router();
const wishlist = require("../controllers/wishlist.controller");

router.get("/:userId", wishlist.getWishlistByUser);
router.post("/:userId/items", wishlist.addItem);
router.patch("/:userId/items/:productId/toggle", wishlist.toggleItem);
router.delete("/:userId/items/:productId", wishlist.removeItem);
router.delete("/:userId/items", wishlist.clearWishlist);

module.exports = router;
