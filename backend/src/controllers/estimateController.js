// controllers/estimateController.js
import Estimation from "../models/Estimation.js";
import Feature from "../models/Feature.js";
import ProjectType from "../models/ProjectType.js";

// Get all estimations
export const getEstimations = async (req, res) => {
    try {
        const estimations = await Estimation.find()
            .populate('projectType')
            .populate('features')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: estimations.length,
            estimations: estimations
        });
    } catch (error) {
        console.error("Get estimations error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get estimations by client email
export const getEstimationsByClient = async (req, res) => {
    try {
        const { email } = req.params;
        const decodedEmail = decodeURIComponent(email);
        
        console.log("Fetching estimations for:", decodedEmail);
        
        const estimations = await Estimation.find({ 
            clientEmail: decodedEmail 
        }).populate('projectType').populate('features').sort({ createdAt: -1 });
        
        console.log(`Found ${estimations.length} estimations`);
        
        res.status(200).json({
            success: true,
            count: estimations.length,
            estimations: estimations
        });
    } catch (error) {
        console.error("Get estimations by client error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get single estimation
export const getEstimationById = async (req, res) => {
    try {
        const estimation = await Estimation.findById(req.params.id)
            .populate('projectType')
            .populate('features');
        
        if (!estimation) {
            return res.status(404).json({ 
                success: false, 
                message: "Estimation not found" 
            });
        }
        
        res.status(200).json({
            success: true,
            estimation: estimation
        });
    } catch (error) {
        console.error("Get estimation by ID error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Create estimation
export const createEstimation = async (req, res) => {
    try {
        console.log("Creating estimation with data:", req.body);
        
        const estimation = new Estimation({
            clientName: req.body.clientName,
            clientEmail: req.body.clientEmail,
            projectType: req.body.projectType,
            features: req.body.features || [],
            totalCost: req.body.totalCost || 0,
            totalDays: req.body.totalDays || 0,
            complexity: req.body.complexity || "Medium",
            recommendedStack: req.body.recommendedStack || [],
            status: req.body.status || "draft"
        });
        
        const savedEstimation = await estimation.save();
        console.log("Estimation saved:", savedEstimation._id);
        
        res.status(201).json({
            success: true,
            message: "Estimation created successfully",
            estimation: savedEstimation
        });
    } catch (error) {
        console.error("Create estimation error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update estimation
export const updateEstimation = async (req, res) => {
    try {
        const estimation = await Estimation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!estimation) {
            return res.status(404).json({ 
                success: false, 
                message: "Estimation not found" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Estimation updated successfully",
            estimation: estimation
        });
    } catch (error) {
        console.error("Update estimation error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Delete estimation
export const deleteEstimation = async (req, res) => {
    try {
        const estimation = await Estimation.findByIdAndDelete(req.params.id);
        
        if (!estimation) {
            return res.status(404).json({ 
                success: false, 
                message: "Estimation not found" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Estimation deleted successfully"
        });
    } catch (error) {
        console.error("Delete estimation error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Generate report for estimation
export const generateEstimationReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { format = "pdf" } = req.body;
        
        const estimation = await Estimation.findById(id)
            .populate('projectType')
            .populate('features');
        
        if (!estimation) {
            return res.status(404).json({ 
                success: false, 
                message: "Estimation not found" 
            });
        }
        
        // Update estimation with report generation info
        estimation.lastReportGenerated = new Date();
        estimation.reportFormat = format;
        await estimation.save();
        
        res.status(200).json({
            success: true,
            message: `Report generated successfully in ${format.toUpperCase()} format`,
            estimationId: estimation._id,
            downloadUrl: `/api/downloads/estimate/${estimation._id}/report.${format}`,
            generatedAt: new Date()
        });
        
    } catch (error) {
        console.error("Generate report error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};