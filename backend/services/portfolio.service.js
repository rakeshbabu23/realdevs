const createError = require("http-errors");
const { Portfolio, User } = require("../models");
const redis = require("../config/redis");
const thumbnailGeneration = require("../utils/thumbnailGeneration");
const addPortfolio = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const { url, enableComments } = reqInfo.body;
  let thumbnail;
  try {
    thumbnail = await thumbnailGeneration(url);
  } catch (error) {
    console.error("Thumbnail generation failed:", error.message);
    throw createError(400, error.message);
  }
  const portfolio = new Portfolio({
    owner: userId,
    url,
    enableComments,
    image: [thumbnail],
  });
  const newPortfolio = await portfolio.save();
  if (!newPortfolio) {
    throw createError(400, "Failed to create portfolio");
  }

  await User.findByIdAndUpdate(
    userId,
    {
      portfolio: newPortfolio._id,
      $inc: { portfolioUpdateCount: 1 },
    },
    { new: true }
  );
  return portfolio;
};

const updatePortfolio = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const { url, portfolioId, enableComments } = reqInfo.body;
  const thumbnail = await thumbnailGeneration(url);
  const portfolio = await Portfolio.findById(portfolioId);
  if (!portfolio) {
    throw createError(404, "Portfolio not found");
  } else {
    portfolio.url = url;
    portfolio.enableComments = enableComments;
    portfolio.image = [thumbnail];
    await portfolio.save();
  }

  return portfolio;
};

const getPortfolios = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const limit = Number(reqInfo.query.limit) || 12; // Default to 12 if limit is not provided
  const page = Number(reqInfo.query.page) || 1; // Default to 1 if page is not provided
  let skip = (page - 1) * limit;

  const portfolios = await Portfolio.find({})
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(Number(limit) || 12)
    .lean();
  const totalPortfolios = await Portfolio.countDocuments();
  const totalPages = Math.ceil(totalPortfolios / limit);
  await Promise.all(
    portfolios.map(async (portfolio) => {
      const portfoliosView = await redis.get(
        `portfolio:${portfolio._id}:views`
      );
      const portfolioLikes = await redis.get(
        `portfolio:${portfolio._id}:likeCount`
      );
      const alreadyLiked = await redis.sismember(
        `portfolio:${portfolio._id}:likes`,
        userId
      );
      portfolio.portfolioViews = portfoliosView;
      portfolio.portfolioLikeCount = portfolioLikes;
      portfolio.alreadyLiked = alreadyLiked;
    })
  );

  const portfoliosData = {
    portfolios,
    totalPortfolios,
    totalPages,
    page,
    limit,
  };

  return portfoliosData;
};

const getPortfolioOfUser = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }

  const cacheKey = `userportfolio:${userId}`;
  const cachedPortfolioData = await redis.get(cacheKey);
  // if (cachedProjectsData) {
  //   console.log("Returning cached projects");
  //   return JSON.parse(cachedProjectsData);
  // }
  const portfolio = await Portfolio.findOne({ owner: userId }).sort({
    createdAt: -1,
  });

  const portfolioData = portfolio;
  await redis.set(cacheKey, JSON.stringify(portfolioData), "EX", 10);

  return portfolioData;
};

const incrementViewCount = async (reqInfo) => {
  // const { userId } = reqInfo.cookies;
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const { id } = reqInfo.params;
  await redis.incr(`portfolio:${id}:views`);
  const portfolio = await Portfolio.findById(id);
  return portfolio;
};

const likePortfolio = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }

  const { portfolioId } = reqInfo.body;
  const alreadyLiked = await redis.sismember(
    `portfolio:${portfolioId}:likes`,
    userId
  );

  if (alreadyLiked) {
    await redis.srem(`portfolio:${portfolioId}:likes`, userId);
    await redis.decr(`portfolio:${portfolioId}:likeCount`);
    return { liked: false, message: "Portfolio unliked successfully" };
  } else {
    await redis.sadd(`portfolio:${portfolioId}:likes`, userId);
    await redis.incr(`portfolio:${portfolioId}:likeCount`);
    return { liked: true, message: "Portfolio liked successfully" };
  }
};
const trendingPortfolios = async () => {
  const portfolios = await Portfolio.find({})
    .sort({ trendingScore: -1 })
    .limit(10);
  return portfolios;
};

module.exports = {
  addPortfolio,
  getPortfolios,
  incrementViewCount,
  likePortfolio,
  trendingPortfolios,
  getPortfolioOfUser,
  updatePortfolio,
};
