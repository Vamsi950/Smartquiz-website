const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authUser = async (req, res) => {
    const { name, email, password, role, action } = req.body;

    try {
        if (!email || !password || (action === "register" && !name)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (action === "register") {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: "User already exists" });

            // Validate role
            const validRoles = ["user", "admin"];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: "Invalid role" });
            }

            // Hash password and create user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashedPassword, role });

            // Generate JWT Token
            const token = jwt.sign(
                { id: newUser._id, role: newUser.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(201).json({ 
                message: "User registered successfully", 
                token,
                user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
            });
        } 
        
        if (action === "login") {
            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: "Invalid credentials" });

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

            // Generate JWT Token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({ 
                message: "Login successful", 
                token, 
                user: { id: user._id, name: user.name, email: user.email, role: user.role } 
            });
        }

        return res.status(400).json({ message: "Invalid action" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { authUser };
