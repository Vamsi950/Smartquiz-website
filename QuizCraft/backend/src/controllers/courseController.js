const fs = require("fs");
const path = require("path");

// 📌 Load Courses from JSON File
const getCoursesFromFile = () => {
    const filePath = path.join(__dirname, "../new course db.json");
    try {
        const data = fs.readFileSync(filePath, "utf8");
        const parsedData = JSON.parse(data);
        return Array.isArray(parsedData) ? parsedData : parsedData.courses || [];
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return [];
    }
};

const saveCoursesToFile = (courses) => {
    const filePath = path.join(__dirname, "../new course db.json");
    try {
        fs.writeFileSync(filePath, JSON.stringify({ courses }, null, 2));
    } catch (error) {
        console.error("Error writing JSON file:", error);
    }
};

// 📌 Get All Courses
const getAllCourses = (req, res) => {
    const courses = getCoursesFromFile();
    res.json(courses);
};

// 📌 Get Topics by Course Name
const getTopicsByCourse = (req, res) => {
    const courseName = req.params.courseName.toLowerCase();
    const courses = getCoursesFromFile();
    const course = courses.find((c) => c.name.toLowerCase() === courseName);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course.topics || []);
};

// 📌 Get Questions by Topic
const getQuestionsByTopic = (req, res) => {
    const courseName = req.params.courseName.toLowerCase();
    const topicId = parseInt(req.params.topicId, 10);
    const courses = getCoursesFromFile();
    const course = courses.find((c) => c.name.toLowerCase() === courseName);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const topic = course.topics.find((t) => t.id === topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json(topic.questions || []);
};

// 📌 Add Course
const addCourse = (req, res) => {
    const courses = getCoursesFromFile();
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Course name is required" });
    if (courses.find(c => c.name.toLowerCase() === name.toLowerCase())) {
        return res.status(409).json({ message: "Course already exists" });
    }
    const newCourse = { id: Date.now(), name, topics: [] };
    courses.push(newCourse);
    saveCoursesToFile(courses);
    res.status(201).json({ message: "Course added successfully", course: newCourse });
};

// 📌 Add Topic to Course
const addTopicToCourse = (req, res) => {
    const { courseName } = req.params;
    const { name } = req.body;
    const courses = getCoursesFromFile();
    const course = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase());
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.topics.find(t => t.name.toLowerCase() === name.toLowerCase())) {
        return res.status(409).json({ message: "Topic already exists in this course" });
    }
    const newTopic = { id: Date.now(), name, questions: [] };
    course.topics.push(newTopic);
    saveCoursesToFile(courses);
    res.status(201).json({ message: "Topic added", topic: newTopic });
};

// 📌 Add Question to Topic
const addQuestionToTopic = (req, res) => {
    const { courseName, topicId } = req.params;
    const { question, options, answer } = req.body;
    const courses = getCoursesFromFile();
    const course = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase());
    if (!course) return res.status(404).json({ message: "Course not found" });
    const topic = course.topics.find(t => t.id === parseInt(topicId));
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    if (topic.questions.find(q => q.question.toLowerCase() === question.toLowerCase())) {
        return res.status(409).json({ message: "Question already exists" });
    }
    const newQuestion = { id: Date.now(), question, options, answer };
    topic.questions.push(newQuestion);
    saveCoursesToFile(courses);
    res.status(201).json({ message: "Question added", question: newQuestion });
};

// 📌 Update Course Name
const updateCourseName = (req, res) => {
    const { courseId } = req.params;
    const { name } = req.body;
    const courses = getCoursesFromFile();
    const course = courses.find(c => c.id === parseInt(courseId));
    if (!course) return res.status(404).json({ message: "Course not found" });
    course.name = name;
    saveCoursesToFile(courses);
    res.json({ message: "Course updated", course });
};

// 📌 Update Topic Name
const updateTopicName = (req, res) => {
    const { courseName, topicId } = req.params;
    const { name } = req.body;
    const courses = getCoursesFromFile();
    const course = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase());
    if (!course) return res.status(404).json({ message: "Course not found" });
    const topic = course.topics.find(t => t.id === parseInt(topicId));
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    topic.name = name;
    saveCoursesToFile(courses);
    res.json({ message: "Topic updated", topic });
};

// 📌 Update Question Content
const updateQuestion = (req, res) => {
    const { courseName, topicId, questionId } = req.params;
    const { question, options, answer } = req.body;
    const courses = getCoursesFromFile();
    const course = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase());
    if (!course) return res.status(404).json({ message: "Course not found" });
    const topic = course.topics.find(t => t.id === parseInt(topicId));
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    const qToUpdate = topic.questions.find(q => q.id === parseInt(questionId));
    if (!qToUpdate) return res.status(404).json({ message: "Question not found" });
    qToUpdate.question = question;
    qToUpdate.options = options;
    qToUpdate.answer = answer;
    saveCoursesToFile(courses);
    res.json({ message: "Question updated", question: qToUpdate });
};

// 📌 Delete Course
const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    let courses = getCoursesFromFile();
    const index = courses.findIndex(c => c.id === parseInt(courseId));
    if (index === -1) return res.status(404).json({ message: "Course not found" });
    courses.splice(index, 1);
    saveCoursesToFile(courses);
    res.json({ message: "Course deleted successfully" });
};

// 📌 Delete Topic from Course
const deleteTopic = (req, res) => {
    const { courseName, topicId } = req.params;
    let courses = getCoursesFromFile();
    const course = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase());
    if (!course) return res.status(404).json({ message: "Course not found" });
    const index = course.topics.findIndex(t => t.id === parseInt(topicId));
    if (index === -1) return res.status(404).json({ message: "Topic not found" });
    course.topics.splice(index, 1);
    saveCoursesToFile(courses);
    res.json({ message: "Topic deleted successfully" });
};

// 📌 Delete Question from Topic
const deleteQuestion = (req, res) => {
    const { courseName, topicId, questionId } = req.params;
    let courses = getCoursesFromFile();
    const course = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase());
    if (!course) return res.status(404).json({ message: "Course not found" });
    const topic = course.topics.find(t => t.id === parseInt(topicId));
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    const index = topic.questions.findIndex(q => q.id === parseInt(questionId));
    if (index === -1) return res.status(404).json({ message: "Question not found" });
    topic.questions.splice(index, 1);
    saveCoursesToFile(courses);
    res.json({ message: "Question deleted successfully" });
};

module.exports = {
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
};
