// controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Register new user
export const register = async (req, res) => {
    try {
        const { name, email, password, company, phone, role } = req.body;
        
        console.log("Registration attempt for:", email);
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists with this email" 
            });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            company: company || "",
            phone: phone || "",
            role: role || "client"
        });
        
        await user.save();
        
        console.log("User registered successfully:", email);
        
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                company: user.company,
                phone: user.phone,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log("Login attempt for:", email);
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }
        
        console.log("Login successful for:", email);
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                company: user.company,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt
            }
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get current user (for session validation)
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get me error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};