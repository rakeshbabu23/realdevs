const createError = require("http-errors");
const { Group, SubmitPortfolio, User } = require("../models");
const thumbnailGeneration = require("../utils/thumbnailGeneration");
const createGroup = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const { groupName } = reqInfo.body;
  const checkGroupNameExists = await Group.findOne({ groupName: groupName });
  const checkUserExistingCreatedGroup = await Group.findOne({
    groupName,
    userId,
  });
  if (checkUserExistingCreatedGroup) {
    throw createError(
      409,
      "There is already active group created by you.Please stop that or choose different name"
    );
  }
  if (checkGroupNameExists) {
    throw createError(409, "Name already exists. Please choose another");
  }
  let newGroup;
  try {
    newGroup = new Group({
      groupName,
      userId: userId,
      active: true,
    });
    await newGroup.save();
  } catch (error) {
    throw createError(
      500,
      "Internal server error occurred while creating group"
    );
  }

  return newGroup;
};

const userGroups = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup/login");
  }
  const groups = await Group.find({ userId: userId });
  return groups;
};

const updateGroup = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const { groupId, active } = reqInfo.body;
  const group = await Group.findByIdAndUpdate(
    groupId,
    {
      active,
    },
    { new: true }
  );
  return group;
};

const getSubmittedPortfolios = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const { groupId } = reqInfo.params;
  const submitPortfolios = await SubmitPortfolio.find({
    groupId: groupId,
  }).populate({
    path: "userId",
    select: "email",
  });
  return submitPortfolios;
};
const getSubmittedPortfoliosOfUser = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const submitPortfolios = await SubmitPortfolio.find({
    userId: userId,
  }).populate("groupId");
  return submitPortfolios;
};

const submitPortfolio = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const { groupName, url } = reqInfo.body;
  const checkGroupExists = await Group.findOne({
    groupName: groupName,
    active: true,
  });
  if (!checkGroupExists) {
    throw createError(404, "Group not found or not active");
  }
  const checkUserAlreadySubmitted = await SubmitPortfolio.findOne({
    userId: userId,
    groupId: checkGroupExists._id,
  });
  if (checkUserAlreadySubmitted) {
    throw createError(400, "Portfolio already submitted");
  }
  let thumbnail;
  try {
    thumbnail = await thumbnailGeneration(url);
  } catch (error) {
    console.error("Thumbnail generation failed:", error.message);
    throw createError(400, error.message);
  }
  let submitPortfolio;
  try {
    submitPortfolio = new SubmitPortfolio({
      userId: userId,
      groupId: checkGroupExists._id,
      url: url,
      image: [thumbnail],
    });
    await submitPortfolio.save();
  } catch (error) {
    console.error("Failed to save portfolio:", error.message);
    throw createError(400, "internal server error while submitting");
  }

  return submitPortfolio;
};
module.exports = {
  createGroup,
  getSubmittedPortfolios,
  submitPortfolio,
  updateGroup,
  userGroups,
  getSubmittedPortfoliosOfUser,
};
