const Joi = require("joi");
const { authenticatedUser } = require("../utils/helper");
const addPortfolio = {
  ...authenticatedUser,
  body: Joi.object({
    url: Joi.string().required(),
    enableComments: Joi.boolean().optional().default(true),
  }),
};
const updatePortfolio = {
  ...authenticatedUser,
  body: Joi.object({
    url: Joi.string().required(),
    enableComments: Joi.boolean().optional().default(true),
    portfolioId: Joi.string().required(),
  }),
};

const getPortfolioOfUser = {
  ...authenticatedUser,
};

const getPortfolios = {
  ...authenticatedUser,
  query: Joi.object({
    limit: Joi.number().min(1).max(100).default(50),
    page: Joi.number().min(1),
  }),
  // headers: Joi.object({
  //   accesstoken: Joi.string().required(),
  //   refreshtoken: Joi.string().required(),
  //   userid: Joi.string().required(),
  // }).unknown(true),
};

const likePortfolio = {
  ...authenticatedUser,
  body: Joi.object({
    portfolioId: Joi.string().required(),
  }),
  // headers: Joi.object({
  //   accessToken: Joi.string().required(),
  //   refreshToken: Joi.string().required(),
  //   userId: Joi.string().required(),
  // }).unknown(true),
};
const viewPortfolio = {
  ...authenticatedUser,
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

const trendingPortfolios = {
  ...authenticatedUser,
  // headers: Joi.object({
  //   accesstoken: Joi.string().required(),
  //   refreshtoken: Joi.string().required(),
  //   userid: Joi.string().required(),
  // }).unknown(true),
};

module.exports = {
  addPortfolio,
  getPortfolios,
  likePortfolio,
  viewPortfolio,
  trendingPortfolios,
  getPortfolioOfUser,
  updatePortfolio,
};
