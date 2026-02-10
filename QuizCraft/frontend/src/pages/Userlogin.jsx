import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import "./Userlogin.css";
import { toast } from 'react-toastify';

const UserLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ ...formData, action: "login", role: "user" });
      console.log(response.data);
      //    // Store token and user in localStorage
      const { token, user } = response.data;

      if (token && user) {

        //    console.log("Token:", localStorage.getItem("token"));

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user.id);
        localStorage.setItem("username", user.name);

        toast.success("User Logged In Successfully");

        // Redirect based on user role
        if (user.role === 'admin') {
          navigate("/AdminDashboard");
        } else {
          navigate("/UserDashboard");
        }
      } else {
        toast.error("Login failed: Invalid response from server");
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Invalid email or password");
    }
  };


  return (
    <div className="user-login-container">
      <div className="user-login-box">
        <h2>Welcome Back</h2>
        <span className="auth-subtitle">Login to your student account</span>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
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
          <button type="submit" className="submitbtn">Login to Dashboard</button>
        </form>

        <p className="switchauth">
          New to Smart Quiz? <Link to="/UserRegistration">Create an account</Link>
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

export default UserLogin;
