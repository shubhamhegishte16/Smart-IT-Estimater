import { API_BASE_URL, requestJson } from "./api";

const API_URL = `${API_BASE_URL}/settings`;

export const getSettings = async () => {
  return requestJson(API_URL);
};

export const updateSettings = async (settingsData) => {
  return requestJson(API_URL, {
    method: "PUT",
    body: JSON.stringify(settingsData),
  });
};
