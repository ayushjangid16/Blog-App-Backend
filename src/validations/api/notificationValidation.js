const Notification = require("../../models/notificationModel");

const indexValidation = async (req, res, next) => {
  const userRole = req.role;

  //   if (userRole != "admin") {
  //     return res.error("Invallid Request");
  //   }

  next();
};

const singleNotificationValidation = async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return res.error("Notification Id is Missing");
  }

  const record = await Notification.findOne({ _id: id, isDeleted: false });
  if (!record) {
    return res.error("Notification Not Found", 404);
  }

  next();
};
module.exports = {
  indexValidation,
  singleNotificationValidation,
};
