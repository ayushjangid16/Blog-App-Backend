const express = require("express");
const router = express.Router();

const authRouter = require("./authRoute");
const blogRouter = require("./blogRoute");
const requestRouter = require("./requestRoute");
const likeRouter = require("./likeRoute");
const dislikeRouter = require("./dislikeRoute");
const commentRouter = require("./commentRoute");

router.use("/auth", authRouter);
router.use("/request", requestRouter);
router.use("/blog", blogRouter);
router.use("/like", likeRouter);
router.use("/dislike", dislikeRouter);
router.use("/comment", commentRouter);

module.exports = router;
