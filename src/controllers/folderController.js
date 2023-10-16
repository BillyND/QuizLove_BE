const Folder = require("../models/folder");

const folderController = {
  // Get all folders
  getAllFolders: async (req, res) => {
    try {
      const folder = await Folder.find({});
      res.status(200).json({
        EC: 0,
        data: folder,
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        data: error,
      });
    }
  },

  // Get folder by condition
  getFoldersByCondition: async (req, res) => {
    try {
      const isDeleted = JSON.parse(req?.query?.filters?.isDeleted);
      const isHidden = JSON.parse(req?.query?.filters?.isHidden);

      const listFolders = await Folder.find({ personId: req?.user?.id });

      const filteredFolders = listFolders
        .filter((item) => item?.isHidden === isHidden)
        ?.filter((item) => item?.isDeleted === isDeleted);

      res.status(200).json({
        EC: 0,
        data: filteredFolders,
        message: "Get folders by condition successfully",
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        err: error?.error,
      });
    }
  },

  // Create a folder
  createFolder: async (req, res) => {
    try {
      const newData = {
        personId: req?.user?.id,
        name: req?.body?.name,
        description: req?.body?.description,
      };

      const resCreateFolder = await Folder.create(newData);

      res.status(200).json({
        EC: 0,
        data: resCreateFolder,
        message: "Create successfully",
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        err: error?.errors,
        message: "Server error!",
      });
    }
  },

  // Delete a folder
  deleteFolder: async (req, res) => {
    try {
      const folder = await Folder.findById(req.params.id);
      res.status(200).json({
        EC: 0,
        data: "Delete successfully",
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        data: error,
      });
    }
  },
};

module.exports = folderController;
