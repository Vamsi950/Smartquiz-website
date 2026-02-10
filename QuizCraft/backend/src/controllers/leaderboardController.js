const Result = require('../models/Result');

const getLeaderboardBySubject = async (req, res) => {
  const { courseName } = req.params;
  console.log(courseName);

  try {
    const leaderboard = await Result.aggregate([
      { $match: { courseName } }, // Filter results by subject
      {
        $group: {
            _id: "$userId",
            username: { $first: "$username" },
            totalScore: { $sum: "$score" }
          }
      },
      { $sort: { totalScore: -1 } } // Sort by score (descending)
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

module.exports = { getLeaderboardBySubject };
