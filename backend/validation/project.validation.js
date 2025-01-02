const Joi = require("joi");
const { authenticatedUser } = require("../utils/helper");
const addProject = {
  body: Joi.object({
    url: Joi.string().required(),
    enableComments: Joi.boolean().optional().default(true),
    title: Joi.string().required(),
  }),
  ...authenticatedUser,
};

const getProjects = {
  ...authenticatedUser,
  query: Joi.object({
    limit: Joi.number().min(1).max(100).default(50),
    page: Joi.number().min(1),
  }),
};
const getProjectsOfUser = {
  ...authenticatedUser,
};
const deleteProject = {
  ...authenticatedUser,
  params: Joi.object({
    deleteProjectId: Joi.string().required(),
  }),
};

const likeProject = {
  ...authenticatedUser,
  body: Joi.object({
    projectId: Joi.string().required(),
  }),
};
const viewProject = {
  ...authenticatedUser,
  params: Joi.object({
    id: Joi.string().required(),
  }),
};
const trendingProjects = {
  ...authenticatedUser,
};

module.exports = {
  addProject,
  getProjects,
  viewProject,
  likeProject,
  trendingProjects,
  getProjectsOfUser,
  deleteProject,
};
