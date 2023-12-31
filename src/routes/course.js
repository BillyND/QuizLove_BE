const courseController = require("../controllers/courseController");
const middlewareControllers = require("../controllers/middlewareControllers");
const courseRouter = require("express").Router();

//Get All Courses
courseRouter.get(
  "/all",
  middlewareControllers.verifyTokenAndAdmin,
  courseController.getAllCourses
);

//Get Course by condition
courseRouter.get(
  "/",
  middlewareControllers.verifyToken,
  courseController.getCoursesByCondition
);

//Create course
courseRouter.post(
  "/",
  middlewareControllers.verifyToken,
  courseController.createCourse
);

//Update draft course
courseRouter.post(
  "/draft",
  middlewareControllers.verifyToken,
  courseController.updateDraftCourse
);

//Draft course
courseRouter.get(
  "/draft",
  middlewareControllers.verifyToken,
  courseController.getDraftCourse
);

//Delete draft course
courseRouter.delete(
  "/draft",
  middlewareControllers.verifyToken,
  courseController.deleteDraftCourse
);

//Delete Course
courseRouter.delete(
  "/:id",
  middlewareControllers.verifyToken,
  courseController.deleteOrRestoreCourse
);

//Update Course
courseRouter.patch(
  "/:id",
  middlewareControllers.verifyToken,
  courseController.updateCourse
);

module.exports = courseRouter;
