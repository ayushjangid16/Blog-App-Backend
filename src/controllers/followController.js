const Notification = require("../models/notificationModel");
const Follow = require("../models/userConnectionModel");
const { createNotification } = require("../utils/notification");

const follow = async (req, res) => {
  try {
    const { following } = req.body;

    const record = await Follow.create({
      follower_id: req.user._id,
      following_id: following,
    });

    let data = {
      subject: "You have a new follower!",
      message: `A User is now following you.`,
      type: "Follow",
      uploadsable_id: record._id,
      uploadsable_type: "Follow",
      sender: req.user._id,
      recipient: following,
      deliveryStatus: "sent",
      deliveredAt: new Date(),
      isRead: false,
      isSeen: false,
    };

    const notify = await createNotification(data);
    if (!notify) {
      throw new Error("Error Creation in Notification");
    }

    return res.success("Followed Successfully");
  } catch (error) {
    return res.error("Internal Server Error");
  }
};

const unfollow = async (req, res) => {
  try {
    const { following } = req.body;

    await Follow.findOneAndDelete({
      follower_id: req.user._id,
      following_id: following,
    });

    return res.success("Unfollowed Successfully");
  } catch (error) {
    return res.error("Internal Server Error");
  }
};

module.exports = {
  follow,
  unfollow,
};
