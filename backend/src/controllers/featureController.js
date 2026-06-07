import Feature from "../models/Feature.js";

export const createFeature = async (req, res) => {
    try {
        const feature = await Feature.create(req.body);

        res.status(201).json(feature);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getFeatures = async (req, res) => {
    try {
        console.log("GET FEATURES HIT");

        const features = await Feature.find();

        res.json(features);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

export const updateFeature = async (req, res) => {

    const feature = await Feature.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(feature);
};

export const deleteFeature = async (req, res) => {

    await Feature.findByIdAndDelete(
        req.params.id
    );

    res.json({
        message: "Feature Deleted"
    });
};