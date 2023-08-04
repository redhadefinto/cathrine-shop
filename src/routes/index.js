const { Router } = require("express");
const masterRouter = Router();

const welcomeRouter = require("./welcome.route");
const authRouter = require("./auth.route");
const productsRouter = require("./products.route");
const transactionRouter = require("./transactions.route");
const profileRouter = require("./profile.route");

masterRouter.use("/", welcomeRouter);
masterRouter.use("/auth", authRouter);
masterRouter.use("/products", productsRouter);
masterRouter.use("/transactions", transactionRouter);
masterRouter.use("/profile", profileRouter);

module.exports = masterRouter;
