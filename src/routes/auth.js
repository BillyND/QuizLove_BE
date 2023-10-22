const authRouter = require("express").Router();
const authController = require("../controllers/authControllers");
const middlewareControllers = require("../controllers/middlewareControllers");

// Register
authRouter.post("/check", middlewareControllers.verifyToken);

// Register
authRouter.post("/register", authController.registerUser);

// Login
authRouter.post("/login", authController.loginUser);

// Refresh token
authRouter.post("/refresh", authController.requestRefreshToken);

// Logout
authRouter.post(
  "/logout",
  middlewareControllers.verifyToken,
  authController.logoutUser
);

// Login
authRouter.get(
  "/account",
  middlewareControllers.verifyToken,
  authController.fetchAccount
);

module.exports = authRouter;
