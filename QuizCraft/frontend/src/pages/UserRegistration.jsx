import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./UserRegistration.css";
import { toast } from 'react-toastify';

const UserRegistration = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // console.log(Hello);
            await registerUser({ ...formData, role: "user", action: "register" });
            console.log({ ...formData, role: "user", action: "register" });

            toast.success("User Registered Successfully");
            navigate("/Userlogin"); // Redirect after successful registration
        } catch (error) {
            console.error("Registration failed", error);
            toast.error("Registration failed");
        }
    };

    return (
        <div className="user-register-container">
            <div className="user-registration-box">
                <h2>Join Smart Quiz</h2>
                <span className="auth-subtitle">Create your student account to start learning</span>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>
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
                    <button type="submit" className="submit-btn">Create Account</button>
                </form>

                <p className="switch-auth">
                    Already have an account? <Link to="/Userlogin">Sign In</Link>
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

export default UserRegistration;