const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    author: {
      type: JSON,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    folderId: {
      type: String,
    },
    question: {
      type: Array,
      required: true,
      default: [],
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

const Course = mongoose.model("course", courseSchema);
module.exports = Course;
