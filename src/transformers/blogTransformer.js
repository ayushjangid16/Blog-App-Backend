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

const transformUser = (user) => {
  return {
    id: user._id,
    fullname: user.first_name + " " + user.last_name,
  };
};

const transformBlog = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    description: blog.description,
    files: blog.files.map(transformFile),
    likes: blog.likes,
    comments: blog.comments,
    owner: transformUser(blog.createdBy),
    likedByMe: blog.likedByMe,
  };
};

const transformBlogCollection = (blogs) => {
  return blogs.map(transformBlog);
};

module.exports = { transformBlogCollection, transformBlog };
