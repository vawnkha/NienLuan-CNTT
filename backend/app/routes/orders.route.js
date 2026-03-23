const express = require("express");
const router = express.Router();
const order = require("../controllers/orders.controller");

router.post("/", order.create);
router.get("/", order.findByUser);
router.get("/:id", order.findOne);
router.patch("/:id/cancel", order.cancel);
router.patch("/:id/status", order.updateStatus);

module.exports = router;
