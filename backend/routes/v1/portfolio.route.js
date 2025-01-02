const express = require("express");
const router = express.Router();
const { portfolioController } = require("../../controllers");
const validate = require("../../middleware/validate");
const { portfolioValidation } = require("../../validation");
const { verifyToken } = require("../../middleware/authMiddleware");
router.post(
  "/",
  validate(portfolioValidation.addPortfolio),
  portfolioController.addPortfolio
);
router.get(
  "/user",
  validate(portfolioValidation.getPortfolioOfUser),
  verifyToken,
  portfolioController.getPortfolioOfUser
);
router.get(
  "/",
  validate(portfolioValidation.getPortfolios),
  verifyToken,
  portfolioController.getPortfolios
);
router.patch(
  "/",
  validate(portfolioValidation.updatePortfolio),
  verifyToken,
  portfolioController.updatePortfolio
);
router.post(
  "/like",
  validate(portfolioValidation.likePortfolio),
  portfolioController.likePortfolio
);
router.post(
  "/view/:id",
  validate(portfolioValidation.viewPortfolio),
  portfolioController.incrementViewCount
);
router.get(
  "/trending",
  validate(portfolioValidation.trendingPortfolios),
  verifyToken,
  portfolioController.trendingPortfolios
);
// router.post(
//   "/login",
//   validate(portfolioValidation.login),
//   portfolioController.customLogin
// );

// router.post("/login", authController.customLogin);

// router.get("/google", authController.googleAuth);
// router.get("/google/callback", authController.googleAuthCallback);
// router.get("/profile", authController.profile);
module.exports = router;
