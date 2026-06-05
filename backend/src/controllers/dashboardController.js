import Feature from "../models/Feature.js";
import ProjectType from "../models/ProjectType.js";
import Estimation from "../models/Estimation.js";

export const getDashboardOverview = async (req, res) => {
    try {

        const totalFeatures =
            await Feature.countDocuments();

        const totalProjectTypes =
            await ProjectType.countDocuments();

        const totalEstimations =
            await Estimation.countDocuments();

        const clients =
            await Estimation.distinct("clientEmail");

        const totalClients = clients.length;

        res.status(200).json({
            totalFeatures,
            totalProjectTypes,
            totalEstimations,
            totalClients
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};