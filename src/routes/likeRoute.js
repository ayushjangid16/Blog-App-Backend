const express = require("express");
const {
  likePost,
  likeComment,
  allLikesOnPost,
  allLikesOnComment,
} = require("../controllers/likeController");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/post").post(authenticate, likePost);
router.route("/comment").post(authenticate, likeComment);
router.route("/post/all").get(authenticate, allLikesOnPost);
router.route("/comment/all").get(authenticate, allLikesOnComment);

module.exports = router;
