import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';
import { FaBook, FaPlus, FaRegFileAlt, FaGraduationCap, FaTrash } from 'react-icons/fa';
import './courselist.css';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [addCourseError, setAddCourseError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("http://localhost:5000/api/courses", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses", error);
      // Fallback to production if local fails
      try {
        const res = await axios.get("https://quiz-app-dq18.onrender.com/api/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Critical error fetching courses", err);
      }
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) {
      setAddCourseError("Course name is required!");
      setIsSubmitted(true);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post("http://localhost:5000/api/courses/addcourse", {
        name: newCourseName,
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNewCourseName("");
      setAddCourseError("");
      setIsSubmitted(false);
      fetchCourses();

      toast.success("Course added successfully!");
    } catch (error) {
      setIsSubmitted(true);
      if (error.response?.data?.message) {
        setAddCourseError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setAddCourseError("Something went wrong while adding the course. Please try again.");
        toast.error("Something went wrong while adding the course. Please try again.");
      }
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course? This will remove all topics and questions.");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      let response;
      try {
        response = await axios.delete(`http://localhost:5000/api/courses/deletecourse/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (localErr) {
        console.warn("Local delete failed, trying production...", localErr);
        response = await axios.delete(`https://quiz-app-dq18.onrender.com/api/courses/deletecourse/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      fetchCourses();
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course", error);
      toast.error("Failed to delete course. Please try again.");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-main-content">
        <header className="admin-header-pro">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="header-badge">CURRICULUM CONTROL</div>
            <h1>Course <span className="highlight-text">Management</span></h1>
            <p className="admin-subtitle">Design your educational ecosystem and monitor quiz availability.</p>
          </motion.div>
        </header>

        <div className="admin-pro-grid">
          {/* Add Course Section */}
          <motion.div
            className="admin-featured-card add-course-featured"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="featured-content">
              <span className="featured-label">EXPAND LIBRARY</span>
              <h2>Add New <span>Educational Module</span></h2>
              <form className="admin-add-form" onSubmit={handleAddCourse}>
                <div className="input-group-pro">
                  <FaGraduationCap className="input-icon" />
                  <input
                    type="text"
                    placeholder="Enter Course Title (e.g. Data Structures)"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                  />
                </div>
                {isSubmitted && addCourseError && <p className="error-text-pro">{addCourseError}</p>}
                <button type="submit" className="featured-cta" style={{ border: 'none', cursor: 'pointer', background: '#3f3f46', color: 'white', padding: '16px 32px', borderRadius: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaPlus /> Initialize Course
                </button>
              </form>
            </div>
          </motion.div>

          {/* Course Grid */}
          <div className="admin-bento-grid">
            {courses.map((course, idx) => (
              <motion.div
                className="bento-card course-item-card"
                key={course.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (idx % 5) }}
              >
                <div className="card-icon"><FaBook /></div>
                <div className="card-info">
                  <h3>{course.name}</h3>
                  <div className="course-actions-mini">
                    <button className="btn-secondary-pro" onClick={() => navigate(`/courses/${course.name}/topics`)}>
                      <FaRegFileAlt /> Topics
                    </button>
                    <button className="btn-secondary-pro" onClick={() => navigate(`/courses/${course.name}/questions`)}>
                      <FaRegFileAlt /> Questions
                    </button>
                    <button
                      className="btn-secondary-pro delete-btn-accent"
                      onClick={() => handleDeleteCourse(course.id)}
                      style={{ color: '#ef4444' }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseList;
