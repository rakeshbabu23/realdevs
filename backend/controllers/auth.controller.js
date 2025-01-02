const { authService, tokenService } = require("../services");
const { cookiesExpiryDate } = require("../utils/helper");
const passport = require("passport");
const createError = require("http-errors");
const logger = require("../utils/logger");

const customSignUp = async (req, res) => {
  try {
    logger.info("Received both email and password");
    const user = await authService.customSignUp(req.values);
    logger.info("Created new user");
    const { accessToken, refreshToken } =
      await tokenService.createAccessTokenAndRefreshToken(user._id);
    // user.accessToken = accessToken;
    // user.refreshToken = refreshToken;
    logger.info("Generated tokens for new user");
    res.cookie("userId", user._id, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: cookiesExpiryDate,
      path: "/",
    });
    res.cookie("access", accessToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: cookiesExpiryDate,
      path: "/",
    });
    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: cookiesExpiryDate,
      path: "/",
    });
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Google OAuth callback route
const googleAuthCallback = async (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/" },
    async (err, user) => {
      if (err) {
        console.error("Authentication error:", err);
        return next(err); // or handle the error as needed
      }
      if (!user) {
        return next(createError(401, "Authentication failed"));
      }
      try {
        const email = user.emails[0].value;
        const displayName = user.displayName;
        const userInfo = await authService.googleSignUp(email, displayName);
        const { accessToken, refreshToken } =
          await tokenService.createAccessTokenAndRefreshToken(userInfo._id);
        res.cookie("userId", userInfo._id, {
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: cookiesExpiryDate,
          httpOnly: true,
        });
        res.cookie("access", accessToken, {
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: cookiesExpiryDate,
          httpOnly: true,
        });
        res.cookie("refresh", refreshToken, {
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: cookiesExpiryDate,
          httpOnly: true,
        });
        res.json({ message: "User created successfully" });
        //res.redirect("http://localhost:3000/profile");
      } catch (error) {
        if (error.status && error.message) {
          return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  )(req, res, next);
};

const customLogin = async (req, res) => {
  try {
    logger.info("custom login controller");
    const user = await authService.customLogin(req.values);
    const { accessToken, refreshToken } =
      await tokenService.createAccessTokenAndRefreshToken(user._id);
    res.cookie("userId", user._id, {
      sameSite: "None",
      secure: true,
      maxAge: cookiesExpiryDate,
      httpOnly: true,
    });
    res.cookie("access", accessToken, {
      sameSite: "None",
      secure: true,
      maxAge: cookiesExpiryDate,
      httpOnly: true,
    });
    res.cookie("refresh", refreshToken, {
      sameSite: "None",
      secure: true,
      maxAge: cookiesExpiryDate,
      httpOnly: true,
    });
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(201).json({ message: "User logged in successfully" });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const googleAuth = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

const logout = async (req, res, next) => {
  try {
    const { userId } = req.cookies;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorised" });
    }
    await authService.logout(userId);
    res.clearCookie("access");
    res.clearCookie("refresh");
    res.clearCookie("userId");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  customSignUp,
  customLogin,
  googleAuth,
  googleAuthCallback,
  logout,
};
