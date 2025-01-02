const mongoose = require("mongoose");
const logger = require("../utils/logger");
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("Connected to mongodb "))
  .catch((error) => console.log(error));
