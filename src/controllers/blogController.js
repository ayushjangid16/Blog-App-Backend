const Blog = require("../models/blogModel");
const File = require("../models/fileModel");
const {
  transformBlogCollection,
  transformBlog,
} = require("../transformers/blogTransformer");

const slugify = require("slugify");
const { deleteFile } = require("../utils/deleteFile");

const createBlog = async (req, res) => {
  const blogFiles = req.files || [];

  const { title, description } = req.body;

  try {
    let slug = slugify(title, {
      replacement: "_",
      lower: true,
    });
    const blog = await Blog.create({
      title,
      slug,
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
  const { title, description, id } = req.body;

  if (!id) {
    return res.error("Blog Id is Missing.");
  }

  if (!title && !description) {
    return res.error("Title and Description Both are missing");
  }

  const userId = req.user._id;

  const blog = await Blog.findOne({
    _id: id,
    isDeleted: false,
    createdBy: userId,
  });

  if (!blog) {
    return res.error("Invalid Request");
  }

  const toUpdateData = {};

  if (title) {
    toUpdateData.title = title;
    toUpdateData.slug = slugify(title, {
      replacement: "_",
      lower: true,
    });
  }

  if (description) {
    toUpdateData.description = description;
  }

  const updatedBlog = await Blog.findOneAndUpdate(
    { _id: id, isDeleted: false, createdBy: userId },
    toUpdateData,
    { new: true }
  ).populate("files");

  return res.success("Blog Edited Successfully", transformBlog(updatedBlog));
};

const allBlogs = async (req, res) => {
  try {
    let {
      page = 0,
      limit = 10,
      search = "",
      sort = "asc",
      sortBy = "createdAt",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const sortOrder = sort === "desc" ? -1 : 1;

    const filter = {
      title: { $regex: search, $options: "i" },
      isDeleted: false,
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

const allBlogsOfUser = async (req, res) => {
  try {
    const id = req.user._id;
    let { page = 0, limit = 5, search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {
      title: { $regex: search, $options: "i" },
      isDeleted: false,
      createdBy: id,
    };

    const allBlogs = await Blog.find(filter)
      .skip(page * limit)
      .limit(limit)
      .populate("files");

    return res.success("All Blogs", {
      blogs: transformBlogCollection(allBlogs),
    });
  } catch (error) {
    return res.error("Internal Server Error");
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user._id;

    if (!id) {
      return res.error("Invalid Request");
    }

    const blog = await Blog.findOne({
      _id: id,
      isDeleted: false,
      createdBy: userId,
    });

    if (!blog) {
      return res.error("Invalid Request");
    }

    const deletedBlog = await Blog.findOneAndUpdate(
      { _id: id, isDeleted: false, createdBy: userId },
      {
        isDeleted: true,
      }
    );

    return res.success("Blog Deleted Successfully");
  } catch (error) {
    console.log("Error Deleting ", error);
    return res.error("Internal Sever Error");
  }
};

const singleBlog = async (req, res) => {
  try {
    const { id } = req.query;
    const blog = await Blog.findOne({ _id: id, isDeleted: false }).populate(
      "files"
    );

    return res.success("Blog Fetched Successfully", transformBlog(blog));
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
  allBlogsOfUser,
};
