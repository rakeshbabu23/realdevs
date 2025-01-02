const { portfolioService } = require("../services");

const addPortfolio = async (req, res) => {
  try {
    const portfolio = await portfolioService.addPortfolio(req.values);
    return res
      .status(201)
      .json({ message: "Portfolio created successfully", portfolio });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await portfolioService.updatePortfolio(req.values);
    return res
      .status(200)
      .json({ message: "Portfolio updated successfully", portfolio });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getPortfolioOfUser = async (req, res) => {
  try {
    const portfolio = await portfolioService.getPortfolioOfUser(req.values);
    return res.status(200).json({
      message: "Portfolio retrieved successfully",
      portfolio,
    });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getPortfolios = async (req, res) => {
  try {
    const { portfolios, totalPortfolios, totalPages, page, limit } =
      await portfolioService.getPortfolios(req.values);
    return res.status(200).json({
      message: "Portfolios retrieved successfully",
      portfolios,
      totalPortfolios,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const incrementViewCount = async (req, res) => {
  try {
    const portfolio = await portfolioService.incrementViewCount(req.values);
    return res.status(200).json({
      message: "Portfolio view count incremented successfully",
      portfolio,
    });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const likePortfolio = async (req, res) => {
  try {
    await portfolioService.likePortfolio(req.values);
    return res.status(200).json({ message: "Portfolio liked successfully" });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const trendingPortfolios = async (req, res) => {
  try {
    const portfolios = await portfolioService.trendingPortfolios();
    return res.status(200).json({
      message: "Trending portfolios retrieved successfully",
      portfolios,
    });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
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
