const Result = require("../models/Result");

// Get user's subject-wise analytics (only subjects they attempted)
const getUserAnalytics = async (req, res) => {
  const { userId } = req.params;

  try {
    const userResults = await Result.aggregate([
      { $match: { userId } }, // Filter only this user's results
      {
        $group: {
          _id: "$courseName", // Group by subject
          averageScore: { $avg: "$score" } // Average score calculation
        }
      },
      {
        $project: {
          _id: 0,
          courseName: "$_id",
          averageScore: 1
        }
      }
    ]);

    res.status(200).json(userResults);
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getUserAnalytics };
