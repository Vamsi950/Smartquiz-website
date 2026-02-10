 import axios from "axios";

 export const getLeaderboardByCourse = async (courseName) => {
    const encodedCourseName = encodeURIComponent(courseName)
   const response = await axios.get(`https://quiz-app-dq18.onrender.com/api/leaderboard/${encodedCourseName}`);
   return response.data;
 };
