const Blog = require("../models/blogModel");
const File = require("../models/fileModel");
const {
  transformBlogCollection,
  transformBlog,
} = require("../transformers/blogTransformer");

const slugify = require("slugify");
const { deleteFile } = require("../utils/deleteFile");
const Like = require("../models/likeModel");
const Comment = require("../models/commentModel");
const {
  transformCommentCollection,
} = require("../transformers/commentTransformer");

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
      .populate([
        {
          path: "likes",
          select: "_id blogId",
          match: {
            commentId: null,
          },
        },
        {
          path: "files",
          select: "_id url",
        },
        {
          path: "comments",
          select: "_id blogId message",
        },
      ]);

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
      .populate([
        {
          path: "likes",
          select: "_id blogId",
          match: {
            commentId: null,
          },
        },
        {
          path: "files",
          select: "_id url",
        },
        {
          path: "comments",
          select: "_id blogId message",
        },
      ]);

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
    const blog = await Blog.findOne({ _id: id, isDeleted: false }).populate([
      {
        path: "likes",
        select: "_id blogId",
        match: {
          commentId: null,
        },
      },
      {
        path: "files",
        select: "_id url",
      },
      {
        path: "comments",
        select: "_id blogId message",
      },
    ]);

    return res.success("Blog Fetched Successfully", transformBlog(blog));
  } catch (error) {
    console.error("Error in fetching blog:", error);
    return res.error("Internal Server Error");
  }
};

// all comments on blog
const allComments = async (req, res) => {
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

    console.log(finalData);
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

// to comment on a post
const comment = async (req, res) => {
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

// to react on a blog
const react = async (req, res) => {
  try {
    const { id, key } = req.query;

    const userId = req.user._id;

    if (key === "like") {
      const likeRecord = await Like.create({
        blogId: id,
        userId,
      });

      return res.success("Post Liked Successfully");
    }

    // dislike
    await Like.deleteOne({ blogId: id, userId });
    return res.success("Post DisLiked Successfully");
  } catch (error) {
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
  allComments,
  comment,
  react,
};
