import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get user profile by email
export const getUserProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const decodedEmail = decodeURIComponent(email);
        
        const user = await User.findOne({ email: decodedEmail }).select("-password");
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            user: {
                name: user.name,
                email: user.email,
                company: user.company,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Get user profile error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const decodedEmail = decodeURIComponent(email);
        const updates = req.body;
        
        // Remove sensitive fields that shouldn't be updated here
        delete updates.password;
        delete updates.email;
        delete updates.role;
        
        const user = await User.findOneAndUpdate(
            { email: decodedEmail },
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("Update user profile error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get user settings
export const getUserSettings = async (req, res) => {
    try {
        const { email } = req.params;
        const decodedEmail = decodeURIComponent(email);
        
        const user = await User.findOne({ email: decodedEmail }).select("-password");
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        const settings = {
            personal: {
                fullName: user.name || "",
                company: user.company || "",
                email: user.email || "",
                phone: user.phone || "",
                website: user.website || "",
                industry: user.industry || "",
                address: user.address || "",
            },
            notifications: user.notifications || {
                email: true,
                sms: false,
                approvals: true,
                messages: true,
                productUpdates: true,
                marketing: false
            },
            regional: user.regional || {
                currency: "USD",
                timezone: "UTC +5:30",
                language: "English",
                dateFormat: "DD/MM/YYYY"
            },
            preferences: user.preferences || {
                defaultProjectType: "",
                defaultTechStack: "",
                autoSave: true,
                autoGeneratePDF: false
            },
            twoFactor: user.twoFactor || false
        };
        
        res.status(200).json({ 
            success: true, 
            settings 
        });
    } catch (error) {
        console.error("Get user settings error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update user settings
export const updateUserSettings = async (req, res) => {
    try {
        const { email } = req.params;
        const decodedEmail = decodeURIComponent(email);
        const { personal, notifications, regional, preferences, twoFactor } = req.body;
        
        const updateData = {};
        
        if (personal) {
            if (personal.fullName !== undefined) updateData.name = personal.fullName;
            if (personal.company !== undefined) updateData.company = personal.company;
            if (personal.phone !== undefined) updateData.phone = personal.phone;
            if (personal.website !== undefined) updateData.website = personal.website;
            if (personal.industry !== undefined) updateData.industry = personal.industry;
            if (personal.address !== undefined) updateData.address = personal.address;
        }
        
        if (notifications) updateData.notifications = notifications;
        if (regional) updateData.regional = regional;
        if (preferences) updateData.preferences = preferences;
        if (twoFactor !== undefined) updateData.twoFactor = twoFactor;
        
        const user = await User.findOneAndUpdate(
            { email: decodedEmail },
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Settings updated successfully" 
        });
    } catch (error) {
        console.error("Update user settings error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        // Validate password length
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: "Password must be at least 6 characters" 
            });
        }
        
        // In production, verify current password with bcrypt
        // For now, just update
        user.password = newPassword;
        await user.save();
        
        res.status(200).json({ 
            success: true, 
            message: "Password changed successfully" 
        });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        
        res.status(200).json({ 
            success: true, 
            count: users.length,
            users 
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "User deleted successfully" 
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};