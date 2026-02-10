import React, { useState, useEffect } from "react"; // Import useState and useEffect
import axios from "axios"; // Import axios
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import Sidebar2 from "../components/Sidebar-2"; // Make sure Sidebar2 is correctly imported
import "./PerformanceAnalytics.css";

const PerformanceAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("Token or UserId missing.");
        setError("Authentication error. Please login again.");
        return;
      }

      let response;
      try {
        response = await axios.get(`http://localhost:5000/api/user/${userId}/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (localErr) {
        console.warn("Local analytics fetch failed, trying production...", localErr);
        response = await axios.get(`https://quiz-app-dq18.onrender.com/api/user/${userId}/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const transformedData = response.data.map((item) => ({
        name: item.courseName || "Unknown",
        score: Number(item.averageScore) || 0,
      }));

      setData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <Sidebar2 />
      <main className="main-content">
        <div className="analytics-page-content">
          <header className="page-header">
            <div className="header-badge">PERFORMANCE</div>
            <h1 className="analytics-title">Analytics Dashboard</h1>
            <p className="analytics-subtitle">Visualize your progress across all course subjects.</p>
          </header>

          <div className="analytics-grid">
            <div className="chart-section">
              <div className="section-header">
                <h3>Average Score Trend</h3>
                <p>Performance based on recent quiz attempts</p>
              </div>

              <div className="chart-container-fixed">
                {loading ? (
                  <div className="chart-status-message">
                    <div className="loader-dots"><span></span><span></span><span></span></div>
                    <p>Fetching your analytics...</p>
                  </div>
                ) : error ? (
                  <div className="chart-status-message error">
                    <p>⚠️ {error}</p>
                    <button onClick={fetchAnalytics} className="retry-btn">Retry Fetch</button>
                  </div>
                ) : !data || data.length === 0 ? (
                  <div className="chart-status-message empty">
                    <p>📈 No activity data found. Take a quiz to see your progress!</p>
                    <Link to="/courses" className="featured-cta" style={{ marginTop: '20px' }}>Start Quiz</Link>
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '16px',
                            border: 'none',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            padding: '12px 16px'
                          }}
                          itemStyle={{ color: '#71717a', fontWeight: 700 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#71717a"
                          strokeWidth={4}
                          fillOpacity={1}
                          fill="url(#colorScore)"
                          dot={{ stroke: "#71717a", strokeWidth: 2, fill: "#ffffff", r: 6 }}
                          activeDot={{ r: 8, stroke: "#71717a", strokeWidth: 2, fill: "#ffffff" }}
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            <div className="analytics-stats-sidebar">
              <div className="stat-pro-card">
                <span className="s-label">Highest Score</span>
                <span className="s-value">{data.length > 0 ? Math.max(...data.map(d => d.score)).toFixed(1) : '0.0'}</span>
              </div>
              <div className="stat-pro-card">
                <span className="s-label">Quizzes Taken</span>
                <span className="s-value">{data.length}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerformanceAnalytics;
