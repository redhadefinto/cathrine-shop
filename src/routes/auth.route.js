const { Router } = require("express");

const authContoller = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");
const authRouter = Router();

// login
authRouter.post("/login", authMiddleware.checkVerify, authContoller.login);
authRouter.post("/regist", authContoller.regist);
authRouter.patch("/verify/:email", authContoller.verify);
authRouter.patch("/logout", authMiddleware.checkToken, authContoller.logOut);
authRouter.patch("/otp", authContoller.createOtp);
authRouter.patch("/forgot", authContoller.forgot);
authRouter.patch("/reset-password/:otp", authContoller.resetPassword);
authRouter.patch(
  "/change-password",
  authMiddleware.checkToken,
  authContoller.changePassword
);

module.exports = authRouter;
