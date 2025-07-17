const express = require("express");
const {
  likePost,
  likeComment,
  allLikesOnPost,
  allLikesOnComment,
} = require("../controllers/likeController");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  postLike,
  allPostLikes,
  commentLike,
  allCommentLikes,
} = require("../validations/api/likeValidation");
const { isSystemUser } = require("../middlewares/authorization");
const router = express.Router();

router.route("/post").post(authenticate, isSystemUser, postLike, likePost);
router
  .route("/comment")
  .post(authenticate, isSystemUser, commentLike, likeComment);
router.route("/post/all").get(authenticate, allPostLikes, allLikesOnPost);
router
  .route("/comment/all")
  .get(authenticate, allCommentLikes, allLikesOnComment);

module.exports = router;
