const zod = require("zod");
const jwt = require("jsonwebtoken");
const Request = require("../../models/requestModel");

const createRequestValidation = async (req, res, next) => {
  const schema = zod.object({
    userId: zod
      .string()
      .min(24, "User Id should be of Length 24")
      .max(24, "User Id cannot exceed Length 24"),
  });

  const { userId } = req.body;
  let verified = jwt.verify(
    req.headers.authorization.split(" ")[1],
    process.env.JWT_SECRET
  );

  const result = schema.safeParse({ userId });

  if (userId != verified._id) {
    return res.error("Invalid Token", 401);
  }

  let error = {};
  if (!result.success) {
    result.error.errors.forEach((er) => {
      error[er.path[0]] = er.message;
    });
    return res.error("Validation Error", 400, error);
  }

  const requestRecord = await Request.find({
    user_id: userId,
    isDeleted: false,
  });
  if (requestRecord) {
    let pending = requestRecord.find((req) => req.status === "pending");
    if (pending) {
      error["Duplicate"] = "You already have an Pending Request";
      return res.error("Already have pending Request", 404, error);
    }
  }
  // finally user has permission to request
  next();
};

const approveRequestValidation = async (req, res, next) => {
  const schema = zod.object({
    requestId: zod
      .string()
      .min(24, "RequestId should be of Length 24")
      .max(24, "RequestId cannot exceed Length 24"),
  });

  const { requestId } = req.body;
  const result = schema.safeParse({ requestId });

  let error = {};
  if (!result.success) {
    result.error.errors.forEach((er) => {
      error[er.path[0]] = er.message;
    });
    return res.error("Validation Error", 400, error);
  }

  const requestRecord = await Request.findOne({
    _id: requestId,
    isDeleted: false,
  });

  if (!requestRecord) {
    error["Request"] = "Request Not Found";
    return res.error("Request Not Found", 404, error);
  }

  // request is already accepted
  if (requestRecord.status === "accepted") {
    error["Validation Error"] = "Request Already Accepted";
    return res.error("Request Already Accepted", 404, error);
  }

  // request is already rejected
  if (requestRecord.status === "rejected") {
    error["Validation Error"] = "Request Already Rejected";
    return res.error("Request Already Rejected", 404, error);
  }

  // finally request is pending
  next();
};

const rejectRequestValidation = async (req, res, next) => {
  const schema = zod.object({
    requestId: zod
      .string()
      .min(24, "RequestId should be of Length 24")
      .max(24, "RequestId cannot exceed Length 24"),
  });

  const { requestId } = req.body;
  const result = schema.safeParse({ requestId });

  let error = {};
  if (!result.success) {
    result.error.errors.forEach((er) => {
      error[er.path[0]] = er.message;
    });
    return res.error("Validation Error", 400, error);
  }

  const requestRecord = await Request.findOne({
    _id: requestId,
    isDeleted: false,
  });

  if (!requestRecord) {
    error["Request"] = "Request Not Found";
    return res.error("Request Not Found", 404, error);
  }

  // request is already accepted
  if (requestRecord.status === "accepted") {
    error["Validation Error"] = "Request Already Accepted";
    return res.error("Request Already Accepted", 404, error);
  }

  // request is already rejected
  if (requestRecord.status === "rejected") {
    error["Validation Error"] = "Request Already Rejected";
    return res.error("Request Already Rejected", 404, error);
  }

  // finally request is pending
  next();
};

module.exports = {
  createRequestValidation,
  approveRequestValidation,
  rejectRequestValidation,
};
