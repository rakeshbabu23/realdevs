const express = require("express");
const router = express.Router();
const { authController } = require("../../controllers");
const validate = require("../../middleware/validate");
const { userValidation } = require("../../validation");
router.post(
  "/signup",
  validate(userValidation.signup),
  authController.customSignUp
);
router.post(
  "/login",
  validate(userValidation.login),
  authController.customLogin
);

// router.post("/login", authController.customLogin);

router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleAuthCallback);
// router.get("/profile", authController.profile);
module.exports = router;
