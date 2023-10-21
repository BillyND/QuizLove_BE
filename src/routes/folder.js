const folderController = require("../controllers/folderController");
const middlewareControllers = require("../controllers/middlewareControllers");
const folderRouter = require("express").Router();

//Get All Folders
folderRouter.get(
  "/all",
  middlewareControllers.verifyTokenAndAdmin,
  folderController.getAllFolders
);

//Get Folder by condition
folderRouter.get(
  "/",
  middlewareControllers.verifyTokenFolder,
  folderController.getFoldersByCondition
);

//Create folder
folderRouter.post(
  "/create",
  middlewareControllers.verifyToken,
  folderController.createFolder
);

//Delete Folder
folderRouter.post(
  "/delete/:id",
  middlewareControllers.verifyToken,
  folderController.deleteOrRestoreFolder
);

//Update Folder
folderRouter.patch(
  "/update/:id",
  middlewareControllers.verifyToken,
  folderController.updateFolder
);

module.exports = folderRouter;
