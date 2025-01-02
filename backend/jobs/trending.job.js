const cron = require("node-cron");
const { Portfolio, Project } = require("../models");

function calculateTrendingScore(type) {
  const viewScore = 1;
  const likeScore = 2;
  const typeViews = type.views ? type.views : 0;
  const typeLikes = type.likeCount ? type.likeCount : 0;
  const trendingScore = viewScore * typeViews + likeScore * typeLikes;
  return trendingScore;
}

cron.schedule("0 */5 * * *", async () => {
  console.log("Calculating trending scores");

  const projects = await Project.find();
  const portfolios = await Portfolio.find();

  projects.forEach(async (project) => {
    const trendingScore = calculateTrendingScore(project);
    await Project.findByIdAndUpdate(
      project._id,
      { trendingScore },
      { new: true }
    );
  });

  portfolios.forEach(async (portfolio) => {
    const trendingScore = calculateTrendingScore(portfolio);
    await Portfolio.findByIdAndUpdate(
      portfolio._id,
      { trendingScore },
      { new: true }
    );
  });
});
