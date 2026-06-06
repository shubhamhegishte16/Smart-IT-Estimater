import axios from "axios";

const API_URL = "http://localhost:5000/api/features";

// GET all features
export const getFeatures = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// CREATE feature
export const createFeature = async (featureData) => {
  const response = await axios.post(API_URL, featureData);
  return response.data;
};

// UPDATE feature
export const updateFeature = async (id, featureData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    featureData
  );
  return response.data;
};

// DELETE feature
export const deleteFeature = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`
  );
  return response.data;
};