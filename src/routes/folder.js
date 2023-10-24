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
  middlewareControllers.verifyToken,
  folderController.getFoldersByCondition
);

//Create folder
folderRouter.post(
  "/",
  middlewareControllers.verifyToken,
  folderController.createFolder
);

//Delete Folder
folderRouter.delete(
  "/:id",
  middlewareControllers.verifyToken,
  folderController.deleteFolder
);

//Update Folder
folderRouter.patch(
  "/:id",
  middlewareControllers.verifyToken,
  folderController.updateFolder
);

module.exports = folderRouter;
