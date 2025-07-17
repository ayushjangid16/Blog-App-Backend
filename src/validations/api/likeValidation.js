const Blog = require("../../models/blogModel");
const Like = require("../../models/likeModel");

const postLike = async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return res.error("Blog ID is Missing", 401);
  }

  const blog = await Blog.findOne({ _id: id, isDeleted: false });
  if (!blog) {
    return res.error("Blog Not Found", 404);
  }

  const userId = req.user._id;

  const alreadyLiked = await Like.findOne({ blogId: id, userId });
  if (alreadyLiked) {
    return res.error("Already Liked", 401);
  }

  next();
};

const commentLike = async (req, res, next) => {};

const postDislike = async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return res.error("Blog ID is Missing", 401);
  }

  const blog = await Blog.findOne({ _id: id, isDeleted: false });
  if (!blog) {
    return res.error("Blog Not Found", 404);
  }

  const userId = req.user._id;

  const alreadyLiked = await Like.findOne({ blogId: id, userId });
  if (!alreadyLiked) {
    return res.error("Invalid Request", 401);
  }

  next();
};

const commentDisklike = async (req, res, next) => {};

const allPostLikes = async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return res.error("Blog Id is Missing");
  }

  const blog = await Blog.findOne({ _id: id, isDeleted: false });
  if (!blog) {
    return res.error("Blog Not Found", 404);
  }

  next();
};

const allCommentLikes = async (req, res, next) => {};

module.exports = {
  postLike,
  commentLike,
  postDislike,
  commentDisklike,
  allPostLikes,
  allCommentLikes,
};
