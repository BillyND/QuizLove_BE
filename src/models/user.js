const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
userSchema.plugin(uniqueValidator);
const User = mongoose.model("user", userSchema);
module.exports = User;
