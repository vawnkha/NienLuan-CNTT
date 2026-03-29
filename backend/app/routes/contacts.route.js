const express = require("express");
const contacts = require("../controllers/contacts.controller");

const router = express.Router();

router
  .route("/")
  .post(contacts.create)
  .get(contacts.findAll)
  .delete(contacts.deleteAll);

router.route("/:id").get(contacts.findOne).delete(contacts.delete);

router.route("/:id/reply").patch(contacts.reply);

module.exports = router;
