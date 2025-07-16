const Like = require("../models/likeModel");

const likePost = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.error("Blog Id is Missing");
    }

    const userId = req.user._id;

    const alreadyLiked = await Like.findOne({ blogId: id, userId });
    if (alreadyLiked) {
      return res.error("Already Liked");
    }

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
  res.send("disliked");
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

    if (!id) {
      return res.error("Blog Id is Missing");
    }

    const userId = req.user._id;

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
