import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Leaderboard.css";
import Sidebar2 from "../components/Sidebar-2";

const LeaderboardPage = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchLeaderboard(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses/");
      setCourses(response.data);
    } catch (error) {
      console.error("Local courses fetch failed, trying production...", error);
      try {
        const response = await axios.get("https://quiz-app-dq18.onrender.com/api/courses/");
        setCourses(response.data);
      } catch (prodErr) {
        console.error("Error fetching courses:", prodErr);
      }
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchLeaderboard = async (courseName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/leaderboard/${courseName}`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Local leaderboard fetch failed, trying production...", error);
      try {
        const response = await axios.get(`https://quiz-app-dq18.onrender.com/api/leaderboard/${courseName}`);
        setLeaderboard(response.data);
      } catch (prodErr) {
        console.error("Error fetching leaderboard:", prodErr);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar2 />
      <main className="main-content">
        <div className="leaderboard-content">
          <h2 className="leaderboard-title">Leaderboard Based on Courses</h2>

          <div className="dropdown-container">
            <label htmlFor="course-select">Select Course:</label>
            <select
              id="course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="course-select"
            >
              <option value="">-- Select a Course --</option>
              {courses.map((course, idx) => (
                <option key={idx} value={course.name}>{course.name}</option>
              ))}
            </select>
          </div>

          {leaderboard.length > 0 ? (
            <div className="tablecontainer">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.totalScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : selectedCourse && (
            <p className="no-data">No data available for this course.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
