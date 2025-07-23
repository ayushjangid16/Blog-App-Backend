const File = require("../models/fileModel");
const User = require("../models/userModel");
const { transformUser } = require("../transformers/userTransformer");
const { deleteFile } = require("../utils/deleteFile");

// get profile logged in user
const profile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId }).populate([
      { path: "followers" },
      { path: "following" },
      { path: "avatar_url" },
      {
        path: "posts",
        populate: {
          path: "files",
        },
      },
    ]);

    return res.success("User fetched Successfully", transformUser(user));
  } catch (error) {
    console.log(error);
    return res.error("Internal Server Error", 501);
  }
};

// update profile
const update = async (req, res) => {
  res.send("Updated profile");
};

const profilePicture = async (req, res) => {
  const userFile = req.file;
  try {
    const deleteOld = await File.deleteMany({
      uploadsable_id: req.user._id,
      uploadsable_type: "User",
      type: "User",
      file_type: "image",
    });
    const profileImage = await File.create({
      uploadsable_id: req.user._id,
      uploadsable_type: "User",
      url: `/storage/user/${userFile.filename}`,
      file_path: userFile.path,
      original_file_name: userFile.originalname,
      type: "User",
      file_type: "image",
      extension: userFile.mimetype,
    });

    return res.success("Profile Image Uplodaed");
  } catch (error) {
    deleteFile(userFile.path);
    return res.error("Internal Server Error");
  }
};

module.exports = {
  profile,
  update,
  profilePicture,
};
