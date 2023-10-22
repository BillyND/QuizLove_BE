const Folder = require("../models/folder");
const User = require("../models/user");
const { paginateArray } = require("../services/paginateArray");

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
      const isDeleted = req?.query?.isDeleted;
      const isHidden = req?.query?.isHidden;
      const page = req?.query?.page;
      const limit = req?.query?.limit;
      const folderId = req?.query?.folderId;
      const emailAuthor = req?.query?.emailAuthor;

      let listFolders = await Folder.find({
        "author.email": emailAuthor,
      });

      // Filter by folderId
      if (folderId) {
        let folderIdFounded = listFolders?.find(
          (item) => JSON.stringify(item?._id) === JSON.stringify(folderId)
        );

        listFolders = folderIdFounded ? [folderIdFounded] : [];
      }

      // Filter by isDeleted
      listFolders = listFolders?.filter(
        (item) => JSON.stringify(item?.isDeleted) === isDeleted
      );

      // Filter by isHidden
      listFolders = listFolders?.filter(
        (item) => JSON.stringify(item?.isHidden) === isHidden
      );

      // Filter by page&limit
      listFolders = paginateArray(listFolders, page, limit);

      listFolders?.reverse();

      res.status(200).json({
        EC: 0,
        totalItem: listFolders?.length,
        data: listFolders,
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
      let authorFolders = await User.findById(req?.user?.id);

      const newData = {
        author: {
          _id: authorFolders?._id,
          email: authorFolders?.email,
          username: authorFolders?.username,
          avatar: authorFolders?.avatar,
        },
        name: req?.body?.name,
        description: req?.body?.description,
      };
      console.log(newData);

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
  deleteOrRestoreFolder: async (req, res) => {
    try {
      const idFolder = req?.params?.id;
      const isDeleted = req?.body?.isDeleted;
      const updateData = {
        isDeleted: isDeleted,
        deletedAt: isDeleted ? new Date() : null,
      };
      let foundedFolderDelete = await Folder.findById(idFolder);
      const { personId: personIdFounded } = foundedFolderDelete;
      const { id: personId } = req?.user;

      if (personId !== personIdFounded) {
        res.status(500).json({
          EC: 1,
          message: "Don't own this folder!",
          data: null,
        });
      }

      foundedFolderDelete.isDeleted = updateData?.isDeleted;
      foundedFolderDelete.deletedAt = updateData?.deletedAt;

      await Folder.updateOne({ _id: idFolder }, updateData);

      res.status(200).json({
        EC: 0,
        data: foundedFolderDelete,
        message: "Delete successfully!",
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        data: error,
      });
    }
  },

  // Update a folder
  updateFolder: async (req, res) => {
    try {
      const folderId = req?.params?.id;

      const updateData = {
        name: req?.body?.name,
        description: req?.body?.description,
      };

      const foundedFolderDelete = await Folder.findById(folderId);
      const { personId: personIdFounded } = foundedFolderDelete;
      const { id: personId } = req?.user;

      if (personId !== personIdFounded) {
        res.status(500).json({
          EC: 1,
          message: "Don't own this folder!",
          data: null,
        });
      }

      await Folder.updateOne({ _id: folderId }, updateData);

      res.status(200).json({
        EC: 0,
        data: updateData,
        message: "Update successfully",
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        err: error,
        message: "Server error!",
      });
    }
  },
};

module.exports = folderController;
