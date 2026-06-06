const API_URL = "http://localhost:5000/api/features";

export const getFeatures = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch features");
  }

  return response.json();
};

export const createFeature = async (featureData) => {
  const response = await fetch(
    API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(featureData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create feature");
  }

  return response.json();
};

export const updateFeature = async (id, featureData) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(featureData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update feature");
  }

  return response.json();
};

export const deleteFeature = async (id) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete feature");
  }

  return response.json();
};
