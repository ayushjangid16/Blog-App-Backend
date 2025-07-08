const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

const cache = require("../utils/cache");
const { sendEmail } = require("../utils/sendEmail");

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // role user
    const userRole = await Role.findOne({ name: "User", isDeleted: false });

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    const createdUser = new User({
      email,
      first_name,
      last_name,
      role_id: userRole._id,
      password: hashPassword,
    });

    // now sent a mail of jwt token to the user
    const userData = { email, _id: createdUser._id };
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: "20m",
    });
    const refreshToken = jwt.sign(userData, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "20d",
    });

    cache.set("token", token);

    // save refresh token too
    createdUser.refresh_token = refreshToken;

    createdUser.save();

    // now send this token to user mail
    let url = `http://localhost:8000/api/auth/verify?token=${token}`;

    let html = `
    <h2>Please Verfiy Yourself</h2>
    <a href=${url}  style="background-color: #04AA6D; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; text-decoration:none;">Click Me</a>
    `;

    await sendEmail(
      "Email Verification",
      email,
      "Email Verification",
      "Click button Inorder to Verify your Email",
      html
    );
    return res.success("User created Successfully", {}, { token });
  } catch (error) {
    console.log(error);
    return res.error("Internal Server Error!", 501);
  }
};

const verifyUser = async (req, res) => {
  try {
    const { token } = req.query;

    // verify this token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.error("Token was incorrect");
    }

    // find the user from the token email or id
    const _id = verified._id;

    let user = await User.findById(_id);
    if (!user) {
      return res.error("User Not Found", 404);
    }
    user.isVerified = true;
    user.status = "active";

    user.save();
    return res.success("User Verified Successfully");
  } catch (error) {
    return res.error("Internal Server Error!", 501);
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isDeleted: false }).select(
      "-password -refresh_token"
    );

    // now password is correct gave back the token
    const userData = { email, _id: user._id };
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: "20m",
    });

    // generate refresh token too
    const refreshToken = jwt.sign(userData, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "20d",
    });

    user.refresh_token = refreshToken;
    user.save();

    return res.success("User logged In Successfully", user, { token });
  } catch (error) {
    console.log(error);
    return res.error("Internal Server Error!", 501);
  }
};

const logout = async (req, res) => {
  let option = {
    httpOnly: true,
    secure: true,
  };
  res.clearCookie("accessToken", option);
  res.clearCookie("refreshToken", option);
  return res.success("Logout Successfully");
};

const refreshAccessToken = async (req, res) => {
  const refreshToken =
    req.headers["cookie"].split(";")[1].split("=")[1] || req.body;

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await User.findOne({ _id: decoded._id, isDeleted: false });

  const newAccessToken = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET
  );
  const newRefreshToken = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET
  );

  user.refresh_token = newRefreshToken;
  user.save();

  return res.success("Refresh Token Generated Successfully", {
    token: newAccessToken,
  });
};

const resetPasssword = async (req, res) => {
  try {
    const user = req.user;
    const authHeader = req.headers["cookie"];

    const token = authHeader.split(";")[0].split("=")[1];

    let url = `http://localhost:8000/api/auth/verify-reset-password?id=${user._id}&token=${token}`;

    let html = `
      <h2>Reset Password</h2>
      <a href=${url}  style="background-color: #04AA6D; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; text-decoration:none;">Click Me</a>
      `;

    // send the password reset mail to this user
    await sendEmail(
      "Password Reset",
      user.email,
      "Password Reset Link",
      "Click the Button in order to Reset your password",
      html
    );

    return res.success("Password Reset is Sent over the Mail");
  } catch (error) {
    console.log(error);
    return res.error("Internal Server Error!", 501);
  }
};

const verifyResetPassword = async (req, res) => {
  try {
    const { id } = req.query;
    const { password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        password: hashPassword,
      },
      { new: true }
    ).select("-password -refresh_token");

    return res.success("Password Reset Successfully");
  } catch (error) {
    console.log(error);
    return res.error("Internal Server Error!", 501);
  }
};

module.exports = {
  registerUser,
  verifyUser,
  login,
  logout,
  refreshAccessToken,
  resetPasssword,
  verifyResetPassword,
};
