import { API_BASE_URL, requestJson } from "./api";

const API_URL = `${API_BASE_URL}/dashboard/overview`;

export const getDashboardOverview = async () => {
  return requestJson(API_URL);
};
