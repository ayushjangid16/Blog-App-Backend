const Like = require("../models/likeModel");

const likePost = async (req, res) => {
  try {
    const { id } = req.query;

    const userId = req.user._id;

    const likeRecord = await Like.create({
      blogId: id,
      userId,
    });

    return res.success("Post Liked Successfully");
  } catch (error) {
    return res.error("Internal Server Error");
  }
};

const dislikePost = async (req, res) => {
  try {
    const { id } = req.query;

    const userId = req.user._id;

    await Like.deleteOne({ blogId: id, userId });

    return res.success("Post DisLiked Successfully");
  } catch (error) {
    return res.error("Internal Server Error");
  }
};

const likeComment = async (req, res) => {
  res.send("Comment liked");
};

const dislikeComment = async (req, res) => {
  res.send("Disliked Comment");
};

const allLikesOnPost = async (req, res) => {
  try {
    const { id } = req.query;

    const likeCount = await Like.countDocuments({
      blogId: id,
    });

    return res.success("Post Liked Successfully", {
      total: likeCount,
    });
  } catch (error) {
    return res.error("Internal Server Error");
  }
};

const allLikesOnComment = async (req, res) => {
  res.send("All Likes on Comment");
};

module.exports = {
  likePost,
  likeComment,
  dislikePost,
  dislikeComment,
  allLikesOnPost,
  allLikesOnComment,
};
