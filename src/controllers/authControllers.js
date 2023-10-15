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
  // Register
  registerUser: async (req, res) => {
    try {
      // bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req?.body?.password, salt);

      // Create new user
      const newUser = {
        email: req?.body?.email,
        password: hashed,
        username: req?.body?.username || "",
      };

      const isExistUser = await User.findOne({ email: req?.body?.email });

      // Check exist email
      if (isExistUser) {
        return res.status(404).json({
          EC: 1,
          message: "Tài khoản đã tồn tại!",
        });
      }

      // Save to DB
      const user = await User.create(newUser);

      return res.status(200).json({
        EC: 0,
        data: user,
        message: "Đăng ký thành công!",
      });
    } catch (error) {
      res.status(500).json({
        EC: -2,
        data: error,
        message: "Máy chủ lỗi!",
      });
    }
  },

  //Generate access token
  generateAccessToken: (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, keyAccessToken, {
      expiresIn: accessTokenExpire,
    });
  },

  // Generate refresh token
  generateRefreshToken: (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, keyRefreshToken, {
      expiresIn: refreshTokenExpire,
    });
  },

  // Login
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      // Check email
      if (!user) {
        return res.status(404).json({
          EC: -1,
          data: user,
          message: "Tài khoản không tồn tại!",
        });
      }

      // Check password
      const validatePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validatePassword) {
        return res.status(404).json({
          EC: -1,
          data: user,
          message: "Mật khẩu sai!",
        });
      }

      if (user && validatePassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);

        refreshTokens.push(refreshToken);

        //Remove password when login
        const { password, ...others } = user._doc;

        const infoUser = { ...others };
        res.status(200).json({
          EC: 0,
          data: { infoUser, accessToken, refreshToken },
        });
      }
    } catch (error) {
      res.status(500).json({
        EC: -2,
        message: "Máy chủ lỗi!",
        data: error,
      });
    }
  },

  // Test refresh token
  requestRefreshToken: async (req, res) => {
    if (req.body.refreshLocal === null) {
      return res.status(200).json({ EC: 1, data: "Refresh token is expired" });
    }
    const refreshToken = req.body.refreshLocal;
    jwt.verify(refreshToken, keyRefreshToken, (err, user) => {
      if (err) {
        return res
          .status(400)
          .json({ EC: -2, data: "Refresh token is expired" });
      }
      refreshTokens = refreshTokens.filter((token) => token != refreshToken);

      // Create new access token/refresh Token
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

  // Logout
  logoutUser: async (req, res) => {
    return res.status(200).json({
      EC: 0,
      data: { EC: 0, data: "Logout successfully" },
    });
  },

  // Fetch account
  fetchAccount: async (req, res) => {
    try {
      const userFullInfo = await User.findById(req.user.id);
      const { password, ...others } = userFullInfo._doc;
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
