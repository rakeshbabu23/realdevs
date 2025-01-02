const jwt = require("jsonwebtoken");
const cookies = require("cookie");
const createError = require("http-errors");
const { Token, User } = require("../models");
const { generateAccessToken } = require("../services/token.service");

const verifyToken = async (req, res, next) => {
  const parsedCookies = cookies.parse(req.headers.cookie);
  let accessToken = parsedCookies.access;
  let refreshToken = parsedCookies.refresh;
  // let accessToken = req.cookies.access;
  // let refreshToken = req.cookies.refresh;
  // let userId = req.cookies.userId;

  try {
    // Check if tokens exist
    if (!accessToken || !refreshToken) {
      throw createError(401, "Access token or refresh token is missing");
    }

    // Verify access token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError(401, "Unauthorized");
    }

    // Set headers
    res.set("accessToken", accessToken);
    res.set("refreshToken", refreshToken);
    res.set("userId", user._id.toString());
    next();
  } catch (error) {
    // If token has expired
    if (error.name === "TokenExpiredError") {
      try {
        const refreshTokenData = jwt.verify(
          refreshToken,
          process.env.JWT_SECRET
        );
        const refreshTokenUser = await Token.findOne({ token: refreshToken });

        if (!refreshTokenUser) {
          throw createError(401, "Refresh token is invalid");
        }

        // Validate that the refresh token belongs to the user
        if (refreshTokenData.id !== refreshTokenUser.user.toString()) {
          throw createError(401, "Refresh token is not valid for this user");
        }

        // Generate a new access token
        const newAccessToken = generateAccessToken({
          id: refreshTokenUser.user,
        });

        // // Set new tokens in headers
        // res.set("accessToken", newAccessToken);
        // res.set("refreshToken", refreshToken);
        // res.set("userId", refreshTokenUser.user.toString());
        next();
      } catch (refreshTokenError) {
        return next(createError(401, "Refresh token is invalid"));
      }
    } else {
      // Other token errors
      return next(createError(401, "Access token is invalid"));
    }
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Get the token from cookies

  if (!token) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401); // Invalid token

    req.user = user; // Attach user to request object
    next(); // Continue to the next middleware or route handler
  });
};

module.exports = { verifyToken, authenticateToken };
