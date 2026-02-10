import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CourseTopics.css"; // Import the CSS

const CourseTopics = () => {
  const { courseName } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const formattedCourseName = decodeURIComponent(courseName);
        const response = await fetch(`http://localhost:5000/api/courses/topics/${formattedCourseName}`);
        if (!response.ok) throw new Error("Local failed");
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.warn("Local fetch failed, trying production...", error);
        try {
          const formattedCourseName = decodeURIComponent(courseName);
          const response = await fetch(`https://quiz-app-dq18.onrender.com/api/courses/topics/${formattedCourseName}`);
          if (!response.ok) throw new Error("Failed to fetch topics");
          const data = await response.json();
          setTopics(data);
        } catch (prodErr) {
          console.error("Error fetching topics:", prodErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [courseName]);

  if (loading) return <h2 style={{ color: "#94a3b8", textAlign: "center", marginTop: "100px", fontFamily: 'Outfit' }}>Exploring topics...</h2>;

  return (
    <div className="course-topics-container">
      <div className="course-topics-box">
        <h1 className="course-topics-title">{courseName} Topics</h1>
        <ul className="course-topics-list">
          {topics.map((topic) => (
            <li
              key={topic.id}
              className="course-topic-item"
              onClick={() => navigate(`/courses/${courseName}/topics/${topic.id}`)}
            >
              {topic.name}
            </li>
          ))}
        </ul>
        <div style={{ textAlign: "center", marginTop: "20px", textDecorationColor: "yellow" }}>
          <button onClick={() => navigate("/courses")} className="back-button">
            Go Back
          </button>
        </div>
      </div>

    </div>
  );
};

export default CourseTopics;
