import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaTrophy, FaCertificate, FaChartBar, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Sidebar-2.css';
import { toast } from 'react-toastify';

const Sidebar2 = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    toast.success("User logged out successfully");
    localStorage.clear();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.sidebar') && !event.target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-dot"></span>
          SMART QUIZ
        </div>

        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/userdashboard" className={({ isActive }) => isActive ? "navlink active" : "navlink"} onClick={() => setIsMobileMenuOpen(false)}>
              <FaHome className="nav-icon" /> Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/courses" className={({ isActive }) => isActive ? "navlink active" : "navlink"} onClick={() => setIsMobileMenuOpen(false)}>
              <FaBook className="nav-icon" /> Courses
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/leaderboard" className={({ isActive }) => isActive ? "navlink active" : "navlink"} onClick={() => setIsMobileMenuOpen(false)}>
              <FaTrophy className="nav-icon" /> Leaderboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/certificate" className={({ isActive }) => isActive ? "navlink active" : "navlink"} onClick={() => setIsMobileMenuOpen(false)}>
              <FaCertificate className="nav-icon" /> Certificate
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/analytics" className={({ isActive }) => isActive ? "navlink active" : "navlink"} onClick={() => setIsMobileMenuOpen(false)}>
              <FaChartBar className="nav-icon" /> Analytics
            </NavLink>
          </li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="nav-icon" /> Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar2;
