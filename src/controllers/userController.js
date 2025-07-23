const User = require("../models/userModel");
const {
  transformUser,
  transformUserProfile,
} = require("../transformers/userTransformer");

const userProfile = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await User.findOne({ _id: id }).populate([
      { path: "followers" },
      { path: "following" },
      { path: "avatar_url" },
      {
        path: "followedByMe",
        match: {
          following_id: id,
          follower_id: req.user._id,
        },
      },
      {
        path: "posts",
        populate: [
          {
            path: "files",
          },
          {
            path: "createdBy",
          },
          {
            path: "likes",
            match: {
              commentId: null,
            },
          },
          { path: "comments" },
        ],
      },
    ]);

    if (!user) {
      return res.error("User Not Found", 404);
    }

    return res.success("User fetched Successfully", transformUserProfile(user));
  } catch (error) {
    console.log(error);
    return res.error("Internal Server Error", 501);
  }
};

module.exports = {
  userProfile,
};
