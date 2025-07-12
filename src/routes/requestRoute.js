const express = require("express");
const {
  createRequest,
  approveRequest,
  rejectRequest,
  getAllRequests,
} = require("../controllers/requestController");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  createRequestValidation,
  approveRequestValidation,
  rejectRequestValidation,
} = require("../validations/api/requestValidation");
const { authorize } = require("../middlewares/authorization");

const router = express.Router();

router
  .route("/create")
  .post(
    authenticate,
    authorize("request_writer_role"),
    createRequestValidation,
    createRequest
  );
router
  .route("/approve")
  .post(
    authenticate,
    authorize("approve_writer_request"),
    approveRequestValidation,
    approveRequest
  );

router
  .route("/reject")
  .post(
    authenticate,
    authorize("reject_writer_request"),
    rejectRequestValidation,
    rejectRequest
  );

router.route("/all").get(authenticate, getAllRequests);

module.exports = router;
