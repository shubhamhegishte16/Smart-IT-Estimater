import Feature from "../models/Feature.js";
import ProjectType from "../models/ProjectType.js";
import Estimation from "../models/Estimation.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Admin dashboard - Already exists
export const getDashboardOverview = async (req, res) => {
    try {
        const totalFeatures = await Feature.countDocuments();
        const totalProjectTypes = await ProjectType.countDocuments();
        const totalEstimations = await Estimation.countDocuments();
        const clients = await Estimation.distinct("clientEmail");
        const totalClients = clients.length;

        res.status(200).json({
            totalFeatures,
            totalProjectTypes,
            totalEstimations,
            totalClients
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Client dashboard - ADD THIS IF MISSING
export const getClientDashboard = async (req, res) => {
    try {
        const { clientId } = req.params;
        
        console.log("Searching for client:", clientId);
        
        // Decode email if it's URL encoded
        const decodedClientId = decodeURIComponent(clientId);
        
        // Find user by email (since you're passing email)
        const client = await User.findOne({ 
            email: decodedClientId 
        });
        
        if (!client) {
            return res.status(404).json({ 
                success: false,
                message: `Client not found with email: ${decodedClientId}`
            });
        }
        
        console.log("Found client:", client.email);
        
        // Get estimations for this client
        const estimations = await Estimation.find({ 
            clientEmail: client.email 
        }).populate('projectType', 'name').populate('features', 'name');
        
        console.log(`Found ${estimations.length} estimations`);
        
        // Calculate metrics
        const activeEstimates = estimations.length;
        const approvedProjects = estimations.filter(e => e.status === "approved").length;
        const totalDays = estimations.reduce((sum, est) => sum + (est.totalDays || 0), 0);
        const averageTimeline = estimations.length > 0 ? Math.round(totalDays / estimations.length) : 0;
        const totalBudget = estimations.reduce((sum, est) => sum + (est.totalCost || 0), 0);
        
        // Transform to frontend format
        const activeProjects = estimations.map(est => ({
            name: est.clientName || "Project",
            type: est.projectType?.name || "General",
            stage: est.complexity || "In Progress",
            due: est.totalDays ? `${est.totalDays} days` : "TBD",
            progress: 0
        }));
        
        // Next actions
        const nextActions = estimations.length === 0 ? [
            "🚀 Create your first estimate to get started",
            "📋 Browse available features", 
            "💬 Contact support for assistance"
        ] : [
            `📊 Review ${estimations.length} active estimate(s)`,
            "✨ Submit new project requirements",
            "📞 Schedule a consultation call"
        ];
        
        // Recent activity
        const activity = estimations.slice(0, 5).map(est => ({
            time: getTimeAgo(est.createdAt),
            text: `Created estimate for "${est.clientName || 'project'}" - ${est.complexity || 'Standard'} complexity`
        }));
        
        if (activity.length === 0) {
            activity.push({
                time: "Just now",
                text: "Welcome to your dashboard! Create your first estimate to see activity here."
            });
        }
        
        res.status(200).json({
            success: true,
            metrics: {
                activeEstimates,
                approvedProjects,
                averageTimeline: averageTimeline > 0 ? `${averageTimeline} days` : "N/A",
                estimatedBudget: `₹${totalBudget.toLocaleString()}`
            },
            activeProjects,
            nextActions,
            activity
        });
        
    } catch (error) {
        console.error("Client dashboard error:", error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Helper function
function getTimeAgo(date) {
    if (!date) return "Recently";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
}