const mongoose = require("mongoose");

const collaborationSchema = new mongoose.Schema(
  {
    object_type: {
      type: String,
      required: true,
    },
    object_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Collaboration = mongoose.model("Collaboration", collaborationSchema);
module.exports = Collaboration;
