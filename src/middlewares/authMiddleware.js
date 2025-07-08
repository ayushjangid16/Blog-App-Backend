const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const cache = require("../utils/cache");

const authorize = async (req, res, next) => {
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
    }).select("-password -refresh_token");

    if (!user) {
      return res.error("User not found or deleted.", 404);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authorization Error:", error);
    return res.error("Internal Server Error", 500);
  }
};

module.exports = { authorize };
