const express = require("express");
const { getLeaderboardBySubject } = require("../controllers/leaderboardController");
//const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:courseName",getLeaderboardBySubject); 

module.exports = router;
