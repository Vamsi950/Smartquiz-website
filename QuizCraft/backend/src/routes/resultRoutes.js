const express = require("express");
const router = express.Router();
const {submitResult,getLeaderboardByCourse,} = require("../controllers/resultController");

// POST /api/result/submit
router.post("/submit", submitResult);

// GET /api/result/leaderboard/:courseName
router.get("/leaderboard/:courseName", getLeaderboardByCourse);

module.exports = router;
