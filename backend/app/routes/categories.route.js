const express = require("express");
const router = express.Router();
const categories = require("../controllers/categories.controller");

router.get("/", categories.findAll);
router.post("/", categories.create);
router.get("/:id", categories.findOne);
router.put("/:id", categories.update);
router.delete("/:id", categories.delete);

module.exports = router;
