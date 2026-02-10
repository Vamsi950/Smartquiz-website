import React, { useEffect, useState } from 'react';
import "./UserList.css";
import "./AdminDashboard.css";
import AdminSidebar from '../../components/AdminSidebar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsUser, setAnalyticsUser] = useState(null);
  const COLORS = ['#3f3f46', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8'];

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      // Using direct role check if available, otherwise defaulting to local storage user object
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const role = localStorage.getItem('role') || user.role;

      if (role !== 'admin') {
        setError('Access denied. Only admin users can view this page.');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (localErr) {
        console.error('Local fetch failed, trying production...', localErr);
        try {
          const response = await fetch('https://quiz-app-dq18.onrender.com/api/admin/users', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);
          const data = await response.json();
          setUsers(data.users);
        } catch (prodErr) {
          setError(`Failed to load users: ${prodErr.message}`);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Failed to load users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      let response = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Try production if local fails or isn't running
        response = await fetch(`https://quiz-app-dq18.onrender.com/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.ok) {
        setUsers(prev => prev.filter(user => user._id !== id));
        toast.success('User deleted successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user. Please try again.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
            <div className="header-badge">DATABASE MANAGEMENT</div>
            <h1>Registered <span className="highlight-text">Users</span></h1>
            <p className="admin-subtitle">Maintain the integrity of your community and manage scholar accounts.</p>
          </motion.div>
        </header>

        <div className="admin-pro-grid">
          {loading ? (
            <div className="admin-featured-card" style={{ padding: '60px', textAlign: 'center' }}>
              <div className="admin-subtitle">Loading user database...</div>
            </div>
          ) : error ? (
            <div className="admin-featured-card" style={{ padding: '60px', textAlign: 'center' }}>
              <div className="admin-subtitle" style={{ color: '#e11d48' }}>{error}</div>
              <button onClick={fetchUsers} className="featured-cta" style={{ marginTop: '20px', background: '#3f3f46', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Retry</button>
            </div>
          ) : (
            <motion.div
              className="user-list-card glass-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Registration Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td style={{ color: '#64748b' }}>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td style={{ color: '#94a3b8' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn-delete" onClick={() => handleDelete(user._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    No users found in the database.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserList;
