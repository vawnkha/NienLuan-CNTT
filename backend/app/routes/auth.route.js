const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

router.post("/login", auth.login);
router.post("/change-password", auth.changePassword);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password/:userId/:token", auth.resetPassword);

module.exports = router;
