const express = require("express");
const { follow, unfollow } = require("../controllers/followController");

const { authenticate } = require("../middlewares/authMiddleware");
const {
  followValidation,
  unfollowValidation,
} = require("../validations/api/followValidation");

const router = express.Router();

router.route("/follow").post(authenticate, followValidation, follow);
router.route("/unfollow").post(authenticate, unfollowValidation, unfollow);

module.exports = router;
