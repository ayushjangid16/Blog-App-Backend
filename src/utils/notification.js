const Notification = require("../models/notificationModel");

const createNotification = async (data) => {
  try {
    const record = await Notification.create(data);

    return record;
  } catch (error) {
    return null;
  }
};

module.exports = { createNotification };
