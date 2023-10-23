const jwt = require("jsonwebtoken");
require("dotenv").config();
const keyAccessToken = process.env.JWT_ACCESS_KEY;

const middlewareControllers = {
  // Verify token
  verifyToken: (req, res, next) => {
    const token = req.headers["authorization"];

    const accessToken = token?.split(" ")[1];

    if (req?.query?.emailAuthor) {
      next();
      return;
    }

    if (accessToken) {
      // Create token
      jwt.verify(accessToken, keyAccessToken, (err, user) => {
        if (err) {
          res.status(401).json("Token is expired");
          return;
        }
        req.user = user;
        next();
      });
    } else {
      res.status(403).json("Null token");
      return;
    }
  },

  // Check is admin account
  verifyTokenAndAuthorization: (req, res, next) => {
    middlewareControllers.verifyToken(req, res, () => {
      // console.log("user>>> ", user);
      console.log("req.id>>> ", req.user.id);
      console.log("req.id2>>> ", req.params.id);

      if (req.user.id == req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not allowed to do that!");
      }
    });
  },

  // Check token admin
  verifyTokenAndAdmin: (req, res, next) => {
    middlewareControllers.verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not allowed to do that!");
      }
    });
  },
};

module.exports = middlewareControllers;
