const express = require("express");
const router = express.Router();

const authRouter = require("./authRoute");
const blogRouter = require("./blogRoute");
const requestRouter = require("./requestRoute");

router.use("/auth", authRouter);
router.use("/request", requestRouter);
router.use("/blog", blogRouter);

module.exports = router;
