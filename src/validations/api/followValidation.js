const zod = require("zod");
const Follow = require("../../models/userConnectionModel");

const followValidation = async (req, res, next) => {
  const schema = zod.object({
    following: zod
      .string()
      .min(24, "Following Id Should have atleast 24 Length")
      .max(24, "Following Id cannot exceed length of 24"),
  });
  const { following } = req.body;

  const result = schema.safeParse({ following });
  const error = {};

  if (!result.success) {
    for (const er of result.error.errors) {
      error[er.path[0]] = er.message;
    }
    return res.error("Validation Error", 400, error);
  }

  if (req.user._id === following) {
    return res.error("Invalid Request");
  }

  const exists = await Follow.findOne({
    follower_id: req.user._id,
    following_id: following,
  });

  if (exists) {
    return res.error("Already Following this User");
  }

  next();
};

const unfollowValidation = async (req, res, next) => {
  const schema = zod.object({
    following: zod
      .string()
      .min(24, "Following Id Should have atleast 24 Length")
      .max(24, "Following Id cannot exceed length of 24"),
  });
  const { following } = req.body;

  const result = schema.safeParse({ following });
  const error = {};

  if (!result.success) {
    for (const er of result.error.errors) {
      error[er.path[0]] = er.message;
    }
    return res.error("Validation Error", 400, error);
  }

  const record = await Follow.findOne({
    follower_id: req.user._id,
    following_id: following,
  });

  if (!record) {
    return res.error("Invalid Request");
  }

  next();
};

module.exports = {
  followValidation,
  unfollowValidation,
};
