const transformUser = (user) => {
  return {
    id: user._id,
    fullname: user.first_name + " " + user.last_name,
  };
};

const transformComment = (comment) => {
  return {
    id: comment._id,
    message: comment.message,
    userId: transformUser(comment.userId),
    blogId: comment.blogId,
    parentId: comment.parentId,
    likes: comment.likes,
    likedByMe: comment.likedByMe,
    replies: transformCommentCollection(comment.replies) ?? [],
  };
};

const transformCommentCollection = (comments) => {
  return comments.map(transformComment);
};

module.exports = { transformCommentCollection, transformComment };
