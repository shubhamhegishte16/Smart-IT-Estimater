const API_URL = "http://localhost:5000/api/project-types";

export const getProjectTypes = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch project types");
  }

  return response.json();
};