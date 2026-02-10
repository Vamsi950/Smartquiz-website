import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCog, FaUsers, FaBookOpen, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'; // 🎯 Added Icons
import './Sidebar.css';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    // Add your logout logic here (like clearing localStorage or cookies)
    toast.success("Admin signed out successfully");
    navigate('/adminlogin');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.top-navbar') && !event.target.closest('.mobile-menu-toggle')) {
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

      <div className={`top-navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="navbar-left">
          <span className="logo">
            <Link to="/AdminDashboard" className="user-link" onClick={() => setIsMobileMenuOpen(false)}>
              <FaUserCog style={{ marginRight: '8px' }} /> Admin Panel
            </Link>
          </span>
        </div>

        <div className="navbar-right">
          {/* <Link to="/UserList" className="user-link" onClick={() => setIsMobileMenuOpen(false)}>
            <FaUsers style={{ marginRight: '6px' }} /> User List
          </Link> */}
          <Link to="/CourseList" className="course-link" onClick={() => setIsMobileMenuOpen(false)}>
            <FaBookOpen style={{ marginRight: '6px' }} /> Course List
          </Link>
          <button className="signout-btn" onClick={handleSignOut}>
            <FaSignOutAlt style={{ marginRight: '8px' }} /> Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
