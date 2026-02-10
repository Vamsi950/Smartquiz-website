import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Courses.css";
import Sidebar2 from "../components/Sidebar-2";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses/");
        if (!response.ok) throw new Error("Local failed");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.warn("Local fetch failed, trying production...", error);
        try {
          const response = await fetch("https://quiz-app-dq18.onrender.com/api/courses/");
          const data = await response.json();
          setCourses(data);
        } catch (prodErr) {
          console.error("Failed to fetch courses:", prodErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar2 />
      <main className="main-content">
        <h1>Available Courses</h1>

        {loading ? (
          <div className="loading-text">Exploring course catalog...</div>
        ) : (
          <div className="courses-grid">
            {courses.map((course, index) => {
              const path = `/courses/${course.name}`;
              return (
                <Link key={index} to={path} className="course-box">
                  <h2>{course.name}</h2>
                  <p className="course-link-text">
                    Click to view topics
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
