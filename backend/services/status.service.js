const createError = require("http-errors");
const { Status, User } = require("../models");

const createStatus = async (reqInfo) => {
  const user = await User.findById(reqInfo.userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const newStatus = new Status({ userId: reqInfo.userId, ...req.body });
  const status = await newStatus.save();
  if (!status) {
    throw createError(500, "Failed to create status");
  }
  return status;
};

const getStatuses = async (reqInfo) => {
  const user = await User.findById(reqInfo.userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const pipeline = [
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: user.location.coordinates,
        },
        distanceField: "distance",
        spherical: true,
        maxDistance: Number(reqInfo.radius) * 1000,
      },
    },
  ];
  const statuses = await Status.aggregate(pipeline);
  return statuses;
};

const incrementCountOfStatus = async (reqInfo) => {
  const user = await User.findById(reqInfo.userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const status = await Status.findByIdAndUpdate(
    reqInfo.statusId,
    { $inc: { viewCount: 1 } },
    { new: true }
  );
  if (!status) {
    throw createError(500, "Failed to increment status count");
  }
  return status;
};

module.exports = { createStatus, getStatuses, incrementCountOfStatus };
