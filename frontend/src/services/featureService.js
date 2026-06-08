// services/featureService.js
const API_BASE_URL = "http://localhost:5000/api";

export const getFeatures = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/features`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) throw new Error("Failed to fetch features");
        
        const data = await response.json();
        // Handle both array and object responses
        return Array.isArray(data) ? data : data.features || [];
    } catch (error) {
        console.error("Error fetching features:", error);
        throw error;
    }
};

export const getFeatureById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/features/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) throw new Error("Failed to fetch feature");
        
        const data = await response.json();
        return data.feature || data;
    } catch (error) {
        console.error("Error fetching feature:", error);
        throw error;
    }
};

export const createFeature = async (featureData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/features`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(featureData),
        });
        
        if (!response.ok) throw new Error("Failed to create feature");
        
        const data = await response.json();
        return data.feature || data;
    } catch (error) {
        console.error("Error creating feature:", error);
        throw error;
    }
};

export const updateFeature = async (id, featureData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/features/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(featureData),
        });
        
        if (!response.ok) throw new Error("Failed to update feature");
        
        const data = await response.json();
        return data.feature || data;
    } catch (error) {
        console.error("Error updating feature:", error);
        throw error;
    }
};

export const deleteFeature = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/features/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) throw new Error("Failed to delete feature");
        
        return await response.json();
    } catch (error) {
        console.error("Error deleting feature:", error);
        throw error;
    }
};