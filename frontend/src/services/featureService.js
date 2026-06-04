export const getFeatures = async () => {
  const response = await fetch(
    "http://localhost:5000/api/features"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch features");
  }

  return response.json();
};