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

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
