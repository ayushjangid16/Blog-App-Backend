const express = require("express");

const { authenticate } = require("../middlewares/authMiddleware");
const {
  dislikePost,
  dislikeComment,
} = require("../controllers/likeController");
const {
  postDislike,
  commentDisklike,
} = require("../validations/api/likeValidation");
const { isSystemUser } = require("../middlewares/authorization");
const router = express.Router();

router
  .route("/post")
  .post(authenticate, isSystemUser, postDislike, dislikePost);
router
  .route("/comment")
  .post(authenticate, isSystemUser, commentDisklike, dislikeComment);

module.exports = router;
