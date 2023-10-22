const mongoose = require("mongoose");

const draftCourseSchema = new mongoose.Schema(
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
    question: {
      type: Array,
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const DraftCourse = mongoose.model("draftCourse", draftCourseSchema);
module.exports = DraftCourse;
