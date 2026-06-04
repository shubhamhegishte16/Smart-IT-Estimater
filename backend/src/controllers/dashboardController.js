import Feature from "../models/Feature.js";
import ProjectType from "../models/ProjectType.js";

export const getDashboardOverview = async (req, res) => {
    try {

        const totalFeatures =
            await Feature.countDocuments();

        const totalProjectTypes =
            await ProjectType.countDocuments();

        res.status(200).json({
            totalFeatures,
            totalProjectTypes
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};