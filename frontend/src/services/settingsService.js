// services/settingsService.js
import { API_BASE_URL } from "./api";

export const getSettings = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) throw new Error("Failed to fetch settings");
        
        const data = await response.json();
        return data.settings || data;
    } catch (error) {
        console.error("Error fetching settings:", error);
        throw error;
    }
};

export const updateSettings = async (settingsData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settingsData),
        });
        
        if (!response.ok) throw new Error("Failed to update settings");
        
        const data = await response.json();
        return data.settings || data;
    } catch (error) {
        console.error("Error updating settings:", error);
        throw error;
    }
};

export const updateCompanyInfo = async (companyData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/company`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(companyData),
        });
        
        if (!response.ok) throw new Error("Failed to update company info");
        
        const data = await response.json();
        return data.settings || data;
    } catch (error) {
        console.error("Error updating company info:", error);
        throw error;
    }
};

export const updateEstimationRules = async (rulesData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/settings/estimation-rules`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rulesData),
        });
        
        if (!response.ok) throw new Error("Failed to update estimation rules");
        
        const data = await response.json();
        return data.settings || data;
    } catch (error) {
        console.error("Error updating estimation rules:", error);
        throw error;
    }
};
