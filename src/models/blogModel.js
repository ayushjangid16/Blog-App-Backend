const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

blogSchema.virtual("files", {
  ref: "File",
  localField: "_id",
  foreignField: "uploadsable_id",
  justOne: false,
  match: { uploadsable_type: "Blog" },
});

blogSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "blogId",
  justOne: false,
  count: true,
});

blogSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "blogId",
  justOne: false,
  count: true,
});

blogSchema.virtual("likedByMe", {
  ref: "Like",
  localField: "_id",
  foreignField: "blogId",
  count: true,
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
