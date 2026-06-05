import Estimation from "../models/Estimation.js";
import Feature from "../models/Feature.js";
import ProjectType from "../models/ProjectType.js";

export const createEstimation = async (req, res) => {
    try {
        const {
            clientName,
            clientEmail,
            projectTypeId,
            featureIds
        } = req.body;

        const projectType = await ProjectType.findById(projectTypeId);

        if (!projectType) {
            return res.status(404).json({
                message: "Project Type not found"
            });
        }

        const features = await Feature.find({
            _id: { $in: featureIds }
        });

        let totalCost = projectType.baseCost;
        let totalDays = projectType.baseDays;

        features.forEach(feature => {
            totalCost += feature.cost;
            totalDays += feature.days;
        });

        let complexity = "Low";

        if (totalCost > 50000)
            complexity = "Medium";

        if (totalCost > 100000)
            complexity = "High";

        // Recommended Stack
        let recommendedStack = [];

        switch (projectType.name.toLowerCase()) {
            case "website":
                recommendedStack = [
                    "React",
                    "Node.js",
                    "MongoDB"
                ];
                break;

            case "web application":
                recommendedStack = [
                    "React",
                    "Express.js",
                    "MongoDB"
                ];
                break;

            case "mobile application":
                recommendedStack = [
                    "Flutter",
                    "Node.js",
                    "MongoDB"
                ];
                break;

            case "e-commerce":
                recommendedStack = [
                    "React",
                    "Node.js",
                    "MongoDB",
                    "Razorpay"
                ];
                break;

            default:
                recommendedStack = [
                    "React",
                    "Node.js",
                    "MongoDB"
                ];
        }

        const estimation = await Estimation.create({
            clientName,
            clientEmail,
            projectType: projectTypeId,
            features: featureIds,
            totalCost,
            totalDays,
            complexity,
            recommendedStack
        });

        res.status(201).json(estimation);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getEstimations = async (req, res) => {
    try {
        const estimations = await Estimation.find()
            .populate("projectType")
            .populate("features");

        res.status(200).json(estimations);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getEstimationById = async (req, res) => {
    try {
        const estimation = await Estimation.findById(req.params.id)
            .populate("projectType")
            .populate("features");

        if (!estimation) {
            return res.status(404).json({
                message: "Estimation not found"
            });
        }

        res.status(200).json(estimation);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const deleteEstimation = async (req, res) => {
    try {
        const estimation = await Estimation.findByIdAndDelete(
            req.params.id
        );

        if (!estimation) {
            return res.status(404).json({
                message: "Estimation not found"
            });
        }

        res.status(200).json({
            message: "Estimation deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};