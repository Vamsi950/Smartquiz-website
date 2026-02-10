import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCog, FaUsers, FaBookOpen, FaChartBar, FaSignOutAlt, FaHome } from 'react-icons/fa';
import './AdminSidebar.css';
import { toast } from 'react-toastify';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        toast.success("Admin signed out successfully");
        navigate('/adminlogin');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-brand">
                    <div className="brand-dot"></div>
                    Admin Panel
                </div>

                <nav className="nav-list">
                    <li className="nav-item">
                        <NavLink to="/AdminDashboard" className={({ isActive }) => isActive ? "navlink active" : "navlink"}>
                            <FaHome className="nav-icon" /> Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/userlist" className={({ isActive }) => isActive ? "navlink active" : "navlink"}>
                            <FaUsers className="nav-icon" /> Manage Users
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/courselist" className={({ isActive }) => isActive ? "navlink active" : "navlink"}>
                            <FaBookOpen className="nav-icon" /> Manage Courses
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? "navlink active" : "navlink"}>
                            <FaChartBar className="nav-icon" /> Analytics
                        </NavLink>
                    </li>
                </nav>
            </div>

            <div className="logout-container">
                <button className="logout-button" onClick={handleSignOut}>
                    <FaSignOutAlt /> Sign Out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
