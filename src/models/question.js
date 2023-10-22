const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("question", questionSchema);
module.exports = Question;
