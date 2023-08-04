const { Router } = require("express");
const profileRouter = Router();
const profileController = require("../controllers/profile.controller");
const { checkToken } = require("../middleware/auth");

profileRouter.get("/", checkToken, profileController.getProfile);

module.exports = profileRouter;
