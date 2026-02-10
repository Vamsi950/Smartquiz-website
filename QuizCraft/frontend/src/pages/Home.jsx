import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket, FaGlobe, FaCertificate, FaShieldAlt, FaChartBar, FaBrain } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-professional-container">
      {/* Professional Sticky Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-icon"><FaRocket /></span>
          <span className="logo-text">SMART QUIZ</span>
        </div>
        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/Userlogin" className="nav-login-btn">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section - Dual Column */}
      <header className="hero-section">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-badge">MASTER YOUR ENGINEERING PATH</div>
            <h1 className="hero-title">
              Precision Learning for <span>GATE & Placements</span>
            </h1>
            <p className="hero-description">
              Elevate your technical skills with high-precision quizzes, real-time analytics,
              and AI-driven insights. Designed for the engineers of tomorrow.
            </p>
            <div className="hero-cta-group">
              <Link to="/Userlogin" className="btn-primary">Start Practicing Free</Link>
              <Link to="/Adminlogin" className="btn-secondary">Admin Portal</Link>
            </div>

            {/* Quick Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">50k+</span>
                <span className="stat-label">Quizzes Taken</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">99%</span>
                <span className="stat-label">Accuracy Rate</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="hero-visual">
          <motion.div
            className="abstract-shape-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="shape-blob blob-1"></div>
            <div className="shape-blob blob-2"></div>
            <div className="hero-card-preview">
              <div className="preview-header">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="preview-body">
                <FaChartBar className="preview-icon" />
                <div className="preview-line long"></div>
                <div className="preview-line short"></div>
                <div className="preview-line medium"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features/Benefits Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Everything you need to <span>Excel</span></h2>
          <p>World-class preparation tools built directly into your browser.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card-pro">
            <div className="f-icon-box"><FaBrain /></div>
            <h3>Subject Mastery</h3>
            <p>Topic-wise assessments covering the entire GATE and Placement syllabus.</p>
          </div>

          <div className="feature-card-pro">
            <div className="f-icon-box"><FaGlobe /></div>
            <h3>Global Ranking</h3>
            <p>See where you stand against thousands of aspirants worldwide.</p>
          </div>

          <div className="feature-card-pro">
            <div className="f-icon-box"><FaCertificate /></div>
            <h3>Verified Results</h3>
            <p>Earn certificates of excellence upon completing core assessments.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-lite">
        <p>&copy; 2026 Smart Quiz Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
