const express = require("express");
const notifications = require("../controllers/notifications.controller");

const router = express.Router();

router
  .route("/")
  .post(notifications.create)
  .get(notifications.findAll)
  .delete(notifications.deleteAll);

router.get("/unread-count", notifications.countUnread);
router.patch("/mark-all-read", notifications.markAllAsRead);
router.delete("/bulk-delete", notifications.deleteMany);

router
  .route("/:id")
  .get(notifications.findOne)
  .patch(notifications.update)
  .delete(notifications.delete);

router.patch("/:id/read", notifications.markAsRead);

module.exports = router;
