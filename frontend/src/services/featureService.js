import { API_BASE_URL, requestJson } from "./api";

const API_URL = `${API_BASE_URL}/features`;

export const getFeatures = async () => {
  return requestJson(API_URL);
};

export const createFeature = async (featureData) => {
  return requestJson(API_URL, {
    method: "POST",
    body: JSON.stringify(featureData),
  });
};

export const updateFeature = async (id, featureData) => {
  return requestJson(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(featureData),
  });
};

export const deleteFeature = async (id) => {
  return requestJson(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};
