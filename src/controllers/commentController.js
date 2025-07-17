const Comment = require("../models/commentModel");
const {
  transformCommentCollection,
  transformComment,
} = require("../transformers/commentTransformer");

const create = async (req, res) => {
  try {
    const { message, blogId, parentId } = req.body;

    const commentData = {
      blogId,
      userId: req.user._id,
      message,
    };

    if (parentId) {
      commentData.parentId = parentId;
    }

    const comment = await Comment.create(commentData);

    return res.success("Comment Created Successfully", comment);
  } catch (error) {
    console.error("Comment creation error:", error);
    return res.error("Internal Server Error", 501);
  }
};

const update = async (req, res) => {
  try {
    const { message, blogId, commentId } = req.body;

    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, blogId, userId: req.user._id },
      { message },
      { new: true }
    );

    return res.success("Comment Updated Successfully", comment);
  } catch (error) {
    return res.error("Internal Server Error", 501);
  }
};

const remove = async (req, res) => {
  try {
    const { blogId, commentId } = req.body;

    const allComments = await Comment.find({
      blogId: blogId,
    });

    let finalData = [];

    const commentMap = new Map();
    allComments.forEach((com) => {
      commentMap.set(com._id.toString(), { ...com.toObject(), replies: [] });
    });

    commentMap.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId.toString());
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        finalData.push(comment);
      }
    });

    const parentComment = finalData.find(
      (obj) => obj._id.toString() === commentId
    );

    let ids = [];

    function dfs(comment) {
      if (!comment || !comment.replies) {
        return;
      }

      ids.push(comment._id);

      for (let child of comment.replies) {
        dfs(child);
      }
    }

    dfs(parentComment);

    await Comment.deleteMany({ _id: { $in: ids } });

    return res.success("Comment Deleted Successfully");
  } catch (error) {
    console.log(error);
    return res.error("Internal Server Error", 501);
  }
};

// all comments on a post
const index = async (req, res) => {
  try {
    let { id, page = 0, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const allComments = await Comment.find({ blogId: id })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);

    let finalData = [];

    const commentMap = new Map();
    allComments.forEach((com) => {
      commentMap.set(com._id.toString(), { ...com.toObject(), replies: [] });
    });

    commentMap.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId.toString());
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        finalData.push(comment);
      }
    });

    const total = await Comment.countDocuments({ blogId: id });

    return res.success(
      "All Comments Fetched",
      {
        comments: transformCommentCollection(finalData),
      },
      {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      }
    );
  } catch (error) {
    console.error("Fetch comments error:", error);
    return res.error("Internal Server Error", 501);
  }
};

module.exports = {
  create,
  update,
  remove,
  index,
};
