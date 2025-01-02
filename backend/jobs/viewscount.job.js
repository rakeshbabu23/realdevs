const cron = require("node-cron");
const redis = require("../config/redis");
const { Portfolio, Project } = require("../models");

async function processViews(Model, keyPrefix) {
  const keys = await redis.keys(`${keyPrefix}:*:views`);
  for (const key of keys) {
    try {
      const id = key.split(":")[1];
      const views = await redis.getset(key, 0);

      if (views && parseInt(views) > 0) {
        const result = await Model.findByIdAndUpdate(
          id,
          { $inc: { views: parseInt(views) } },
          { new: true }
        );

        if (!result) {
          console.warn(`${Model.modelName} with id ${id} not found.`);
        }
      }
    } catch (error) {
      console.error(`Error processing views for key ${key}:`, error);
    }
  }
}

// Run every minute
cron.schedule("*/5 * * * *", async () => {
  console.log("Processing views...");

  try {
    await processViews(Portfolio, "portfolio");
    await processViews(Project, "project");
    console.log("Views processing completed.");
  } catch (error) {
    console.error("Error in views processing cron job:", error);
  }
});
