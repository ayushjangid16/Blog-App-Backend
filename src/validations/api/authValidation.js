const zod = require("zod");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerValidation = async (req, res, next) => {
  const schema = zod.object({
    first_name: zod
      .string()
      .max(10, "First Name should not be more than 10 characters"),
    last_name: zod
      .string()
      .max(10, "Last Name should not be more than 10 characters"),
    email: zod.string().email("Email should be valid"),
    password: zod
      .string()
      .min(5, "Password should be min of 5 length")
      .max(18, "Password cannot exceed length of 18"),
  });

  const { first_name, last_name, email, password } = req.body;
  const result = schema.safeParse({ first_name, last_name, email, password });

  let error = {};
  if (!result.success) {
    result.error.errors.forEach((er) => {
      error[er.path[0]] = er.message;
    });
    return res.error("Validation Error", 400, error);
  }

  const existsUser = await User.findOne({ email, isDeleted: false });
  if (existsUser) {
    error["User"] = "User with same email already exists.";
    return res.error("Duplicate Email", 409, error);
  }

  next();
};

const loginValidation = async (req, res, next) => {
  const schema = zod.object({
    email: zod.string().email("Email should be valid"),
    password: zod
      .string()
      .min(5, "Password should be min of 5 length")
      .max(18, "Password cannot exceed length of 18"),
  });

  const { email, password } = req.body;
  const result = schema.safeParse({ email, password });

  let error = {};
  if (!result.success) {
    result.error.errors.forEach((er) => {
      error[er.path[0]] = er.message;
    });
    return res.error("Validation Error", 400, error);
  }

  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    error["User"] = "User not found";
    return res.error("User Not Found", 404, error);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    error["Password"] = "Password incorrect";
    return res.error("Password Incorrect", 401, error);
  }

  next();
};

const refreshAccessTokenValidation = async (req, res, next) => {
  try {
    const refreshToken =
      req.headers["cookie"]
        ?.split(";")
        .find((c) => c.trim().startsWith("refresh_token="))
        ?.split("=")[1] || req.body.refresh_token;

    if (!refreshToken) {
      return res.error("Refresh token missing", 400);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      return res.error("Token is invalid", 401);
    }

    const user = await User.findOne({ _id: decoded._id, isDeleted: false });
    if (!user) {
      return res.error("User not found", 404);
    }

    if (user.refresh_token !== refreshToken) {
      return res.error("Token mismatch", 401);
    }

    next();
  } catch (error) {
    console.error(error);
    return res.error("Internal Server Error", 500);
  }
};

const resetPasswordValidation = async (req, res, next) => {
  const schema = zod.object({
    password: zod
      .string()
      .min(5, "Password should be min of 5 length")
      .max(18, "Password cannot exceed length of 18"),
    confirmPassword: zod
      .string()
      .min(5, "Password should be min of 5 length")
      .max(18, "Password cannot exceed length of 18"),
  });

  const { password, confirmPassword } = req.body;
  const result = schema.safeParse({ password, confirmPassword });

  let error = {};
  if (!result.success) {
    result.error.errors.forEach((er) => {
      error[er.path[0]] = er.message;
    });
    return res.error("Validation Error", 400, error);
  }

  if (password !== confirmPassword) {
    error["Message"] = "Password and Confirm Password do not match!";
    return res.error("Validation Error", 400, error);
  }

  const { id } = req.query;
  const user = await User.findOne({ _id: id, isDeleted: false }).select(
    "-refresh_token"
  );

  if (!user) {
    error["User"] = "User not found!";
    return res.error("User Not Found", 404, error);
  }

  const isSame = await bcrypt.compare(password, user.password);

  if (isSame) {
    error["Password"] = "New Password cannot be same as Previous!";
    return res.error("Validation Error", 400, error);
  }

  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  refreshAccessTokenValidation,
  resetPasswordValidation,
};
