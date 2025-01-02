const createError = require("http-errors");
const { User } = require("../models");

const updateProfile = async (reqInfo) => {
  const user = await User.findById(reqInfo.userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }

  Object.assign(user, userInfo);
  await user.save();
  return user;
};

const nearByInterests = async (reqInfo) => {
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
        maxDistance: Number(reqInfo.radius) * 1000,
        spherical: true,
      },
    },
  ];

  const userInterests = await User.aggregate(pipeline);
  const uniqueInterests = [
    ...new Set(userInterests.map((interest) => interest.interests).flat()),
  ];

  return { uniqueInterests, userInterests };
};

const nearByPeople = async (reqInfo) => {
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
        maxDistance: Number(reqInfo.radius) * 1000,
        spherical: true,
      },
    },
    {
      $match: {
        interests: { $in: reqInfo.interests },
      },
    },
    {
      $project: {
        password: 0,
      },
    },
  ];

  const userNearbyPeople = await User.aggregate(pipeline);

  return userNearbyPeople;
};

const userInfo = async (reqInfo) => {
  const user = await User.findById(reqInfo.userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  return user;
};

module.exports = {
  updateProfile,
  nearByInterests,
  nearByPeople,
};
