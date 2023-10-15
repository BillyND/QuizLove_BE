const User = require("../models/user");
const bcrypt = require("bcrypt");

const userController = {
  //GET ALL USERS
  getAllUsers: async (req, res) => {
    console.log("req.user>>>", req.user);
    try {
      const user = await User.find({});
      res.status(200).json({
        EC: 0,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        data: error,
      });
    }
  },

  //DELETE USER
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json({
        EC: 0,
        data: "delete successfully",
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        data: error,
      });
    }
  },
};

module.exports = userController;
