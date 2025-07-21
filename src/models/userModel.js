const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
      default: null,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      default: null,
    },
    country_code: {
      type: String,
      default: null,
    },
    phone_number: {
      type: String,
    },
    password_reset_token: {
      type: String,
      default: null,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspend"],
      default: "inactive",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    user_type: {
      type: String,
      enum: ["platform_user", "system_user"],
      default: "platform_user",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
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

userSchema.virtual("followers", {
  ref: "Follow",
  localField: "_id",
  foreignField: "following_id",
  justOne: false,
  count: true,
});
userSchema.virtual("following", {
  ref: "Follow",
  localField: "_id",
  foreignField: "follower_id",
  justOne: false,
  count: true,
});

userSchema.virtual("avatar_url", {
  ref: "File",
  localField: "_id",
  foreignField: "uploadsable_id",
  justOne: false,
  match: { uploadsable_type: "User" },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
