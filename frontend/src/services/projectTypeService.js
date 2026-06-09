// services/projectTypeService.js
import { API_BASE_URL } from "./api";

export const getProjectTypes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/project-types`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) throw new Error("Failed to fetch project types");
        
        const data = await response.json();
        return Array.isArray(data) ? data : data.projectTypes || [];
    } catch (error) {
        console.error("Error fetching project types:", error);
        throw error;
    }
};

export const getProjectTypeById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/project-types/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) throw new Error("Failed to fetch project type");
        
        const data = await response.json();
        return data.projectType || data;
    } catch (error) {
        console.error("Error fetching project type:", error);
        throw error;
    }
};

export const createProjectType = async (projectTypeData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/project-types`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(projectTypeData),
        });
        
        if (!response.ok) throw new Error("Failed to create project type");
        
        const data = await response.json();
        return data.projectType || data;
    } catch (error) {
        console.error("Error creating project type:", error);
        throw error;
    }
};

export const updateProjectType = async (id, projectTypeData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/project-types/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(projectTypeData),
        });
        
        if (!response.ok) throw new Error("Failed to update project type");
        
        const data = await response.json();
        return data.projectType || data;
    } catch (error) {
        console.error("Error updating project type:", error);
        throw error;
    }
};

export const deleteProjectType = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/project-types/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) throw new Error("Failed to delete project type");
        
        return await response.json();
    } catch (error) {
        console.error("Error deleting project type:", error);
        throw error;
    }
};
