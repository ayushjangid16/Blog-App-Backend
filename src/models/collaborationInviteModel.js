const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: null,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: null,
    },
    object_type: {
      type: String,
      required: true,
    },
    object_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
    },
    responded_at: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const CollaborationInvite = mongoose.model("CollaborationInvite", inviteSchema);

module.exports = CollaborationInvite;
