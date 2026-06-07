import { API_BASE_URL, requestJson } from "./api";

const API_URL = `${API_BASE_URL}/estimations`;

export const getEstimations = async () => {
  return requestJson(API_URL);
};

export const createEstimation = async (estimationData) => {
  return requestJson(API_URL, {
    method: "POST",
    body: JSON.stringify(estimationData),
  });
};

export const deleteEstimation = async (id) => {
  return requestJson(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};
