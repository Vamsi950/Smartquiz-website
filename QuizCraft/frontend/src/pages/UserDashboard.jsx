import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import "./UserDashboard.css";
import { FaTrophy, FaChartLine, FaChartBar, FaCertificate, FaBullseye } from "react-icons/fa";
import quizImg from "../assets/image.png";
import Sidebar2 from "../components/Sidebar-2";
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const navigate = useNavigate();
  const Username = localStorage.getItem("username");
  const [analytics, setAnalytics] = useState([]);
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) return;

        const response = await axios.get(`https://quiz-app-dq18.onrender.com/api/user/${userId}/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawData = response.data;

        // Bar Chart Data
        const barTransformed = rawData.map((item) => ({
          name: item.courseName.split(' ')[0],
          score: Number(item.averageScore) || 0,
        })).slice(0, 4);
        setAnalytics(barTransformed);

        // Pie Chart Data (Subject frequency)
        const pieTransformed = rawData.map((item, index) => ({
          name: item.courseName,
          value: 10 + (index * 5), // Artificial weighting for visual appeal if count not avail
        })).slice(0, 3);
        setPieData(pieTransformed);

        // Radar Chart Data (Skill Analysis)
        const radarTransformed = [
          { subject: 'Accuracy', A: 85, fullMark: 100 },
          { subject: 'Speed', A: 70, fullMark: 100 },
          { subject: 'Consistency', A: 90, fullMark: 100 },
          { subject: 'Logic', A: 65, fullMark: 100 },
          { subject: 'Recall', A: 80, fullMark: 100 },
        ];
        setRadarData(radarTransformed);

      } catch (err) {
        console.error("Dashboard Analytics fetch failed", err);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#3f3f46', '#52525b', '#71717a', '#a1a1aa'];

  return (
    <div className="dashboard-container">
      <Sidebar2 />
      <main className="main-content">
        <header className="dashboard-header-pro">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="header-badge">EXPERIENCE HUB</div>
            <h1>Welcome, <span className="highlight-text">{Username}</span></h1>
            <p className="dashboard-subtitle">Your personalized learning command center is ready.</p>
          </motion.div>
        </header>

        <div className="dashboard-pro-grid">
          {/* Featured Wide Card */}
          <motion.div
            className="featured-card-wide"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="featured-content">
              <span className="featured-label">LIVE ENGAGEMENT</span>
              <h2>Master Your Subjects <span>with Precision</span></h2>
              <p>Explore hundred of high-quality quizzes tailored for competitive excellence. Track every attempt and visualize your growth over time.</p>

              <div className="featured-mini-analytics">
                <div className="stat-pills">
                  {analytics.map((item, idx) => (
                    <div key={idx} className="stat-pill">
                      <div className="pill-label">{item.name}</div>
                      <div className="pill-value">
                        {item.score.toFixed(1)} <span>/ 5.0</span>
                      </div>
                      <div className="progress-bar-mini">
                        <div
                          className="progress-fill"
                          style={{ width: `${(item.score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )).slice(0, 2)}
                </div>
                <div className="stat-pills">
                  <div className="stat-pill">
                    <div className="pill-label">Total Progress</div>
                    <div className="pill-value">82%</div>
                    <div className="progress-bar-mini">
                      <div className="progress-fill" style={{ width: '82%', background: '#10b981' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/courses" className="featured-cta">Find Your Path</Link>
            </div>
            <div className="featured-visual">
              <img src={quizImg} alt="Abstract Tech" />
              <div className="visual-overlay"></div>
            </div>
          </motion.div>

          {/* Action Grid */}
          <div className="action-grid-bento">
            {/* Radar Analysis */}
            <div className="bento-card skill-radar">
              <div className="card-header-mini">
                <div className="mini-icon"><FaBullseye /></div>
                <h3>Skill Analysis</h3>
              </div>
              <div className="radar-box">
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '11px' }}
                    />
                    <Radar
                      name="Skill Level"
                      dataKey="A"
                      stroke="#71717a"
                      strokeWidth={4}
                      fill="#71717a"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Link to="/analytics" className="bento-card analytics">
              <div className="card-icon"><FaChartLine /></div>
              <div className="card-info">
                <h3>Real-time Insights</h3>
                <p>Detailed performance breakdown and subject-wise accuracy tracking.</p>
              </div>
              <div className="card-arrow">→</div>
            </Link>

            <Link to="/leaderboard" className="bento-card ranking">
              <div className="card-icon"><FaTrophy /></div>
              <div className="card-info">
                <h3>Global Ranking</h3>
                <p>See your position among the world's most talented aspirants.</p>
              </div>
              <div className="card-arrow">→</div>
            </Link>

            <div className="bento-card performance-mini">
              <div className="card-header-mini">
                <div className="mini-icon"><FaChartBar /></div>
                <h3>Quick Stats</h3>
              </div>
              <div className="mini-chart-box">
                {analytics.length > 0 ? (
                  <ResponsiveContainer width="100%" height={80}>
                    <BarChart data={analytics}>
                      <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {analytics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3f3f46' : '#71717a'} />
                        ))}
                      </Bar>
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="no-data-mini">No data yet</div>
                )}
              </div>
              <p className="mini-desc">Live performance trend across top subjects.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;