const mongoose = require("mongoose");

// uploadsable_id ->
// uploadsable_type -> UserProfile / Blog
// file_path -> path of file
// original_file_name -> name of file
// type -> UserProfile / Blog
// file_type -> image/jpeg

// blog -> files(blogId)

const fileSchema = new mongoose.Schema(
  {
    uploadsable_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    uploadsable_type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      default: null,
    },
    file_path: {
      type: String,
      required: true,
    },
    original_file_name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    file_type: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
