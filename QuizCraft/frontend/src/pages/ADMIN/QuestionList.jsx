import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaEdit, FaPlus, FaSave, FaTimes, FaQuestionCircle, FaCheckCircle, FaTrash } from 'react-icons/fa';
import AdminSidebar from "../../components/AdminSidebar";
import "./AdminDashboard.css";
import "./QuestionList.css";
import { motion } from 'framer-motion';

const QuestionList = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [newQuestionData, setNewQuestionData] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
  });
  const [editQuestionData, setEditQuestionData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/topics/${courseName}`);
        setTopics(response.data || []);
      } catch (err) {
        console.warn("Local topics fetch failed, trying production...", err);
        try {
          const response = await axios.get(`https://quiz-app-dq18.onrender.com/api/courses/topics/${courseName}`);
          setTopics(response.data || []);
        } catch (prodErr) {
          console.error("Error fetching course topics:", prodErr);
        }
      }
    };
    fetchTopics();
  }, [courseName]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedTopicId) return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/courses/questions/${courseName}/${selectedTopicId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setQuestions(response.data || []);
      } catch (err) {
        console.error("Local fetch failed, trying production...", err);
        try {
          const response = await axios.get(
            `https://quiz-app-dq18.onrender.com/api/courses/questions/${courseName}/${selectedTopicId}`
          );
          setQuestions(response.data || []);
        } catch (prodErr) {
          console.error("Error fetching questions:", prodErr);
        }
      }
    };
    fetchQuestions();
  }, [courseName, selectedTopicId]);

  const handleTopicSelect = (e) => {
    setSelectedTopicId(e.target.value);
    setEditQuestionData(null);
  };

  const handleInputChange = (e, index) => {
    const updatedOptions = [...newQuestionData.options];
    updatedOptions[index] = e.target.value;
    setNewQuestionData({ ...newQuestionData, options: updatedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestionData.question.trim()) {
      setError("Question is required!");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      let response;
      try {
        response = await axios.post(
          `http://localhost:5000/api/courses/addcourse/${courseName}/topics/${selectedTopicId}/questions`,
          newQuestionData,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      } catch (localErr) {
        console.warn("Local add question failed, trying production...", localErr);
        response = await axios.post(
          `https://quiz-app-dq18.onrender.com/api/courses/addcourse/${courseName}/topics/${selectedTopicId}/questions`,
          newQuestionData,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      }

      const refreshRes = await axios.get(
        `http://localhost:5000/api/courses/questions/${courseName}/${selectedTopicId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      ).catch(() => axios.get(`https://quiz-app-dq18.onrender.com/api/courses/questions/${courseName}/${selectedTopicId}`));

      setQuestions(refreshRes.data || []);
      setNewQuestionData({ question: "", options: ["", "", "", ""], answer: "" });
      setError("");
      toast.success("Question added successfully!");
    } catch (err) {
      console.error("Error adding question:", err);
      setError("Failed to add question.");
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const token = localStorage.getItem('token');
      let response;
      try {
        response = await axios.delete(
          `http://localhost:5000/api/courses/deletequestion/${courseName}/${selectedTopicId}/${questionId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      } catch (localErr) {
        console.warn("Local delete question failed, trying production...", localErr);
        response = await axios.delete(
          `https://quiz-app-dq18.onrender.com/api/courses/deletequestion/${courseName}/${selectedTopicId}/${questionId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      }

      if (response.status === 200) {
        const refreshRes = await axios.get(
          `http://localhost:5000/api/courses/questions/${courseName}/${selectedTopicId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        ).catch(() => axios.get(`https://quiz-app-dq18.onrender.com/api/courses/questions/${courseName}/${selectedTopicId}`));

        setQuestions(refreshRes.data || []);
        toast.success("Question deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting question:", err);
      toast.error("Failed to delete question.");
    }
  };

  const handleEdit = (question) => {
    setEditQuestionData({ ...question });
  };

  const handleEditChange = (e, index) => {
    const updatedOptions = [...editQuestionData.options];
    updatedOptions[index] = e.target.value;
    setEditQuestionData({ ...editQuestionData, options: updatedOptions });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editQuestionData.question.trim()) {
      setError("Question is required!");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      let response;
      try {
        response = await axios.put(
          `http://localhost:5000/api/courses/updatequestion/${courseName}/${selectedTopicId}/${editQuestionData.id}`,
          {
            question: editQuestionData.question,
            options: editQuestionData.options,
            answer: editQuestionData.answer,
          },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      } catch (localErr) {
        console.warn("Local update question failed, trying production...", localErr);
        response = await axios.put(
          `https://quiz-app-dq18.onrender.com/api/courses/updatequestion/${courseName}/${selectedTopicId}/${editQuestionData.id}`,
          {
            question: editQuestionData.question,
            options: editQuestionData.options,
            answer: editQuestionData.answer,
          },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      }

      const refreshRes = await axios.get(
        `http://localhost:5000/api/courses/questions/${courseName}/${selectedTopicId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      ).catch(() => axios.get(`https://quiz-app-dq18.onrender.com/api/courses/questions/${courseName}/${selectedTopicId}`));

      setQuestions(refreshRes.data || []);
      setEditQuestionData(null);
      setError("");
      toast.success("Question updated successfully!");
    } catch (err) {
      console.error("Error updating question:", err);
      setError("Failed to update question.");
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
            <button className="btn-secondary-pro" onClick={() => navigate("/courselist")} style={{ width: 'fit-content', marginBottom: '24px' }}>
              <FaChevronLeft /> Back to Courses
            </button>
            <div className="header-badge">CONTENT REPOSITORY</div>
            <h1>{courseName} <span className="highlight-text">Query Bank</span></h1>
            <p className="admin-subtitle">Manage assessment questions, define correct answers, and organize by topic.</p>
          </motion.div>
        </header>

        <div className="admin-pro-grid">
          <div className="admin-card-pro" style={{ padding: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label className="admin-label-pro" style={{ margin: 0 }}>Filter by Topic:</label>
              <select value={selectedTopicId} onChange={handleTopicSelect} className="admin-form-control" style={{ maxWidth: '400px', padding: '12px' }}>
                <option value="">-- Select Topic Unit --</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedTopicId ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
              {/* Question List Section */}
              <motion.div
                className="user-list-card glass-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                  <div className="header-badge" style={{ margin: 0 }}>ACTIVE QUESTIONS</div>
                </div>

                <div className="question-feed">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="question-item-pro">
                      <div className="q-header">
                        <span className="q-number">Q{idx + 1}</span>
                        <h3>{q.question}</h3>
                      </div>
                      <div className="q-options-grid">
                        {q.options.map((opt, i) => (
                          <div key={i} className={`q-opt-preview ${opt === q.answer ? 'correct' : ''}`}>
                            {opt === q.answer && <FaCheckCircle className="ans-icon" />}
                            {opt}
                          </div>
                        ))}
                      </div>
                      <div className="q-actions">
                        <button className="btn-secondary-pro" onClick={() => handleEdit(q)}>
                          <FaEdit /> Modify
                        </button>
                        <button className="btn-secondary-pro" style={{ color: '#ef4444' }} onClick={() => handleDelete(q.id)}>
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                      <FaQuestionCircle style={{ fontSize: '3rem', color: '#e2e8f0', marginBottom: '16px' }} />
                      <p style={{ color: '#94a3b8', fontWeight: '600' }}>No questions found for this topic yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Form Section */}
              <motion.div
                className="admin-featured-card"
                style={{ height: 'fit-content', padding: '40px' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="featured-content" style={{ padding: 0 }}>
                  <span className="featured-label">{editQuestionData ? 'REVISE QUESTION' : 'ADD NEW ENTRY'}</span>
                  <h2 style={{ fontSize: '1.8rem' }}>{editQuestionData ? 'Edit' : 'Create'} <span>Question</span></h2>

                  <form onSubmit={editQuestionData ? handleEditSubmit : handleSubmit} style={{ marginTop: '24px' }}>
                    <div className="admin-form-group">
                      <label className="admin-label-pro">Question Text</label>
                      <textarea
                        className="admin-form-control"
                        style={{ padding: '16px', minHeight: '100px', resize: 'vertical' }}
                        value={editQuestionData ? editQuestionData.question : newQuestionData.question}
                        onChange={(e) => editQuestionData ? setEditQuestionData({ ...editQuestionData, question: e.target.value }) : setNewQuestionData({ ...newQuestionData, question: e.target.value })}
                        placeholder="Type your question here..."
                        required
                      />
                    </div>

                    <div className="options-input-grid" style={{ marginTop: '20px' }}>
                      <label className="admin-label-pro">Options</label>
                      {(editQuestionData ? editQuestionData.options : newQuestionData.options).map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          className="admin-form-control"
                          style={{ padding: '12px 16px', marginBottom: '12px' }}
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => editQuestionData ? handleEditChange(e, index) : handleInputChange(e, index)}
                          required
                        />
                      ))}
                    </div>

                    <div className="admin-form-group" style={{ marginTop: '12px' }}>
                      <label className="admin-label-pro">Correct Answer Mapping</label>
                      <input
                        type="text"
                        className="admin-form-control"
                        style={{ padding: '12px 16px', borderLeft: '4px solid #10b981' }}
                        placeholder="Must match one of the options exactly"
                        value={editQuestionData ? editQuestionData.answer : newQuestionData.answer}
                        onChange={(e) => editQuestionData ? setEditQuestionData({ ...editQuestionData, answer: e.target.value }) : setNewQuestionData({ ...newQuestionData, answer: e.target.value })}
                        required
                      />
                    </div>

                    {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', marginTop: '16px' }}>{error}</p>}

                    <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                      <button type="submit" className="featured-cta" style={{ flex: 1, border: 'none', cursor: 'pointer', background: '#3f3f46', color: 'white', padding: '16px', borderRadius: '12px', fontWeight: '800' }}>
                        {editQuestionData ? <><FaSave /> Update Entry</> : <><FaPlus /> Add to Bank</>}
                      </button>
                      {editQuestionData && (
                        <button type="button" className="btn-secondary-pro" style={{ padding: '16px' }} onClick={() => setEditQuestionData(null)}>
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="user-list-card" style={{ textAlign: 'center', padding: '100px' }}>
              <div className="mini-icon" style={{ background: 'rgba(113, 113, 122, 0.1)', width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 24px', color: '#71717a', fontSize: '2rem' }}>
                <FaListUl />
              </div>
              <h2>Select a topic unit to manage questions</h2>
              <p className="admin-subtitle">Choose a specific topic from the dropdown above to view or modify its question set.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuestionList;
