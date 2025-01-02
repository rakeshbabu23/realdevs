const cron = require("node-cron");
const redis = require("../config/redis");
const { Portfolio, Project, User, Like } = require("../models");

async function safeGetMembers(redis, key) {
  const keyType = await redis.type(key);
  if (keyType !== "set") {
    console.warn(`Key ${key} is not a set. Type: ${keyType}`);
    return [];
  }
  return redis.smembers(key);
}

async function processLikes(keys, Model, likeType) {
  for (const key of keys) {
    const id = key.split(":")[1];
    const userIds = await safeGetMembers(redis, key);

    // Update likeCount for the model
    const likeCount = userIds.length;
    await Model.findByIdAndUpdate(id, { likeCount });

    // Process individual likes
    for (const userId of userIds) {
      const user = await User.findById(userId);
      if (!user) {
        console.warn(`User not found for ID: ${userId}`);
        continue;
      }

      await Like.findOneAndUpdate(
        { user: userId, [likeType]: id },
        { user: userId, [likeType]: id },
        { upsert: true }
      );
    }

    await redis.del(key);
  }
}

cron.schedule("*/5 * * * *", async () => {
  console.log("Running likes processing cron job");
  try {
    // Process portfolio likes
    const portfolioKeys = await redis.keys("portfolio:*:likes");
    await processLikes(portfolioKeys, Portfolio, "portfolio");

    // Process project likes
    const projectKeys = await redis.keys("project:*:likes");
    await processLikes(projectKeys, Project, "project");

    console.log("Likes processing completed successfully");
  } catch (error) {
    console.error("Error processing likes:", error);
  }
});
