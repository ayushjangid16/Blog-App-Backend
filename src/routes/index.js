const express = require("express");
const router = express.Router();

const authRouter = require("./authRoute");
const blogRouter = require("./blogRoute");
const requestRouter = require("./requestRoute");
const commentRouter = require("./commentRoute");
const profileRouter = require("./profileRoute");
const followRouter = require("./followRoute");

router.use("/auth", authRouter);
router.use("/request", requestRouter);
router.use("/blog", blogRouter);
router.use("/comment", commentRouter);
router.use("/profile", profileRouter);
router.use("", followRouter);

module.exports = router;
