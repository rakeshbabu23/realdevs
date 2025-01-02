const { statusService } = require("../services");

const createStatus = async (req, res) => {
  try {
    const status = await statusService.createStatus(req.values);
    return res
      .status(201)
      .json({ message: "Status created successfully", status });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    if (error.message) {
      return res.json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getStatuses = async (req, res) => {
  try {
    const statuses = await statusService.getAllStatuses(req.values);
    return res
      .status(200)
      .json({ message: "Statuses retrieved successfully", statuses });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    if (error.message) {
      return res.json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
const incrementCountOfStatus = async (req, res) => {
  try {
    const updatedStatus = await statusService.incrementCountOfStatus(
      req.values
    );
    return res
      .status(200)
      .json({
        message: "Status count incremented successfully",
        updatedStatus,
      });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    if (error.message) {
      return res.json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = { createStatus, getStatuses, incrementCountOfStatus };
