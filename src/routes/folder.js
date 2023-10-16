const folderController = require("../controllers/folderController");
const middlewareControllers = require("../controllers/middlewareControllers");
const folderRouter = require("express").Router();

//Get All Folders
folderRouter.get(
  "/all",
  middlewareControllers.verifyTokenAndAdmin,
  folderController.getAllFolders
);

//Get Folder by user
folderRouter.get(
  "/",
  middlewareControllers.verifyToken,
  folderController.getFoldersByCondition
);

//Create folder
folderRouter.post(
  "/create",
  middlewareControllers.verifyToken,
  folderController.createFolder
);

//Delete Folder
folderRouter.delete(
  "/:id",
  middlewareControllers.verifyTokenAndAuthorization,
  folderController.deleteFolder
);

module.exports = folderRouter;
