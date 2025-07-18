const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // the user following to which user
    // example A follows B then FollowerId = A.id, and FollowingId = B.id
    following_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;
