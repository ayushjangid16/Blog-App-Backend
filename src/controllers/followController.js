const Follow = require("../models/userConnectionModel");

const follow = async (req, res) => {
  try {
    const { follower, following } = req.body;

    await Follow.create({
      follower_id: follower,
      following_id: following,
    });

    return res.success("Followed Successfully");
  } catch (error) {
    return res.error("Internal Server Error");
  }
};

const unfollow = async (req, res) => {
  try {
    const { follower, following } = req.body;

    await Follow.findOneAndDelete({
      follower_id: follower,
      following_id: following,
    });

    return res.success("Unfollowed Successfully");
  } catch (error) {
    return res.error("Internal Server Error");
  }
};

module.exports = {
  follow,
  unfollow,
};
