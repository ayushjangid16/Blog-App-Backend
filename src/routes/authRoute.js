const express = require("express");
const {
  registerUser,
  verifyUser,
  login,
  logout,
  refreshAccessToken,
} = require("../controllers/authController");

// middlewares
const { authorize } = require("../middlewares/authMiddleware");

// validations
const {
  registerValidation,
  loginValidation,
  refreshAccessTokenValidation,
} = require("../validations/api/authValidation");

const router = express.Router();

router.route("/register").post(registerValidation, registerUser);
router.route("/verify").get(verifyUser);
router.route("/login").post(loginValidation, login);
router.route("/logout").post(authorize, logout);
router
  .route("/generate-refresh-token")
  .post(authorize, refreshAccessTokenValidation, refreshAccessToken);

module.exports = router;
