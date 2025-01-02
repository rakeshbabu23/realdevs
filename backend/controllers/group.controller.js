const { groupService } = require("../services");

const createGroup = async (req, res) => {
  try {
    const group = await groupService.createGroup(req.values);
    return res
      .status(201)
      .json({ message: "Group created successfully", group });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
  }
};

const userGroups = async (req, res) => {
  try {
    const groups = await groupService.userGroups(req.values);
    return res
      .status(200)
      .json({ message: "Retrieved user groups successfully", groups });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
  }
};
const updateGroup = async (req, res) => {
  try {
    const group = await groupService.updateGroup(req.values);
    return res
      .status(200)
      .json({ message: "Group updated successfully", group });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
  }
};
const getSubmittedPortfolios = async (req, res) => {
  try {
    const portfolios = await groupService.getSubmittedPortfolios(req.values);
    return res.status(200).json({
      message: "Retrieved submitted portfolios successfully",
      portfolios,
    });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
  }
};
const getSubmittedPortfoliosOfUser = async (req, res) => {
  try {
    const portfolios = await groupService.getSubmittedPortfoliosOfUser(
      req.values
    );
    return res.status(200).json({
      message: "Retrieved submitted portfolios successfully",
      portfolios,
    });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
  }
};

const submitPortfolio = async (req, res) => {
  try {
    const portfolio = await groupService.submitPortfolio(req.values);
    return res
      .status(201)
      .json({ message: "Portfolio submitted successfully", portfolio });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
  }
};

module.exports = {
  createGroup,
  getSubmittedPortfolios,
  submitPortfolio,
  updateGroup,
  userGroups,
  getSubmittedPortfoliosOfUser,
};
