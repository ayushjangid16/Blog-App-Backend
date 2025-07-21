const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  profile,
  update,
  profilePicture,
} = require("../controllers/profileController");
const upload = require("../middlewares/fileUpload");
const router = express.Router();

// to get user profile
router.route("/").get(authenticate, profile);

// to update profile
router.route("/update").put(authenticate, update);

router.route("/image").put(authenticate, upload.single("user"), profilePicture);

module.exports = router;
