const Request = require("../models/requestModel");
const Role = require("../models/roleModel");
const User = require("../models/userModel");

const createRequest = async (req, res) => {
  try {
    const { userId } = req.body;

    // now save it to request db
    const requestData = await Request.create({
      user_id: userId,
      status: "pending",
    });

    return res.success("Request Created Successfully", requestData);
  } catch (error) {
    return res.error("Internal Server Error", 501);
  }
};

const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const requestRecord = await Request.findOneAndUpdate(
      { _id: requestId, isDeleted: false },
      {
        status: "accepted",
      },
      { new: true }
    );

    // find writter role
    const writterRole = await Role.findOne({
      username: "writter",
      isDeleted: false,
    });
    // update the user
    const userRecord = await User.findOneAndUpdate(
      { _id: requestRecord.user_id, isDeleted: false },
      {
        role_id: writterRole._id,
      },
      { new: true }
    );

    return res.success("Request Approved");
  } catch (error) {
    return res.error("Internal Server Error", 501);
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const requestRecord = await Request.findOneAndUpdate(
      { _id: requestId, isDeleted: false },
      {
        status: "rejected",
      },
      { new: true }
    );

    return res.success("Request Rejected");
  } catch (error) {
    return res.error("Internal Server Error", 501);
  }
};

const getAllRequests = async (req, res) => {
  try {
    const allRequests = await Request.find({ isDeleted: false });

    return res.success("All Requests", allRequests);
  } catch (error) {
    return res.error("Internal Server Error", 501);
  }
};

module.exports = {
  createRequest,
  approveRequest,
  rejectRequest,
  getAllRequests,
};
