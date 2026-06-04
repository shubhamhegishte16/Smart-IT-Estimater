import ProjectType from "../models/ProjectType.js";

export const createProjectType = async (req, res) => {
    try {
        const projectType = await ProjectType.create(req.body);
        res.status(201).json(projectType);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getProjectType = async (req, res) => {
    try {
        const projectTypes = await ProjectType.find();

        res.json(projectTypes);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const updateProjectType = async (req, res) => {
    try {
        const projectType = await ProjectType.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(projectType);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const deleteProjectType = async (req, res) => {
    try {
        await ProjectType.findByIdAndDelete(req.params.id);

        res.json({
            message: "Project Type Deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};