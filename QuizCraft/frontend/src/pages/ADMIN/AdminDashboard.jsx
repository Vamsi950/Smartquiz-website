import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';
import { motion } from 'framer-motion';
import { FaUsers, FaBookOpen, FaChartBar, FaGraduationCap, FaChartLine, FaCogs } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

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
            <div className="header-badge">ADMIN CONTROL CENTER</div>
            <h1>System <span className="highlight-text">Overview</span></h1>
            <p className="admin-subtitle">Your administrative command hub for platform orchestration.</p>
          </motion.div>
        </header>

        <div className="admin-pro-grid">
          {/* Featured Admin Card */}
          <motion.div
            className="admin-featured-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="featured-content">
              <span className="featured-label">ECOSYSTEM STATUS</span>
              <h2>Platform Management <span>& Moderation</span></h2>
              <p>Monitor real-time participation, manage educational content, and oversee user activity with precision tools.</p>

              <div className="featured-stats">
                <div className="f-stat">
                  <div className="val">1,280</div>
                  <div className="lab">Active Users</div>
                </div>
                <div className="f-stat">
                  <div className="val">14</div>
                  <div className="lab">Courses</div>
                </div>
                <div className="f-stat">
                  <div className="val">4.5k</div>
                  <div className="lab">Quiz Attempts</div>
                </div>
              </div>

              <Link to="/courselist" className="featured-cta" style={{ background: '#3f3f46', color: 'white', padding: '16px 32px', borderRadius: '12px', fontWeight: '800', textDecoration: 'none', width: 'fit-content' }}>
                Manage Content
              </Link>
            </div>
          </motion.div>

          {/* Admin Action Bento Grid */}
          <div className="admin-bento-grid">
            <Link to="/userlist" className="bento-card">
              <div className="card-icon"><FaUsers /></div>
              <div className="card-info">
                <h3>User Management</h3>
                <p>Monitor, moderate, and manage student accounts and lifecycles.</p>
              </div>
              <div className="card-arrow">→</div>
            </Link>

            <Link to="/courselist" className="bento-card">
              <div className="card-icon"><FaGraduationCap /></div>
              <div className="card-info">
                <h3>Course Editor</h3>
                <p>Curate quizzes, structure topics, and expand the learning library.</p>
              </div>
              <div className="card-arrow">→</div>
            </Link>

            <Link to="/admin/analytics" className="bento-card">
              <div className="card-icon"><FaChartBar /></div>
              <div className="card-info">
                <h3>Global Analytics</h3>
                <p>Deep-dive into system-wide performance and engagement metrics.</p>
              </div>
              <div className="card-arrow">→</div>
            </Link>

            <div className="bento-card wide">
              <div className="card-icon"><FaCogs /></div>
              <div className="card-info">
                <h3>System Settings</h3>
                <p>Configure platform-wide parameters, security thresholds, and automated operations.</p>
              </div>
              <div className="card-arrow" style={{ opacity: 0.3 }}>⚙️</div>
            </div>

            <div className="bento-card">
              <div className="card-icon"><FaChartLine /></div>
              <div className="card-info">
                <h3>Growth Trends</h3>
                <p>Visualize user acquisition and quiz participation velocity.</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
