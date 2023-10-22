const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    courseId: {
      type: JSON,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    school: {
      type: String,
    },
    description: {
      type: String,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
const Class = mongoose.model("class", classSchema);
module.exports = Class;
