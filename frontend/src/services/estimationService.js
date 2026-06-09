// services/estimationService.js
const API_BASE_URL = "http://localhost:5000/api";

export const getEstimations = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/estimations`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) throw new Error("Failed to fetch estimations");
        
        const data = await response.json();
        return data.estimations || data;
    } catch (error) {
        console.error("Error fetching estimations:", error);
        throw error;
    }
};

export const getEstimationById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/estimations/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) throw new Error("Failed to fetch estimation");
        
        const data = await response.json();
        return data.estimation || data;
    } catch (error) {
        console.error("Error fetching estimation:", error);
        throw error;
    }
};

export const createEstimation = async (estimationData) => {
    try {
        const payload = {
            clientName: estimationData.clientName,
            clientEmail: estimationData.clientEmail,
            projectType: estimationData.projectTypeId,
            features: estimationData.featureIds || [],
            totalCost: estimationData.totalCost || 0,
            totalDays: estimationData.totalDays || 0,
            complexity: estimationData.complexity || "Medium",
            recommendedStack: estimationData.recommendedStack || ["React", "Node.js", "MongoDB"],
            status: "draft"
        };
        
        console.log("Sending estimation payload:", payload);
        
        const response = await fetch(`${API_BASE_URL}/estimations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create estimation");
        }
        
        const data = await response.json();
        return data.estimation || data;
    } catch (error) {
        console.error("Error creating estimation:", error);
        throw error;
    }
};

export const updateEstimation = async (id, estimationData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/estimations/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(estimationData),
        });
        
        if (!response.ok) throw new Error("Failed to update estimation");
        
        const data = await response.json();
        return data.estimation || data;
    } catch (error) {
        console.error("Error updating estimation:", error);
        throw error;
    }
};

export const deleteEstimation = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/estimations/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) throw new Error("Failed to delete estimation");
        
        return await response.json();
    } catch (error) {
        console.error("Error deleting estimation:", error);
        throw error;
    }
};

export const generateEstimationReport = async (id, format = "pdf") => {
    try {
        const response = await fetch(`${API_BASE_URL}/estimations/${id}/generate-report`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ format }),
        });
        
        if (!response.ok) throw new Error("Failed to generate report");
        
        return await response.json();
    } catch (error) {
        console.error("Error generating report:", error);
        throw error;
    }
};
export const getEstimationsByClient = async (email) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/estimations/client/${encodeURIComponent(email)}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!response.ok)
            throw new Error("Failed to fetch client estimations");

        const data = await response.json();

        return data.estimations || [];
    } catch (error) {
        console.error("Error fetching client estimations:", error);
        throw error;
    }
};