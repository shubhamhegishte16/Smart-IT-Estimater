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

        const projectType =
            await ProjectType.findById(projectTypeId);

        const features =
            await Feature.find({
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

        const estimation =
            await Estimation.create({
                clientName,
                clientEmail,
                projectType: projectTypeId,
                features: featureIds,
                totalCost,
                totalDays,
                complexity
            });

        res.status(201).json(estimation);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

export const getEstimations = async (req, res) => {

    const estimations =
        await Estimation.find()
            .populate("projectType")
            .populate("features");

    res.json(estimations);
};

