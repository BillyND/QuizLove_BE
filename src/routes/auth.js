const authRouter = require("express").Router();
const authController = require("../controllers/authControllers");
const middlewareControllers = require("../controllers/middlewareControllers");

//REGISTER
authRouter.post("/register", authController.registerUser);

//LOGIN
authRouter.post("/login", authController.loginUser);

//REFRESH TOKEN
authRouter.post("/refresh", authController.requestRefreshToken);

//LOG OUT
authRouter.post(
  "/logout",
  middlewareControllers.verifyToken,
  authController.logoutUser
);

//LOGIN
authRouter.get(
  "/account",
  middlewareControllers.verifyToken,
  authController.fetchAccount
);

module.exports = authRouter;
