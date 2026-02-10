import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaHistory, FaChartPie } from 'react-icons/fa';

const COLORS = ['#3f3f46', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8', '#27272a'];

const UserAnalyticsView = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/user/${userId}/analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Local failed');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.warn("Local analytics fetch failed, trying production...", err);
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`https://quiz-app-dq18.onrender.com/api/user/${userId}/analytics`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!res.ok) throw new Error('Failed to fetch analytics');
          const data = await res.json();
          setAnalytics(data);
        } catch (prodErr) {
          setError('Failed to load analytics');
        }
      }
    };
    const fetchUserScores = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/admin/user-results`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Local failed');
        const data = await res.json();
        const userResults = data.userResults.filter(r => (r.userId?._id || r.userId) === userId);
        setUser(userResults[0]?.userId || null);
        setScores(userResults.map(r => ({ course: r.courseName, score: r.score, date: r.submittedAt })));
      } catch (err) {
        console.warn("Local scores fetch failed, trying production...", err);
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`https://quiz-app-dq18.onrender.com/api/admin/user-results`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!res.ok) throw new Error('Failed to fetch user scores');
          const data = await res.json();
          const userResults = data.userResults.filter(r => (r.userId?._id || r.userId) === userId);
          setUser(userResults[0]?.userId || null);
          setScores(userResults.map(r => ({ course: r.courseName, score: r.score, date: r.submittedAt })));
        } catch (prodErr) {
          setError('Failed to load user scores');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
    fetchUserScores();
  }, [userId]);

  if (loading) return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-main-content">
        <div className="admin-subtitle">Filtering participant metrics...</div>
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
            <button className="btn-secondary-pro" onClick={() => navigate(-1)} style={{ width: 'fit-content', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaChevronLeft /> Back to Analytics
            </button>
            <div className="header-badge">PARTICIPANT PROFILE</div>
            <h1>{user?.name || 'Scholar'} <span className="highlight-text">Metrics</span></h1>
            <p className="admin-subtitle">Granular performance analysis and attempt history for individual users.</p>
          </motion.div>
        </header>

        <div className="admin-pro-grid">
          {error ? (
            <div className="admin-featured-card" style={{ padding: '60px', textAlign: 'center' }}>
              <div className="admin-subtitle" style={{ color: '#e11d48' }}>{error}</div>
            </div>
          ) : (
            <>
              <div className="admin-bento-grid">
                {/* Subject Distribution Card */}
                <motion.div
                  className="bento-card wide"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card-header-mini" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div className="mini-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '12px', color: '#6366f1' }}>
                      <FaChartPie />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Subject Distribution</h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'center' }}>
                    <div style={{ height: '350px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.map(d => ({ name: d.courseName || 'Unknown', value: d.averageScore }))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            stroke="none"
                          >
                            {analytics.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '14px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {analytics.map((entry, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#27272a', borderRadius: '12px' }}>
                          <div style={{ width: '12px', height: '12px', background: COLORS[idx % COLORS.length], borderRadius: '50%' }}></div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>{entry.courseName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Avg Score: {entry.averageScore.toFixed(1)}</div>
                          </div>
                        </div>
                      ))}
                      {analytics.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No distribution data available.</p>}
                    </div>
                  </div>
                </motion.div>

                {/* Attempt History Card */}
                <motion.div
                  className="user-list-card glass-card"
                  style={{ gridColumn: 'span 3', padding: '40px' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="card-header-mini" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                    <div className="mini-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '12px', color: '#6366f1' }}>
                      <FaHistory />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Attempt Timeline</h3>
                  </div>

                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Subject Module</th>
                          <th>Score Achieved</th>
                          <th style={{ textAlign: 'right' }}>Submission Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scores.map((s, idx) => (
                          <tr key={idx}>
                            <td>{s.course}</td>
                            <td>
                              <span className={`role-badge ${s.score >= 4 ? 'user' : ''}`} style={{ background: s.score >= 4 ? '#ecfdf5' : '#fef2f2', color: s.score >= 4 ? '#10b981' : '#ef4444' }}>
                                {s.score.toFixed(1)}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right', color: '#94a3b8' }}>{new Date(s.date).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {scores.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No attempt history found.</p>}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserAnalyticsView;
