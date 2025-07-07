const zod = require("zod");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerValidation = async (req, res, next) => {
  const schema = zod.object({
    first_name: zod
      .string()
      .max("10", "First Name should not be more than 10 characters"),
    last_name: zod
      .string()
      .max("10", "Last Name should not be more than 10 characters"),
    email: zod.string().email("Email should be valid"),
    password: zod
      .string()
      .min(5, "Password should be min of 5 length")
      .max(18, "Password cannot Exceed length of 18"),
  });
  const { first_name, last_name, email, password } = req.body;

  const result = schema.safeParse({ first_name, last_name, email, password });
  let error = {};
  if (!result.success) {
    let allErrors = result.error.errors;

    allErrors.forEach((er) => {
      error[er.path[0]] = er.message;
    });

    return res.error("Validation Error", 401, error);
  }

  // check same email user exists or not
  const existsUser = await User.findOne({ email, isDeleted: false });
  if (existsUser) {
    error["User"] = "User with Same Email Already Exists.";
    return res.error("Duplicate Email", 401, error);
  }

  next();
};

const loginValidation = async (req, res, next) => {
  const schema = zod.object({
    email: zod.string().email("Email should be Valid"),
    password: zod
      .string()
      .min(5, "Password should be min of 5 length")
      .max(18, "Password cannot Exceed length of 18"),
  });

  const { email, password } = req.body;
  const result = schema.safeParse({ email, password });

  let error = {};
  if (!result.success) {
    let allErrors = result.error.errors;

    allErrors.forEach((er) => {
      error[er.path[0]] = er.message;
    });

    return res.error("Validation Error", 401, error);
  }

  // find user
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    error["User"] = "User Not Found";
    return res.error("User Not Found", 404, error);
  }

  // now verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    error["Password"] = "Password Incorrect";
    return res.error("Password Incorrect", 400, error);
  }

  next();
};

const refreshAccessTokenValidation = async (req, res, next) => {
  try {
    const refreshToken =
      req.headers["cookie"].split(";")[1].split("=")[1] || req.body;

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      return res.error("Token is incorrect", 401);
    }

    const user = await User.findOne({ _id: decoded._id, isDeleted: false });
    if (!user) {
      return res.error("Token is incorrect", 401);
    }

    if (user.refresh_token !== refreshToken) {
      return res.error("Token is incorrect", 401);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.error("Internal Server Error", 501);
  }
};

module.exports = {
  registerValidation,
  loginValidation,
  refreshAccessTokenValidation,
};
