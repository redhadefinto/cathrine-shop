const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authRouter = Router();

authRouter.post("/regist", authController.regist);
authRouter.patch("/verify/:email", authController.verify);

module.exports = authRouter;
