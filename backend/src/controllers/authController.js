import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const register = async (req, res) => {
    try {
        const { name, email, password, company, phone, role } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            company,
            phone,
            role: role || "client"
        });
        
        await user.save();
        
        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "7d" }
        );
        
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
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
        console.error("Register error:", error);
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
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
        
        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "7d" }
        );
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
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

// Get current user
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user?.id).select("-password");
        
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