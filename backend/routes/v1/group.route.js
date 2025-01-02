const express = require("express");
const router = express.Router();
const { groupController } = require("../../controllers");
const validate = require("../../middleware/validate");
const { groupValidation } = require("../../validation");
const { verifyToken } = require("../../middleware/authMiddleware");
router.post(
  "/",
  validate(groupValidation.createGroup),
  groupController.createGroup
);
router.get(
  "/",
  validate(groupValidation.userGroups),
  groupController.userGroups
);
router.patch(
  "/",
  validate(groupValidation.updateGroup),
  verifyToken,
  groupController.updateGroup
);
router.get(
  "/admin/:groupId",
  validate(groupValidation.getSubmittedPortfolios),
  verifyToken,
  groupController.getSubmittedPortfolios
);
router.get(
  "/user",
  validate(groupValidation.getSubmittedPortfoliosOfUser),
  verifyToken,
  groupController.getSubmittedPortfoliosOfUser
);
router.post(
  "/submit",
  validate(groupValidation.submitPortfolio),
  verifyToken,
  groupController.submitPortfolio
);

module.exports = router;
