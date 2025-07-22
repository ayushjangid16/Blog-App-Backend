const transformNotification = (notification) => {
  return {
    id: notification._id,
    sender: {
      id: notification.sender._id,
      fullname:
        notification.sender.first_name + " " + notification.sender.last_name,
    },
    recipient: {
      id: notification.recipient._id,
      fullname:
        notification.recipient.first_name +
        " " +
        notification.recipient.last_name,
    },
    message: notification.message,
    subject: notification.subject,
    deliveryStatus: notification.deliveryStatus,
    deliveredAt: notification.deliveredAt,
    isRead: notification.isRead,
    isSeen: notification.isSeen,
  };
};

const transformNotificationCollection = (notifications) => {
  return notifications.map(transformNotification);
};

module.exports = {
  transformNotificationCollection,
  transformNotification,
};
