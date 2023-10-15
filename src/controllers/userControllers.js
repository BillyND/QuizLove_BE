const User = require("../models/user");

const userController = {
  // Get all users
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

  // Delete a user
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json({
        EC: 0,
        data: "Delete successfully",
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
