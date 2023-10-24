const Course = require("../models/course");
const DraftCourse = require("../models/draftCourse");
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
      const page = req?.query?.page || 1;
      const limit = req?.query?.limit || 100;
      const courseId = req?.query?.courseId;
      const emailAuthor = req?.query?.emailAuthor;

      let listCourses = await Course.find({
        "author.email": emailAuthor,
      });

      console.log(">>>>emailAuthor:", emailAuthor);

      // Filter by courseId
      if (courseId) {
        let courseIdFounded = listCourses?.find(
          (item) => JSON.stringify(item?._id) === JSON.stringify(courseId)
        );

        listCourses = courseIdFounded ? [courseIdFounded] : [];
      }

      // Filter by isDeleted

      if ("true/false"?.includes(isDeleted)) {
        listCourses = listCourses?.filter(
          (item) => JSON.stringify(item?.isDeleted) === isDeleted
        );
      }

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

      let newQuestions = req?.body?.questions;

      const newData = {
        author: {
          _id: authorCourses?._id,
          email: authorCourses?.email,
          username: authorCourses?.username,
          avatar: authorCourses?.avatar,
        },
        title: req?.body?.title,
        description: req?.body?.description,
        image: req?.body?.image,
      };

      const resCreateCourse = await Course.create(newData);

      newQuestions = newQuestions.map((item) => {
        let newItem = {};
        newItem.courseId = resCreateCourse?._id;
        newItem.question = item.question;
        newItem.answer = item.answer;
        return newItem;
      });

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

  // Update draft course
  updateDraftCourse: async (req, res) => {
    try {
      let authorCourses = await User.findById(req?.user?.id);

      let existDraftCourse = await DraftCourse.find({
        "author.email": authorCourses?.email,
      });

      let newQuestions = req?.body?.questions;

      newQuestions = newQuestions?.filter((item) => {
        if (item?.question?.trim() || item?.answer?.trim()) {
          return item;
        }
      });

      const newData = {
        author: {
          _id: authorCourses?._id,
          email: authorCourses?.email,
          username: authorCourses?.username,
          avatar: authorCourses?.avatar,
        },
        title: req?.body?.title,
        description: req?.body?.description,
        questions: newQuestions,
      };

      let resDraftCourse = !!existDraftCourse?.length
        ? await DraftCourse.updateOne(newData)
        : await DraftCourse.create(newData);

      res.status(200).json({
        EC: 0,
        data: resDraftCourse,
        message: "Save draft course successfully",
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        err: error?.errors,
        message: "Server error!",
      });
    }
  },

  // Get draft course
  getDraftCourse: async (req, res) => {
    try {
      let authorCourses = await User.findById(req?.user?.id);

      let existDraftCourse = await DraftCourse.find({
        "author.email": authorCourses?.email,
      });

      // existDraftCourse[0].questions = existDraftCourse?.[0]?.questions.filter(
      //   (item) => {
      //     if (item?.question?.trim() || item?.answer?.trim()) {
      //       return item;
      //     }
      //   }
      // );

      res.status(200).json({
        EC: 0,
        data: existDraftCourse,
        message: "Get draft course successfully",
      });
    } catch (error) {
      res.status(500).json({
        EC: 1,
        err: error?.errors,
        message: "Server error!",
      });
    }
  },

  // Get draft course
  deleteDraftCourse: async (req, res) => {
    try {
      let authorCourses = await User.findById(req?.user?.id);

      let existDraftCourse = await DraftCourse.deleteOne({
        "author.email": authorCourses?.email,
      });

      res.status(200).json({
        EC: 0,
        data: existDraftCourse,
        message: "Delete draft course successfully",
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
