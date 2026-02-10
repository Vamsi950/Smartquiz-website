import React, { useState } from "react";
import { registerUser } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./AdminRegistration.css";
import { toast } from 'react-toastify';

const AdminRegistration = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ ...formData, action: "register", role: "admin" });
      toast.success("Admin Registered Successfully");

      // Redirect to admin login page
      navigate("/AdminLogin");

    } catch (error) {
      const backendMessage = error.response?.data?.message || "Registration failed";
      console.error("Registration failed:", backendMessage);
      toast.error(backendMessage);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-box">
        <h2>Admin Registration</h2>
        <span className="auth-subtitle">Create a management account</span>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Admin User"
              required
            />
          </div>

          <div className="input-group">
            <label>Company Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@company.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="submit-btn">Register Portal</button>
        </form>

        <p className="switch-auth">
          Already have an account? <Link to="/AdminLogin">Sign In</Link>
        </p>

        <div>
          <Link to="/" className="back-link">
            ← Back to Professional Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;
