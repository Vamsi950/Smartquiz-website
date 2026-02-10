import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';
import { Modal } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { FaChartBar, FaUserCheck, FaChevronRight } from 'react-icons/fa';

const AdminAnalytics = () => {
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/user-results', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const data = await response.json();
        setUserResults(data.userResults);
      } catch (err) {
        console.error("Local analytics fetch failed, trying production...", err);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('https://quiz-app-dq18.onrender.com/api/admin/user-results', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) throw new Error('Failed to fetch analytics');
          const data = await response.json();
          setUserResults(data.userResults);
        } catch (prodErr) {
          setError('Failed to load analytics');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // Aggregate user stats
  const userStats = {};
  userResults.forEach(result => {
    const userId = result.userId?._id || result.userId;
    if (!userStats[userId]) {
      userStats[userId] = {
        name: result.userId?.name || result.username,
        email: result.userId?.email || '',
        quizzes: 0,
        scores: [],
        subjectScores: {},
      };
    }
    userStats[userId].quizzes += 1;
    userStats[userId].scores.push({
      course: result.courseName,
      score: result.score,
      date: result.submittedAt,
    });
    if (!userStats[userId].subjectScores[result.courseName]) {
      userStats[userId].subjectScores[result.courseName] = [];
    }
    userStats[userId].subjectScores[result.courseName].push(result.score);
  });

  const usersWithQuizzes = Object.entries(userStats).filter(([_, stats]) => stats.quizzes > 0);

  if (loading) return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-main-content">
        <div className="admin-subtitle">Analyzing platform data...</div>
      </main>
    </div>
  );

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
            <div className="header-badge">PERFORMANCE INSIGHTS</div>
            <h1>Global <span className="highlight-text">Analytics</span></h1>
            <p className="admin-subtitle">Examine participation velocity and academic trends across the student body.</p>
          </motion.div>
        </header>

        <div className="admin-pro-grid">
          {error ? (
            <div className="admin-featured-card" style={{ padding: '60px', textAlign: 'center' }}>
              <div className="admin-subtitle" style={{ color: '#e11d48' }}>{error}</div>
            </div>
          ) : usersWithQuizzes.length === 0 ? (
            <div className="admin-featured-card" style={{ padding: '60px', textAlign: 'center' }}>
              <FaChartBar style={{ fontSize: '3rem', color: '#71717a', marginBottom: '20px', opacity: 0.5 }} />
              <div className="admin-subtitle">No quiz participation recorded yet.</div>
            </div>
          ) : (
            <motion.div
              className="user-list-card glass-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div className="header-badge" style={{ margin: 0 }}>ACTIVE PARTICIPANTS</div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Participant Name</th>
                      <th>Email Identifier</th>
                      <th style={{ textAlign: 'center' }}>Quizzes Attempted</th>
                      <th style={{ textAlign: 'right' }}>Analysis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersWithQuizzes.map(([userId, stats]) => (
                      <tr key={userId}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="mini-icon" style={{ background: 'rgba(113, 113, 122, 0.1)', padding: '8px', borderRadius: '8px', color: '#71717a' }}>
                              <FaUserCheck />
                            </div>
                            {stats.name || 'Anonymous Voter'}
                          </div>
                        </td>
                        <td style={{ color: '#64748b' }}>{stats.email || 'N/A'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="role-badge user">{stats.quizzes}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn-secondary-pro"
                            style={{ display: 'inline-flex', width: 'auto' }}
                            onClick={() => navigate(`/admin/analytics/${userId}`)}
                          >
                            View Metrics <FaChevronRight style={{ fontSize: '0.7rem' }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
