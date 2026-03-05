const express = require("express");
const router = express.Router();
const addresses = require("../controllers/addresses.controller");

router.get("/", addresses.findByUser);
router.post("/", addresses.create);
router.put("/:id", addresses.update);
router.delete("/:id", addresses.delete);

module.exports = router;
