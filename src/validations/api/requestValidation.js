const zod = require("zod");
const User = require("../../models/userModel");
const RoleWithPermission = require("../../models/rolePermissionModel");
const jwt = require("jsonwebtoken");
const Request = require("../../models/requestModel");

const getRolePermissions = async (roleId) => {
  try {
    const rolePermissions = await RoleWithPermission.find({
      role: roleId,
      isDeleted: false,
    }).populate({
      path: "permission",
      select: "name username isDeleted",
    });

    const permissions = rolePermissions
      .filter((rp) => rp.permission)
      .map((rp) => rp.permission);

    return permissions;
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    throw error;
  }
};

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

  // check if admin or not
  const user = await User.findOne({ _id: userId, isDeleted: false })
    .select("-password -refresh_token")
    .populate("role_id", "name username");

  if (!user) {
    error["Not Found"] = "User Not Found";
    return res.error("User Not Found", 404, error);
  }

  if (user.role_id.username == "admin" || user.role_id.username == "writter") {
    error["Invalid"] = "Invalid Request";
    return res.error("Invalid Request", 404, error);
  }

  const userPermissions = await getRolePermissions(user.role_id._id);

  const hasPermission = userPermissions.find(
    (obj) => obj.username == "request_writer_role"
  );

  if (!hasPermission) {
    error["Invalid"] = "Invalid Request";
    return res.error("Invalid Request", 401, error);
  }

  const requestRecord = await Request.findOne({
    user_id: userId,
    isDeleted: false,
  });
  if (requestRecord) {
    if (requestRecord.status == "pending") {
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

  const user = await User.findOne({
    _id: requestRecord.user_id,
    isDeleted: false,
  }).populate("role_id", "name username");

  if (user.role_id.username != "admin") {
    error["Invalid"] = "Invalid Request";
    return res.error("Invalid Request", 401, error);
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

  const user = await User.findOne({
    _id: requestRecord.user_id,
    isDeleted: false,
  }).populate("role_id", "name username");

  if (user.role_id.username != "admin") {
    error["Invalid"] = "Invalid Request";
    return res.error("Invalid Request", 401, error);
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
