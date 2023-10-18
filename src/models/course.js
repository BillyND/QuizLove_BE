const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    personId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    courses: {
      type: Array,
      default: [],
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

const Folder = mongoose.model("folder", folderSchema);
module.exports = Folder;
