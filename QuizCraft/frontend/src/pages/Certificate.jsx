import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Certificate.css";
import Sidebar2 from "../components/Sidebar-2";
import { toast } from 'react-toastify';

const Certificate = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [username, setUsername] = useState(null);
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses/");
      if (Array.isArray(response.data)) {
        setCourses(response.data);
      }
    } catch (error) {
      console.warn("Local fetch failed, trying production...", error);
      try {
        const response = await axios.get("https://quiz-app-dq18.onrender.com/api/courses/");
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        }
      } catch (prodErr) {
        console.error("Error fetching courses:", prodErr);
        setCourses([]);
      }
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleDownload = async () => {
    if (!username) {
      toast.error("You must be logged in to download the certificate.");
      return;
    }

    if (!selectedCourse) {
      toast.error("Please select a course.");
      return;
    }

    try {
      let response;
      try {
        response = await axios.get(
          `http://localhost:5000/api/certificate/${username}/${encodeURIComponent(selectedCourse)}`,
          { responseType: "blob" }
        );
      } catch (localErr) {
        console.warn("Local cert download failed, trying production...", localErr);
        response = await axios.get(
          `https://quiz-app-dq18.onrender.com/api/certificate/${username}/${encodeURIComponent(selectedCourse)}`,
          { responseType: "blob" }
        );
      }

      const percentage = response.headers["x-percentage"] || "82.00%";

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedCourse}_Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);

      setErrorMessage("");
      toast.success(`🎉 Congratulations! Your certificate has been downloaded. You scored ${percentage} in this course.`);
    } catch (error) {
      setSuccessMessage("");
      if (error.response) {
        try {
          const data = await error.response.data.text();
          const parsed = JSON.parse(data);
          if (parsed.message && parsed.percentage) {
            setErrorMessage(`${parsed.message} Your current score is ${parsed.percentage}.`);
          } else if (parsed.message) {
            setErrorMessage(parsed.message);
          } else {
            setErrorMessage("Something went wrong while downloading.");
          }
        } catch (err) {
          setErrorMessage("Something went wrong while downloading.");
        }
      } else {
        console.error("Error downloading certificate:", error);
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <Sidebar2 />
      <main className="main-content">
        <div className="outbox">
          <div className="certificate-container">
            <h2 className="certificate-title">🎓 Certification Portal</h2>
            <p className="certificate-subtitle">Choose a course to download your earned certificate.</p>

            <select
              className="course-dropdown"
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              <option value="">Select Certificate</option>
              {loadingCourses ? (
                <option disabled>Loading courses...</option>
              ) : (
                courses.map((course, index) => (
                  <option key={index} value={course.name}>
                    {course.name} Certificate
                  </option>
                ))
              )}
            </select>

            <button className="download-btn" onClick={handleDownload}>
              Download PDF
            </button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Certificate;
