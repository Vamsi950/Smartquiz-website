const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    totalCoursesCompleted: { type: Number, default: 0 }, // Tracks completed courses
}, { timestamps: true });

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
