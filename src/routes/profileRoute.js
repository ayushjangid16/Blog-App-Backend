const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const { profile, update } = require("../controllers/profileController");
const router = express.Router();

// to get user profile
router.route("/").get(authenticate, profile);

// to update profile
router.route("/update").put(authenticate, update);

module.exports = router;
