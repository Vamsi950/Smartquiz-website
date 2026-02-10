import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaPlus, FaChevronLeft, FaListUl, FaSave, FaTimes } from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar";
import './AdminDashboard.css';
import './TopicList.css';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const TopicList = () => {
  const { courseName } = useParams();
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [editingTopic, setEditingTopic] = useState(null);
  const [editTopicName, setEditTopicName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, [courseName]);

  const fetchTopics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/courses/topics/${courseName}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch topics");
      const data = await res.json();
      setTopics(data);
    } catch (err) {
      console.error("Local fetch failed, trying production...", err);
      try {
        const res = await fetch(`https://quiz-app-dq18.onrender.com/api/courses/topics/${courseName}`);
        if (!res.ok) throw new Error("Failed to fetch topics");
        const data = await res.json();
        setTopics(data);
      } catch (prodErr) {
        setError("Failed to load topics");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = async () => {
    if (!newTopicName.trim()) {
      setError("Topic name is required");
      setIsSubmitted(true);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/courses/addcourse/${courseName}/topics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newTopicName }),
      });
      if (res.ok) {
        setNewTopicName("");
        setError("");
        setIsSubmitted(false);
        fetchTopics();
        toast.success("Topic added successfully!");
      }
    } catch (err) {
      toast.error("Failed to add topic");
    }
  };

  const handleEditTopic = async (topicId) => {
    if (!editTopicName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      let response;
      try {
        response = await fetch(`http://localhost:5000/api/courses/updatetopic/${courseName}/${topicId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ name: editTopicName }),
        });
      } catch (localErr) {
        console.warn("Local update failed, trying production...", localErr);
        response = await fetch(`https://quiz-app-dq18.onrender.com/api/courses/updatetopic/${courseName}/${topicId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ name: editTopicName }),
        });
      }

      if (response.ok) {
        setEditingTopic(null);
        setEditTopicName("");
        fetchTopics();
        toast.success("Topic updated successfully!");
      }
    } catch (err) {
      toast.error("Failed to update topic");
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Are you sure? This will delete all questions in this topic!")) return;
    try {
      const token = localStorage.getItem('token');
      let response;
      try {
        response = await fetch(`http://localhost:5000/api/courses/deletetopic/${courseName}/${topicId}`, {
          method: "DELETE",
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (localErr) {
        console.warn("Local delete failed, trying production...", localErr);
        response = await fetch(`https://quiz-app-dq18.onrender.com/api/courses/deletetopic/${courseName}/${topicId}`, {
          method: "DELETE",
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      if (response.ok) {
        fetchTopics();
        toast.success("Topic deleted successfully!");
      }
    } catch (err) {
      toast.error("Failed to delete topic");
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
            <button className="btn-secondary-pro" onClick={() => navigate('/courselist')} style={{ width: 'fit-content', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaChevronLeft /> Back to Courses
            </button>
            <div className="header-badge">UNIT ARCHITECTURE</div>
            <h1>{courseName} <span className="highlight-text">Topics</span></h1>
            <p className="admin-subtitle">Organize modular learning units and manage thematic content.</p>
          </motion.div>
        </header>

        <div className="admin-pro-grid">
          <div className="admin-bento-grid">
            {/* Add Topic Card */}
            <motion.div
              className="bento-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-header-mini">
                <FaPlus />
                <h3>New Learning Unit</h3>
              </div>
              <div className="edit-topic-container" style={{ marginTop: '20px' }}>
                <input
                  type="text"
                  placeholder="Thematic title..."
                  className="admin-form-control"
                  style={{ marginBottom: '16px', background: '#f8fafc' }}
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                />
                {isSubmitted && error && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', marginBottom: '20px' }}>{error}</p>}
                <button className="featured-cta" style={{ width: '100%', border: 'none', cursor: 'pointer', background: '#3f3f46', color: 'white', padding: '16px', borderRadius: '12px', fontWeight: '800' }} onClick={handleAddTopic}>
                  <FaPlus /> Initialize Topic
                </button>
              </div>
            </motion.div>

            {/* Topics List Card */}
            <motion.div
              className="user-list-card glass-card"
              style={{ gridColumn: 'span 2' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Topic Name</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topics.map((topic) => (
                      <tr key={topic._id}>
                        <td>
                          {editingTopic === topic._id ? (
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <input
                                type="text"
                                className="admin-form-control"
                                value={editTopicName}
                                onChange={(e) => setEditTopicName(e.target.value)}
                              />
                              <button className="action-btn edit" onClick={() => handleEditTopic(topic._id)}><FaSave /></button>
                              <button className="action-btn delete" onClick={() => setEditingTopic(null)}><FaTimes /></button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div className="mini-icon" style={{ background: 'rgba(113, 113, 122, 0.1)', padding: '8px', borderRadius: '8px', color: '#71717a' }}>
                                <FaListUl />
                              </div>
                              {topic.name}
                            </div>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button className="btn-secondary-pro" onClick={() => navigate(`/courses/${courseName}/topics/${topic._id}/questions`)}>
                              Questions
                            </button>
                            <button className="action-btn edit" onClick={() => { setEditingTopic(topic._id); setEditTopicName(topic.name); }}>
                              <FaEdit />
                            </button>
                            <button className="action-btn delete" onClick={() => handleDeleteTopic(topic._id)}>
                              <FaTimes />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {topics.length === 0 && !loading && (
                  <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No thematic units defined for this course.</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopicList;
