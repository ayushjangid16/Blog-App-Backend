const transformComment = (comment) => {
  return {
    id: comment._id,
    message: comment.message,
    userId: comment.userId,
    blogId: comment.blogId,
    parentId: comment.parentId,
    replies: transformCommentCollection(comment.replies) ?? [],
    likes: comment.likes,
  };
};

const transformCommentCollection = (comments) => {
  return comments.map(transformComment);
};

module.exports = { transformCommentCollection, transformComment };
