const express = require("express");
const {
  createRequest,
  approveRequest,
  rejectRequest,
  getAllRequests,
} = require("../controllers/requestController");
const { authorize } = require("../middlewares/authMiddleware");
const {
  createRequestValidation,
  approveRequestValidation,
  rejectRequestValidation,
} = require("../validations/api/requestValidation");

const router = express.Router();

router.route("/create").post(authorize, createRequestValidation, createRequest);
router
  .route("/approve")
  .post(authorize, approveRequestValidation, approveRequest);

router.route("/reject").post(authorize, rejectRequestValidation, rejectRequest);
router.route("/all").get(authorize, getAllRequests);

module.exports = router;
