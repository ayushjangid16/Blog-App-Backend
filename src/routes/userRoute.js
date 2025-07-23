const express = require("express");
const { userProfile } = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("").get(authenticate, userProfile);

module.exports = router;
