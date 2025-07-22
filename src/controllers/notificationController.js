const Notification = require("../models/notificationModel");
const {
  transformNotificationCollection,
  transformNotification,
} = require("../transformers/notificationTransformer");

const index = async (req, res) => {
  try {
    let {
      page = 0,
      limit = 10,
      sort = "asc",
      sortBy = "createdAt",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const sortOrder = sort === "desc" ? -1 : 1;

    const total = await Notification.countDocuments({ isDeleted: false });

    const allNotifications = await Notification.find({
      isDeleted: false,
    })
      .sort({ [sortBy]: sortOrder })
      .skip(page * limit)
      .limit(limit)
      .populate([
        {
          path: "recipient",
          select: "first_name last_name",
        },
        {
          path: "sender",
          select: "first_name last_name",
        },
      ]);

    return res.success("All Notifications", {
      notifications: transformNotificationCollection(allNotifications),
      total,
      page,
      limit,
    });
  } catch (error) {
    console.log(error);
    return res.error("Internal Server Error");
  }
};

const singleNotification = async (req, res) => {
  try {
    const { id } = req.query;

    const record = await Notification.findOne({ _id: id, isDeleted: false });

    return res.success("Notification fetched.", {
      notification: transformNotification(record),
    });
  } catch (error) {
    console.log(error);
    return res.error("Internal Server Error");
  }
};

const userNotification = async (req, res) => {
  try {
    const allNotifications = await Notification.find({
      recipient: req.user._id,
      isDeleted: false,
    }).populate([
      {
        path: "recipient",
        select: "first_name last_name",
      },
      {
        path: "sender",
        select: "first_name last_name",
      },
    ]);

    return res.success("All Notifications", {
      notifications: transformNotificationCollection(allNotifications),
    });
  } catch (error) {
    return res.error("Internal Server Error");
  }
};

module.exports = {
  index,
  singleNotification,
  userNotification,
};
