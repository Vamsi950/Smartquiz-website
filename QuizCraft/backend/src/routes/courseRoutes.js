const express = require("express");
const {
    getAllCourses,
    getTopicsByCourse,
    getQuestionsByTopic,
    addCourse,
    addTopicToCourse,
    addQuestionToTopic,
    updateCourseName,
    updateTopicName,
    updateQuestion,
    deleteCourse,
    deleteTopic,
    deleteQuestion
} = require("../controllers/courseController");

const router = express.Router();

// 📌 Routes
router.get("/", getAllCourses);
router.get("/topics/:courseName", getTopicsByCourse);
router.get("/questions/:courseName/:topicId", getQuestionsByTopic);

// 📌 Add Routes
router.post("/addcourse", addCourse);
router.post("/addcourse/:courseName/topics", addTopicToCourse);
router.post("/addcourse/:courseName/topics/:topicId/questions", addQuestionToTopic);

// 📌 Update Routes
router.put("/updatecourse/:courseId", updateCourseName);
router.put("/updatetopic/:courseName/:topicId", updateTopicName);
router.put("/updatequestion/:courseName/:topicId/:questionId", updateQuestion);

// 📌 Delete Routes
router.delete("/deletecourse/:courseId", deleteCourse);
router.delete("/deletetopic/:courseName/:topicId", deleteTopic);
router.delete("/deletequestion/:courseName/:topicId/:questionId", deleteQuestion);

module.exports = router;
