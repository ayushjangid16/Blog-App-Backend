const express = require("express");
const {
  registerUser,
  verifyUser,
  login,
  logout,
  refreshAccessToken,
  resetPasssword,
  verifyResetPassword,
} = require("../controllers/authController");

// middlewares
const { authenticate } = require("../middlewares/authMiddleware");

// validations
const {
  registerValidation,
  loginValidation,
  refreshAccessTokenValidation,
  resetPasswordValidation,
} = require("../validations/api/authValidation");

const router = express.Router();

router.route("/register").post(registerValidation, registerUser);
router.route("/verify").get(verifyUser);
router.route("/login").post(loginValidation, login);
router.route("/logout").post(authenticate, logout);
router
  .route("/generate-refresh-token")
  .post(authenticate, refreshAccessTokenValidation, refreshAccessToken);

router.route("/reset-password").post(resetPasssword);
router
  .route("/verify-reset-password")
  .post(resetPasswordValidation, verifyResetPassword);

module.exports = router;
