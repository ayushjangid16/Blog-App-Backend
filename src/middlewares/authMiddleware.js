const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const cache = require("../utils/cache");
const RoleWithPermission = require("../models/rolePermissionModel");

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

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.error("Please Provide a Token.", 401);
    }

    const token = authHeader.split(" ")[1];

    let verified;
    try {
      verified = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.error("Invalid or expired token.", 401);
    }

    const user = await User.findOne({
      _id: verified._id,
      isDeleted: false,
    })
      .select("-password -refresh_token")
      .populate("role_id", "name username");
    if (!user) {
      return res.error("User not found or deleted.", 404);
    }

    const allPermissions = getRolePermissions(user.role_id._id);

    req.permissions = allPermissions;
    req.role = user.role_id.username;
    req.user = user;

    next();
  } catch (error) {
    console.error("Authorization Error:", error);
    return res.error("Internal Server Error", 500);
  }
};

module.exports = { authenticate };
