const createError = require("http-errors");
const { User, Token } = require("../models");
const { passwordValidation } = require("../utils/helper");
const logger = require("../utils/logger");
const customSignUp = async (reqInfo) => {
  const { email, password, userName } = reqInfo.body;
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw createError(400, "Email already exists.Please login");
  }
  const userNameExists = await User.findOne({ userName });
  if (userNameExists) {
    throw createError(400, "user name has already taken.");
  }
  let newUser;
  try {
    newUser = new User({
      email,
      password,
      userName,
    });
    await newUser.save();
  } catch (error) {
    console.log("Error creating user", error);
    throw createError(400, "Internal server error");
  }

  logger.info("created new user");
  const user = newUser.toObject();
  delete user.password;
  return user;
};

const googleSignUp = async (email, displayName) => {
  const user = await User.findOne({ email });
  if (user) {
    return user;
  }
  const userName = displayName.split(" ");
  let firstName = "",
    lastName = "";

  if (userName.length <= 1) {
    firstName = displayName;
    lastName = "";
  } else {
    firstName = userName[0];
    lastName = userName.slice(1).join("");
  }
  const newUser = new User({ email, firstName, lastName });
  await newUser.save();
  return newUser;
};

const customLogin = async (reqInfo) => {
  logger.info("custome login authservice");
  const { userName, email, password } = reqInfo.body;
  const user = await User.findOne({ $or: [{ email }, { userName }] });
  logger.info("Found user with email");
  if (!user || !(await user.comparePassword(password))) {
    throw createError(401, "Invalid email or password");
  }
  return user;
};

const logout = async (userId) => {
  logger.info("logout authservice");
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found");
  }
  await Token.deleteOne({
    user: userId,
  });
  logger.info("Token deleted");
  return;
};

module.exports = {
  customSignUp,
  googleSignUp,
  customLogin,
  logout,
};
