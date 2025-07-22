const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");
const Like = require("../models/likeModel");
const { createNotification } = require("../utils/notification");

// update comment
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

// remove comment
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

// react on comment
const react = async (req, res) => {
  try {
    const { commentId, blogId, key } = req.query;

    if (key == "like") {
      const likeRecord = await Like.create({
        blogId,
        commentId,
        userId: req.user._id,
      });

      const commentOwner = await Comment.findOne({ _id: commentId, blogId });

      let data = {
        subject: "Your comment got a like!",
        message: `A User liked your comment.`,
        type: "Comment Like",
        uploadsable_id: likeRecord._id,
        uploadsable_type: "Like",
        sender: req.user._id,
        recipient: commentOwner.userId,
        deliveryStatus: "sent",
        deliveredAt: new Date(),
        isRead: false,
        isSeen: false,
      };

      const notify = await createNotification(data);
      if (!notify) {
        throw new Error("Error Creation in Notification");
      }

      return res.success("Comment Liked Successfully");
    }

    // dislike
    await Like.findOneAndDelete({
      commentId: commentId,
      blogId: blogId,
      userId: req.user._id,
    });

    return res.success("Comment Disliked Successfully");
  } catch (error) {
    return res.error("Internal Server Error");
  }
};

module.exports = {
  update,
  remove,
  react,
};
