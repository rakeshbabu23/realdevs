require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const redis = require("./config/redis");
const addLikes = require("./jobs/addlikes.job");
const trending = require("./jobs/trending.job");
const views = require("./jobs/viewscount.job");

const logger = require("./utils/logger");
const rateLimiter = require("./config/rateLimiter");
const databse = require("./config/database");
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

app.use(compression());

app.use(rateLimiter);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "userId"],
    credentials: true,
  })
);

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
const routes = require("./routes/v1");
app.use("/v1", routes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
