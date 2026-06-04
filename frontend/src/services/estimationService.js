const API_URL = "http://localhost:5000/api/estimations";

export const getEstimations = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch estimations");
  }

  return response.json();
};