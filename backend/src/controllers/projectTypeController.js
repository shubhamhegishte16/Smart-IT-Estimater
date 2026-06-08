import ProjectType from "../models/ProjectType.js";

export const getProjectTypes = async (req, res) => {
    try {
        const projectTypes = await ProjectType.find();
        res.status(200).json(projectTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjectTypeById = async (req, res) => {
    try {
        const projectType = await ProjectType.findById(req.params.id);
        if (!projectType) {
            return res.status(404).json({ message: "Project type not found" });
        }
        res.status(200).json(projectType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProjectType = async (req, res) => {
    try {
        const projectType = new ProjectType(req.body);
        await projectType.save();
        res.status(201).json(projectType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProjectType = async (req, res) => {
    try {
        const projectType = await ProjectType.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        if (!projectType) {
            return res.status(404).json({ message: "Project type not found" });
        }
        res.status(200).json(projectType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProjectType = async (req, res) => {
    try {
        const projectType = await ProjectType.findByIdAndDelete(req.params.id);
        if (!projectType) {
            return res.status(404).json({ message: "Project type not found" });
        }
        res.status(200).json({ message: "Project type deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};