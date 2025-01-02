const { projectService } = require("../services");

const addProject = async (req, res) => {
  try {
    const project = await projectService.addProject(req.values);
    return res
      .status(201)
      .json({ message: "Project added successfully", project });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getProjects = async (req, res) => {
  try {
    const { projects, totalProjects, totalPages, page, limit } =
      await projectService.getProjects(req.values);
    return res.status(200).json({
      message: "projects retrieved successfully",
      projects,
      totalProjects,
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

const getProjectsOfUser = async (req, res) => {
  try {
    const projects = await projectService.getProjectsOfUser(req.values);
    return res.status(200).json({
      message: "projects retrieved successfully",
      projects,
    });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const deleteProject = async (req, res) => {
  try {
    await projectService.deleteProject(req.values);
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const incrementViewCount = async (req, res) => {
  try {
    const project = await projectService.incrementViewCount(req.values);
    return res.status(200).json({
      message: "Project view count incremented successfully",
      project,
    });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const likeProject = async (req, res) => {
  try {
    await projectService.likeProject(req.values);
    return res.status(200).json({ message: "Project liked successfully" });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const trendingProjects = async (req, res) => {
  try {
    const projects = await projectService.trendingProjects();
    return res.status(200).json({
      message: "Trending projects retrieved successfully",
      projects,
    });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = {
  addProject,
  getProjects,
  incrementViewCount,
  likeProject,
  trendingProjects,
  getProjectsOfUser,
  deleteProject,
};
