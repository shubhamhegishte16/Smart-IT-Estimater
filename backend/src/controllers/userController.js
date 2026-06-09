import User from "../models/User.js";

// Get user settings
export const getUserSettings = async (req, res) => {
    try {
        const { email } = req.params;
        const decodedEmail = decodeURIComponent(email);
        
        console.log("Fetching settings for:", decodedEmail);
        
        const user = await User.findOne({ email: decodedEmail });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        // Return settings
        res.status(200).json({ 
            success: true, 
            settings: {
                personal: {
                    fullName: user.name || "",
                    company: user.company || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    website: user.website || "",
                    industry: user.industry || "",
                    address: user.address || "",
                },
                notifications: {
                    email: true,
                    sms: false,
                    approvals: true,
                    messages: true,
                    productUpdates: true,
                    marketing: false
                },
                regional: {
                    currency: "USD",
                    timezone: "UTC +5:30",
                    language: "English",
                    dateFormat: "DD/MM/YYYY"
                },
                preferences: {
                    defaultProjectType: "",
                    defaultTechStack: "",
                    autoSave: true,
                    autoGeneratePDF: false
                },
                twoFactor: false
            }
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
        
        console.log("Saving settings for:", decodedEmail);
        console.log("Data:", { personal, notifications, regional, preferences, twoFactor });
        
        const user = await User.findOne({ email: decodedEmail });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        // Update user fields
        if (personal) {
            if (personal.fullName) user.name = personal.fullName;
            if (personal.company) user.company = personal.company;
            if (personal.phone) user.phone = personal.phone;
            if (personal.website) user.website = personal.website;
            if (personal.industry) user.industry = personal.industry;
            if (personal.address) user.address = personal.address;
        }
        
        await user.save();
        
        res.status(200).json({ 
            success: true, 
            message: "Settings saved successfully" 
        });
    } catch (error) {
        console.error("Update user settings error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const decodedEmail = decodeURIComponent(email);
        
        const user = await User.findOne({ email: decodedEmail }).select("-password");
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
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
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const decodedEmail = decodeURIComponent(email);
        const updates = req.body;
        
        delete updates.password;
        delete updates.email;
        delete updates.role;
        
        const user = await User.findOneAndUpdate(
            { email: decodedEmail },
            { $set: updates },
            { new: true }
        ).select("-password");
        
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        user.password = newPassword;
        await user.save();
        
        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all users (admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete user (admin)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};