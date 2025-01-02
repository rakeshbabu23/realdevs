const jwt = require("jsonwebtoken");
const { Token } = require("../models");
const logger = require("../utils/logger");
// Generate an access token
const generateAccessToken = (userId) => {
  logger.info(`Gnerating access token for ${userId}`);

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES, // Ensure expiration time is in minutes
  });
};

// Generate a refresh token and save it to the database
const generateRefreshToken = async (userId) => {
  logger.info(`Gnerating refresh token for ${userId}`);

  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION_DAYS, // Ensure expiration time is in days
  });

  const jwtExpirationValue = parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS);
  const jwtExpirationUnit = process.env.JWT_REFRESH_EXPIRATION_DAYS.slice(-1);
  let expirationInMs;

  // Convert expiration to milliseconds
  switch (jwtExpirationUnit) {
    case "d":
      expirationInMs = jwtExpirationValue * 24 * 60 * 60 * 1000;
      break;
    case "h":
      expirationInMs = jwtExpirationValue * 60 * 60 * 1000;
      break;
    case "m":
      expirationInMs = jwtExpirationValue * 60 * 1000;
      break;
    default:
      throw new Error(
        "Invalid expiration format in JWT_REFRESH_EXPIRATION_DAYS"
      );
  }

  // Set expiration date
  const expirationDate = new Date(Date.now() + expirationInMs);

  // Create and save the refresh token
  const newRefreshToken = new Token({
    user: userId, // Use userId instead of payload.id
    token: refreshToken,
    expires: expirationDate,
    blacklisted: false,
  });

  await newRefreshToken.save();
  return refreshToken;
};

// Create both access and refresh tokens
const createAccessTokenAndRefreshToken = async (userId) => {
  logger.info(`started generating access and refresh token for ${userId}`);
  const accessToken = generateAccessToken(userId);
  logger.info(` access token generated for ${userId}`);
  const refreshToken = await generateRefreshToken(userId);
  logger.info(` refresh token generated for ${userId}`);
  logger.info(`Gnerating access and refresh token for ${userId}`);
  return { accessToken, refreshToken };
};

module.exports = {
  createAccessTokenAndRefreshToken,
  generateAccessToken,
};
