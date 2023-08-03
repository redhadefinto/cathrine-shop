const { Router } = require("express");
const masterRouter = Router();

const welcomeRouter = require("./welcome.route");
const authRouter = require("./auth.route");
const productsRouter = require("./products.route");

masterRouter.use("/", welcomeRouter);
masterRouter.use("/auth", authRouter);
masterRouter.use("/products", productsRouter);

module.exports = masterRouter;
