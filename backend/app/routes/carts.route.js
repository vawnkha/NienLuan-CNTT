const express = require("express");
const router = express.Router();
const cart = require("../controllers/carts.controller");

router.get("/:userId", cart.getMyCart);
router.get("/:userId/detailed", cart.getMyCartDetailed);
router.post("/:userId/items", cart.addItem);
router.put("/:userId/items/:productId", cart.updateItem);
router.delete("/:userId/items/:productId", cart.removeItem);
router.delete("/:userId/clear", cart.clearCart);

module.exports = router;
