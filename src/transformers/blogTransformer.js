const transformFile = (file) => {
  return {
    id: file._id,
    url: file.url,
  };
};

const transformBlog = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    description: blog.description,
    files: blog.files.map(transformFile),
  };
};

const transformBlogCollection = (blogs) => {
  return blogs.map(transformBlog);
};

module.exports = { transformBlogCollection };
