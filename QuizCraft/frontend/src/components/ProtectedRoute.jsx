import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = ['user', 'admin'] }) => {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;
  const token = localStorage.getItem('token');

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(userRole)) {
    // Redirect based on role
    if (userRole === 'admin') {
      return <Navigate to="/AdminDashboard" replace />;
    } else if (userRole === 'user') {
      return <Navigate to="/UserDashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 