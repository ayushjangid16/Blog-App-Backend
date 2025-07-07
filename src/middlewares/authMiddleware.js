const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const cache = require("../utils/cache");

const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers["cookie"];

    if (!authHeader) {
      return res.error("Unauthorized Access, Please Login Again", 401);
    }

    const token = authHeader.split(";")[0].split("=")[1];

    if (cache.get("token") === token) {
      return res.error("Token Is incorrect");
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.error("Token was incorrect");
    }

    const userId = verified._id;
    const user = await User.findOne({ _id: userId, isDeleted: false });

    if (!user) {
      return res.errror("Token Was Incorrect");
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.error("Internal Server Error", 501);
  }
};

module.exports = { authorize };
