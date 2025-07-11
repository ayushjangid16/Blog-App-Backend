const express = require("express");
const router = express.Router();

const { createBlog } = require("../controllers/blogController");
const upload = require("../middlewares/fileUpload");

router.route("/create").post(upload.single("image"), createBlog);

module.exports = router;
