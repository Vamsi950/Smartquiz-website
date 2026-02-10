const Result = require("../models/Result");

// Save quiz result
const submitResult = async (req, res) => {
  try {
    console.log("Received result submission:", req.body);

    const { userId, username, courseName, topicId, score, total } = req.body;

    if (!userId || !username || !courseName || !topicId || score === undefined ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = new Result({
      userId,
      username,
      courseName,
      topicId,
      score,
      totalQuestions: total,
    });

    await result.save();
    res.status(201).json({ message: "Quiz result saved successfully!" });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    res.status(500).json({ message: "Failed to save quiz result", error: error.message });
  }
};
// Get leaderboard by course
const getLeaderboardByCourse = async (req, res) => {
  const { courseName } = req.params;

  try {
    const results = await Result.find({ courseName }).sort({ score: -1, submittedAt: 1 });
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {submitResult,  getLeaderboardByCourse,};
