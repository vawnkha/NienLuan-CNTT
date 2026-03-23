const express = require("express");
const router = express.Router();
const payment = require("../controllers/payments.controller");

router.post("/create-order", payment.createOrder);
router.post("/capture-order", payment.captureOrder);

module.exports = router;
