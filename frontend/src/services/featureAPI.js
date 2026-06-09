// services/featureApi.js
import { API_BASE_URL } from "./api";

export const featureApi = {
  // Get all features
  getAllFeatures: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/features`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add auth token if needed
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch features: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching features:", error);
      throw error;
    }
  },

  // Get single feature by ID
  getFeatureById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/features/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch feature: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching feature:", error);
      throw error;
    }
  },

  // Create new feature
  createFeature: async (featureData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/features`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(featureData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create feature: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error creating feature:", error);
      throw error;
    }
  },

  // Update feature
  updateFeature: async (id, featureData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/features/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(featureData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update feature: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error updating feature:", error);
      throw error;
    }
  },

  // Delete feature
  deleteFeature: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/features/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete feature: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error deleting feature:", error);
      throw error;
    }
  },
};
