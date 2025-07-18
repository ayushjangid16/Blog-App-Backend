const Blog = require("../../models/blogModel");
const Like = require("../../models/likeModel");

const zod = require("zod");

const reactOnPost = async (req, res, next) => {
  const schema = zod.object({
    id: zod
      .string()
      .min(24, "Blog Id should be 24 Length")
      .max(24, "Blog ID Cannot Exceed Length of 24"),
    key: zod.string(),
  });
  const { id, key } = req.query;

  const result = schema.safeParse({ id, key });

  let error = {};
  if (!result.success) {
    result.error.errors.forEach((er) => {
      error[er.path[0]] = er.message;
    });
    return res.error("Validation Error", 400, error);
  }

  if (key != "like" && key != "dislike") {
    return res.error("Invalid Request");
  }

  const blog = await Blog.findOne({ _id: id, isDeleted: false });
  if (!blog) {
    return res.error("Blog Not Found", 404);
  }

  next();
};

const reactOnComment = async (req, res, next) => {
  const schema = zod.object({
    commentId: zod
      .string()
      .min(24, "Comment Id should be 24 Length")
      .max(24, "Comment ID Cannot Exceed Length of 24"),
    blogId: zod
      .string()
      .min(24, "Blog Id should be 24 Length")
      .max(24, "Blog ID Cannot Exceed Length of 24"),
    key: zod.string(),
  });
  const { commentId, blogId, key } = req.query;

  const result = schema.safeParse({ commentId, blogId, key });

  let error = {};
  if (!result.success) {
    result.error.errors.forEach((er) => {
      error[er.path[0]] = er.message;
    });
    return res.error("Validation Error", 400, error);
  }

  if (key != "like" && key != "dislike") {
    return res.error("Invalid Request");
  }

  const blog = await Blog.findOne({ _id: blogId, isDeleted: false });
  if (!blog) {
    return res.error("Blog Not Found", 404);
  }

  next();
};

module.exports = {
  reactOnComment,
  reactOnPost,
};
