const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keyAccessToken = process.env.JWT_ACCESS_KEY;
const keyRefreshToken = process.env.JWT_REFRESH_KEY;
const accessTokenExpire = process.env.JWT_ACCESS_EXPIRE_IN;
const refreshTokenExpire = process.env.JWT_REFRESH_EXPIRE_IN;
require("dotenv").config();

let refreshTokens = [];
const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      //bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //Create new user
      const newUser = await new User({
        email: req.body.email,
        password: hashed,
        phone: req.body.phone,
      });

      //Save to DB
      const user = await newUser.save();
      res.status(200).json({
        EC: 0,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        EC: -2,
        data: error,
      });
    }
  },

  //GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, keyAccessToken, {
      expiresIn: accessTokenExpire,
    });
  },

  //GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, keyRefreshToken, {
      expiresIn: refreshTokenExpire,
    });
  },

  // LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      //Check email
      if (!user) {
        return res.status(404).json({
          EC: -1,
          data: "Invalid info Login",
        });
      }

      //Check password
      const validatePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validatePassword) {
        return res.status(404).json({
          EC: -1,
          data: "Invalid info Login",
        });
      }

      if (user && validatePassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);

        refreshTokens.push(refreshToken);

        //Remove password when login
        const { password, ...others } = user._doc;

        const userWP = { ...others };
        res.status(200).json({
          EC: 0,
          data: { userWP, accessToken, refreshToken },
        });
      }
    } catch (error) {
      res.status(500).json({
        EC: -2,
        data: error,
      });
    }
  },

  //TEST REFRESH TOKEN
  requestRefreshToken: async (req, res) => {
    if (req.body.refreshLocal === null) {
      return res.status(200).json({ EC: 1, data: "Null refresh token" });
    }
    const refreshToken = req.body.refreshLocal;
    jwt.verify(refreshToken, keyRefreshToken, (err, user) => {
      if (err) {
        return res
          .status(400)
          .json({ EC: -2, data: "Refresh token is expired" });
      }
      refreshTokens = refreshTokens.filter((token) => token != refreshToken);

      //create new access and refresh Token
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);

      refreshTokens.push(newRefreshToken);

      res.status(201).json({
        EC: 0,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    });
  },

  //LOGOUT
  logoutUser: async (req, res) => {
    return res.status(200).json({
      EC: 0,
      data: { EC: 0, data: "Logout successfully" },
    });
  },

  //FETCH ACCOUNT
  fetchAccount: async (req, res) => {
    try {
      const userFullInfor = await User.findById(req.user.id);
      const { password, ...others } = userFullInfor._doc;
      const user = { ...others };
      res.status(200).json({
        EC: 0,
        data: { user },
      });
    } catch (error) {
      res.status(500).json({
        EC: -2,
        data: error,
      });
    }
  },
};

module.exports = authController;