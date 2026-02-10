import React, { useState } from "react";
import { loginUser } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Adminlogin.css";
import { toast } from 'react-toastify';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({
                ...formData,
                action: "login"
                // 👇 removed role: "admin" to allow any role to log in
            });

            const { token, user } = response.data;

            // ❌ No role check here — allow both user & admin
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("userId", user.id);
            localStorage.setItem("username", user.name);

            toast.success("Admin Logged In Successfully");

            // Redirect based on user role
            if (user.role === 'admin') {
                navigate("/admindashboard");
            } else {
                navigate("/userdashboard");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Login failed";
            toast.error(msg);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2>Admin Login</h2>
                <span className="auth-subtitle">Access the management portal</span>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Admin Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@smartquiz.com"
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
                    <button type="submit" className="submit-btn">Login to Portal</button>
                </form>
                <p className="switch-auth">
                    Don't have an account? <Link to="/AdminRegistration">Register</Link>
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

export default AdminLogin;
