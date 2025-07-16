const express = require("express");

const { authenticate } = require("../middlewares/authMiddleware");
const {
  dislikePost,
  dislikeComment,
} = require("../controllers/likeController");
const router = express.Router();

router.route("/post").post(authenticate, dislikePost);
router.route("/comment").post(authenticate, dislikeComment);

module.exports = router;
