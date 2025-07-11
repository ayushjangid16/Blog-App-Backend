const mongoose = require("mongoose");

// uploadsable_id -> id of from where it is uploaded (UserProfile / Blog)
// uploadsable_type -> UserProfile / Blog
// file_path -> path of file
// original_file_name -> name of file
// type -> UserProfile / Blog
// file_type -> image/jpeg

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
