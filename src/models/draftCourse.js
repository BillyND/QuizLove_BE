const mongoose = require("mongoose");

const draftCourseSchema = new mongoose.Schema(
  {
    author: {
      type: JSON,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    questions: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const DraftCourse = mongoose.model("draftCourse", draftCourseSchema);
module.exports = DraftCourse;
