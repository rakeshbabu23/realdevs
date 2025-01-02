const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const portfolioRoute = require("./portfolio.route");
const projectRoite = require("./project.route");
const groupRoute = require("./group.route");
const defaultRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/portfolio",
    route: portfolioRoute,
  },
  {
    path: "/project",
    route: projectRoite,
  },
  {
    path: "/group",
    route: groupRoute,
  },
];

defaultRoutes.forEach((routes) => {
  router.use(routes.path, routes.route);
});

module.exports = router;
