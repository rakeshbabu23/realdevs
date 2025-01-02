const Joi = require("joi");
const { authenticatedUser } = require("../utils/helper");
const createGroup = {
  ...authenticatedUser,
  body: Joi.object({
    groupName: Joi.string().required(),
  }),
};
const updateGroup = {
  ...authenticatedUser,
  body: Joi.object({
    groupId: Joi.string().required(),
    active: Joi.boolean().required(),
  }),
};

const getSubmittedPortfolios = {
  ...authenticatedUser,
  params: Joi.object({
    groupId: Joi.string().required(),
  }),
};

const submitPortfolio = {
  ...authenticatedUser,
  body: Joi.object({
    url: Joi.string().required(),
    groupName: Joi.string().required(),
  }),
};

const userGroups = {
  ...authenticatedUser,
};
const getSubmittedPortfoliosOfUser = {
  ...authenticatedUser,
};

module.exports = {
  createGroup,
  updateGroup,
  submitPortfolio,
  getSubmittedPortfolios,
  userGroups,
  getSubmittedPortfoliosOfUser,
};
