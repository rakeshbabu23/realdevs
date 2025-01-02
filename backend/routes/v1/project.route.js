const express = require("express");
const router = express.Router();
const { projectController } = require("../../controllers");
const validate = require("../../middleware/validate");
const { projectValidation } = require("../../validation");
const { verifyToken } = require("../../middleware/authMiddleware");
router.post(
  "/",
  validate(projectValidation.addProject),
  projectController.addProject
);
router.get(
  "/user",
  validate(projectValidation.getProjectsOfUser),
  verifyToken,
  projectController.getProjectsOfUser
);
router.get(
  "/",
  validate(projectValidation.getProjects),
  verifyToken,
  projectController.getProjects
);
router.delete(
  "/:deleteProjectId",
  validate(projectValidation.deleteProject),
  verifyToken,
  projectController.deleteProject
);

router.post(
  "/like",
  validate(projectValidation.likeProject),
  projectController.likeProject
);
router.post(
  "/view/:id",
  validate(projectValidation.viewProject),
  projectController.incrementViewCount
);

router.get(
  "/trending",
  validate(projectValidation.trendingProjects),
  verifyToken,
  projectController.trendingProjects
);

module.exports = router;
