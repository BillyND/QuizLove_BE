const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("question", questionSchema);
module.exports = Question;
