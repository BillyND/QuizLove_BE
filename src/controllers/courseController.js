const Course = require("../models/course");
const Question = require("../models/question");
const User = require("../models/user");
const { paginateArray } = require("../services/paginateArray");

const courseController = {
  // Get all courses
  getAllCourses: async (req, res) => {
    try {
      const course = await Course.find({});
      res.status(200).json({
        EC: 0,
        data: course,
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        data: error,
      });
    }
  },

  // Get course by condition
  getCoursesByCondition: async (req, res) => {
    try {
      const isDeleted = req?.query?.isDeleted;
      const page = req?.query?.page;
      const limit = req?.query?.limit;
      const courseId = req?.query?.courseId;
      const emailAuthor = req?.query?.emailAuthor;

      let listCourses = await Course.find({
        "author.email": emailAuthor,
      });

      // Filter by courseId
      if (courseId) {
        let courseIdFounded = listCourses?.find(
          (item) => JSON.stringify(item?._id) === JSON.stringify(courseId)
        );

        listCourses = courseIdFounded ? [courseIdFounded] : [];
      }

      // Filter by isDeleted
      listCourses = listCourses?.filter(
        (item) => JSON.stringify(item?.isDeleted) === isDeleted
      );

      // Filter by isHidden
      listCourses = listCourses?.filter(
        (item) => JSON.stringify(item?.isHidden) === isHidden
      );

      // Filter by page&limit
      listCourses = paginateArray(listCourses, page, limit);

      listCourses?.reverse();

      res.status(200).json({
        EC: 0,
        totalItem: listCourses?.length,
        data: listCourses,
        message: "Get courses by condition successfully",
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        err: error?.error,
      });
    }
  },

  // Create a course
  createCourse: async (req, res) => {
    try {
      let authorCourses = await User.findById(req?.user?.id);

      const newQuestions = req?.body?.questions;

      console.log(">>>user", req?.user);

      const newData = {
        author: {
          _id: authorCourses?._id,
          email: authorCourses?.email,
          username: authorCourses?.username,
          avatar: authorCourses?.avatar,
        },
        name: req?.body?.name,
        description: req?.body?.description,
      };

      let resCreateCourse = await Course.create(newData);

      newQuestions.map((item) => (item.courseId = resCreateCourse?._id));

      newQuestions?.length && (await Question.insertMany(newQuestions));

      res.status(200).json({
        EC: 0,
        data: resCreateCourse,
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

  // Create a course
  createCourse: async (req, res) => {
    try {
      let authorCourses = await User.findById(req?.user?.id);

      const newQuestions = req?.body?.questions;

      console.log(">>>user", req?.user);

      const newData = {
        author: {
          _id: authorCourses?._id,
          email: authorCourses?.email,
          username: authorCourses?.username,
          avatar: authorCourses?.avatar,
        },
        name: req?.body?.name,
        description: req?.body?.description,
      };

      let resCreateCourse = await Course.create(newData);

      newQuestions.map((item) => (item.courseId = resCreateCourse?._id));

      newQuestions?.length && (await Question.insertMany(newQuestions));

      res.status(200).json({
        EC: 0,
        data: resCreateCourse,
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

  // Delete a course
  deleteOrRestoreCourse: async (req, res) => {
    try {
      const idCourse = req?.params?.id;
      const isDeleted = req?.body?.isDeleted;
      const updateData = {
        isDeleted: isDeleted,
        deletedAt: isDeleted ? new Date() : null,
      };
      let foundedCourseDelete = await Course.findById(idCourse);
      const { personId: personIdFounded } = foundedCourseDelete;
      const { id: personId } = req?.user;

      if (personId !== personIdFounded) {
        res.status(500).json({
          EC: 1,
          message: "Don't own this course!",
          data: null,
        });
      }

      foundedCourseDelete.isDeleted = updateData?.isDeleted;
      foundedCourseDelete.deletedAt = updateData?.deletedAt;

      await Course.updateOne({ _id: idCourse }, updateData);

      res.status(200).json({
        EC: 0,
        data: foundedCourseDelete,
        message: "Delete successfully!",
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        data: error,
      });
    }
  },

  // Update a course
  updateCourse: async (req, res) => {
    try {
      const courseId = req?.params?.id;

      const updateData = {
        name: req?.body?.name,
        description: req?.body?.description,
      };

      const foundedCourseDelete = await Course.findById(courseId);
      const { personId: personIdFounded } = foundedCourseDelete;
      const { id: personId } = req?.user;

      if (personId !== personIdFounded) {
        res.status(500).json({
          EC: 1,
          message: "Don't own this course!",
          data: null,
        });
      }

      await Course.updateOne({ _id: courseId }, updateData);

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

module.exports = courseController;