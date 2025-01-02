const createError = require("http-errors");
const { Project, User } = require("../models");
const redis = require("../config/redis");
const thumbnailGeneration = require("../utils/thumbnailGeneration");
const addProject = async (reqInfo) => {
  //const { userId } = reqInfo.cookies;
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const { url, enableComments, title } = reqInfo.body;
  let thumbnail;
  try {
    thumbnail = await thumbnailGeneration(url);
  } catch (error) {
    console.error("Thumbnail generation failed:", error.message);
    throw createError(400, error.message);
  }
  let project;
  try {
    project = new Project({
      owner: userId,
      url,
      enableComments,
      image: [thumbnail],
      title,
    });
    await project.save();
  } catch (error) {
    console.error("Failed to save project:", error.message);
    throw createError(400, "Failed to save project");
  }

  await User.findByIdAndUpdate(
    userId,
    {
      $push: { projects: project._id },
    },
    { new: true }
  );
  return project;
};

const getProjects = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const limit = Number(reqInfo.query.limit) || 12;
  const page = Number(reqInfo.query.page) || 1;
  let skip = (page - 1) * limit;

  const projects = await Project.find({})
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(Number(limit) || 50)
    .lean();
  const totalProjects = await Project.countDocuments();
  const totalPages = Math.ceil(totalProjects / limit);
  await Promise.all(
    projects.map(async (project) => {
      const projectsView = await redis.get(`project:${project._id}:views`);
      const projectLikes = await redis.get(`project:${project._id}:likeCount`);
      const alreadyLiked = await redis.sismember(
        `project:${project._id}:likes`,
        userId
      );
      project.projectViews = projectsView;
      project.projectLikeCount = projectLikes;
      project.alreadyLiked = alreadyLiked;
    })
  );
  const projectsData = { projects, totalPages, totalProjects, page, limit };

  return projectsData;
};

const getProjectsOfUser = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }

  const cacheKey = `userprojects:${userId}`;

  const projects = await Project.find({ owner: userId }).sort({
    createdAt: -1,
  });

  const projectsData = projects;
  await redis.set(cacheKey, JSON.stringify(projectsData), "EX", 10);

  return projectsData;
};

const deleteProject = async (reqInfo) => {
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const { deleteProjectId } = reqInfo.params;
  const project = await Project.findByIdAndDelete(deleteProjectId);
  if (!project) {
    throw createError(404, "Project not found");
  }
  return { message: "Project deleted successfully" };
};

const incrementViewCount = async (reqInfo) => {
  //const { userId } = reqInfo.cookies;
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }
  const { id } = reqInfo.params;
  await redis.incr(`project:${id}:views`);
  const project = await Project.findById(id);
  return project;
};

const likeProject = async (reqInfo) => {
  //const { userId } = reqInfo.cookies;
  const userId = reqInfo.cookies.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found. Please signup");
  }

  const { projectId } = reqInfo.body;
  const alreadyLiked = await redis.sismember(
    `project:${projectId}:likes`,
    userId
  );

  if (alreadyLiked) {
    await redis.srem(`project:${projectId}:likes`, userId);
    await redis.decr(`project:${projectId}:likeCount`);
    return { liked: false, message: "Project unliked successfully" };
  } else {
    await redis.sadd(`project:${projectId}:likes`, userId);
    await redis.incr(`project:${projectId}:likeCount`);
    return { liked: true, message: "Project liked successfully" };
  }
};

const trendingProjects = async () => {
  const projects = await Project.find({}).sort({ trendingScore: -1 }).limit(10);

  return projects;
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
