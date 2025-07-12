const Blog = require("../models/blogModel");
const File = require("../models/fileModel");
const { transformBlogCollection } = require("../transformers/blogTransformer");
const fs = require("fs").promises;

const deleteFile = async (file) => {
  if (file?.path) {
    try {
      await fs.unlink(file.path);
      console.log(`Deleted file: ${file.path}`);
    } catch (err) {
      console.error(`Failed to delete file: ${file.path}`, err);
    }
  }
};

const createBlog = async (req, res) => {
  const blogFiles = req.files || [];

  const { title, description } = req.body;

  try {
    const blog = await Blog.create({
      title,
      description,
      createdBy: req.user._id,
    });

    const allFiles = blogFiles.map((file) => ({
      uploadsable_id: blog._id,
      uploadsable_type: "Blog",
      url: `/storage/blog/${file.filename}`,
      file_path: file.path,
      original_file_name: file.originalname,
      type: "Blog",
      file_type: "image",
      extension: file.mimetype,
    }));

    await File.insertMany(allFiles);

    return res.success("Blog Created Successfully", blog);
  } catch (error) {
    for (const file of blogFiles) {
      await deleteFile(file);
    }
    console.error("Error creating blog:", error);
    return res.error("Internal Server Error");
  }
};

const editBlog = async (req, res) => {
  res.send("Editting blog");
};

const allBlogs = async (req, res) => {
  try {
    let {
      page = 0,
      limit = 5,
      search = "",
      sort = "asc",
      sortBy = "createdAt",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const sortOrder = sort === "desc" ? -1 : 1;

    const filter = {
      title: { $regex: search, $options: "i" },
    };

    const total = await Blog.countDocuments(filter);

    const blogs = await Blog.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(page * limit)
      .limit(limit)
      .populate("files");

    return res.success("All Blogs", {
      blogs: transformBlogCollection(blogs),
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error in fetching blogs:", error);
    return res.error("Internal Server Error");
  }
};

const deleteBlog = async (req, res) => {
  res.send("deleting Blog");
};

const singleBlog = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) return res.error("Invalid Request");

    const blog = await Blog.findOne({ _id: id, isDeleted: false }).populate(
      "files"
    );

    const allBlogs = [];
    allBlogs.push(blog);

    return res.success("Blog Fetched Successfully", {
      blog: transformBlogCollection(allBlogs)[0],
    });
  } catch (error) {
    console.error("Error in fetching blog:", error);
    return res.error("Internal Server Error");
  }
};

module.exports = {
  createBlog,
  editBlog,
  deleteBlog,
  allBlogs,
  singleBlog,
};
