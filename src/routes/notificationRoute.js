const express = require("express");
const {
  index,
  userNotification,
  singleNotification,
} = require("../controllers/notificationController");

const { authenticate } = require("../middlewares/authMiddleware");
const {
  indexValidation,
  singleNotificationValidation,
} = require("../validations/api/notificationValidation");

const router = express.Router();

router.route("/all").get(authenticate, indexValidation, index);
router.route("/user").get(authenticate, userNotification);
router
  .route("/")
  .get(authenticate, singleNotificationValidation, singleNotification);

module.exports = router;
