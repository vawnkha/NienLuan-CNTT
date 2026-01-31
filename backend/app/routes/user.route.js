const express = require("express");
const router = express.Router();
const user = require("../controllers/user.controller");

router.get("/activate/:id", user.activate);

router.get("/", user.findAll);
router.get("/:id", user.findOne);
router.post("/", user.create);
router.put("/:id", user.update);
router.delete("/:id", user.delete);
module.exports = router;
