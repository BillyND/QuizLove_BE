const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
// mongoose.set("strictQuery", false);
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
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
    phone: {
      type: String,
      required: true,
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