const { Router } = require("express");
const masterRouter = Router();

const welcomeRouter = require("./welcome.route");
const authRouter = require("./auth.route");

masterRouter.use("/", welcomeRouter);
masterRouter.use("/auth", authRouter);

module.exports = masterRouter;
