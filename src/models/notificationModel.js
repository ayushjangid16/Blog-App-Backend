const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
    },
    message: {
      type: String,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    uploadsable_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    uploadsable_type: {
      type: String,
    },
    type: {
      type: String,
      default: null, // Notification subtype
    },
    deliveryStatus: {
      type: String,
      enum: ["sent", "unsent"],
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    seenAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.methods = {
  markAsRead: async function () {
    if (!this.isRead) {
      this.isRead = true;
      this.readAt = new Date();
      return this.save();
    }
    return this;
  },

  markAsSeen: async function () {
    if (!this.isSeen) {
      if (!this.isRead) {
        this.isRead = true;
        this.readAt = new Date();
      }
      this.isSeen = true;
      this.seenAt = new Date();
      return this.save();
    }
    return this;
  },
};

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
