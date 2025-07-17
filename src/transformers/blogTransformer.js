const transformFile = (file) => {
  return {
    id: file._id,
    url: file.url,
  };
};

const transformLike = (like) => {
  return {
    id: like._id,
    blogId: like.blogId,
  };
};

const transformComment = (comment) => {
  return {
    id: comment._id,
    blogId: comment.blogId,
    message: comment.message,
  };
};

const transformBlog = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    description: blog.description,
    files: blog.files.map(transformFile),
    likes: blog.likes.map(transformLike),
    comments: blog.comments.map(transformComment),
  };
};

const transformBlogCollection = (blogs) => {
  return blogs.map(transformBlog);
};

module.exports = { transformBlogCollection, transformBlog };
