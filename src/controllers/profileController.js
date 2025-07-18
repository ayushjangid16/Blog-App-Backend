const User = require("../models/userModel");
const { transformUser } = require("../transformers/userTransformer");

// get profile
const profile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId }).populate([
      { path: "followers" },
      { path: "following" },
    ]);

    return res.success("User fetched Successfully", transformUser(user));
  } catch (error) {
    return res.error("Internal Server Error", 501);
  }
};

// update profile
const update = async (req, res) => {
  res.send("Updated profile");
};

module.exports = {
  profile,
  update,
};
