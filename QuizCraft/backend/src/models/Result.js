// models/Result.js
const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  userId: String,
  username: String,
  courseName: String,
  topicId: String,
  score: Number,
  totalQuestions: Number,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Result", resultSchema);
