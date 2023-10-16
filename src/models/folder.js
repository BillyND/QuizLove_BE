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
    description: {
      type: String,
    },
    lastModified: {
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
  },
  { timestamps: true }
);
const Folder = mongoose.model("folder", folderSchema);
module.exports = Folder;
