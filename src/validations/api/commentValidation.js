const Blog = require("../../models/blogModel");
const zod = require("zod");
const Comment = require("../../models/commentModel");

const createValidation = async (req, res, next) => {
  const schema = zod.object({
    message: zod.string().min(1, "Comment Cannot be Empty"),
    blogId: zod
      .string()
      .min(24, "Blog Id should be 24 Length")
      .max(24, "Blog ID Cannot Exceed Length of 24"),
  });
  const { message, blogId } = req.body;

  const result = schema.safeParse({ message, blogId });

  let error = {};
  if (!result.success) {
    result.error.errors.forEach((er) => {
      error[er.path[0]] = er.message;
    });
    return res.error("Validation Error", 400, error);
  }

  const blog = await Blog.findOne({ _id: blogId, isDeleted: false });
  if (!blog) {
    return res.error("Blog Not Found", 404);
  }

  next();
};

const editValidation = async (req, res, next) => {
  const schema = zod.object({
    message: zod.string().min(1, "Comment Cannot be Empty"),
    blogId: zod
      .string()
      .min(24, "Blog Id should be 24 Length")
      .max(24, "Blog ID Cannot Exceed Length of 24"),
    commentId: zod
      .string()
      .min(24, "Blog Id should be 24 Length")
      .max(24, "Blog ID Cannot Exceed Length of 24"),
  });
  const { message, commentId, blogId } = req.body;

  const result = schema.safeParse({ message, blogId, commentId });

  let error = {};
  if (!result.success) {
    result.error.errors.forEach((er) => {
      error[er.path[0]] = er.message;
    });
    return res.error("Validation Error", 400, error);
  }

  const blog = await Blog.findOne({ _id: blogId, isDeleted: false });
  if (!blog) {
    return res.error("Blog Not Found", 404);
  }

  const comment = await Comment.findOne({
    _id: commentId,
    userId: req.user._id,
    blogId: blogId,
  });

  if (!comment) {
    return res.error("Comment Not Found", 404);
  }

  next();
};

const deleteValidation = async (req, res, next) => {
  const schema = zod.object({
    blogId: zod
      .string()
      .min(24, "Blog Id should be 24 Length")
      .max(24, "Blog ID Cannot Exceed Length of 24"),
    commentId: zod
      .string()
      .min(24, "Blog Id should be 24 Length")
      .max(24, "Blog ID Cannot Exceed Length of 24"),
  });
  const { commentId, blogId } = req.body;

  const result = schema.safeParse({ blogId, commentId });

  let error = {};
  if (!result.success) {
    result.error.errors.forEach((er) => {
      error[er.path[0]] = er.message;
    });
    return res.error("Validation Error", 400, error);
  }

  const blog = await Blog.findOne({ _id: blogId, isDeleted: false });
  if (!blog) {
    return res.error("Blog Not Found", 404);
  }

  const comment = await Comment.findOne({
    _id: commentId,
    userId: req.user._id,
    blogId: blogId,
  });
  if (!comment) {
    return res.error("Comment Not Found", 404);
  }

  next();
};

const indexValidation = async (req, res, next) => {
  const schema = zod.object({
    id: zod
      .string()
      .min(24, "Blog Id should be 24 Length")
      .max(24, "Blog ID Cannot Exceed Length of 24"),
  });
  const { id } = req.query;

  const result = schema.safeParse({ id });

  let error = {};
  if (!result.success) {
    result.error.errors.forEach((er) => {
      error[er.path[0]] = er.message;
    });
    return res.error("Validation Error", 400, error);
  }

  const blog = await Blog.findOne({ _id: id, isDeleted: false });
  if (!blog) {
    return res.error("Blog Not Found", 404);
  }

  next();
};

module.exports = {
  createValidation,
  editValidation,
  deleteValidation,
  indexValidation,
};
