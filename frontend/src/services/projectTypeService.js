import { API_BASE_URL, requestJson } from "./api";

const API_URL = `${API_BASE_URL}/project-types`;

export const getProjectTypes = async () => {
  return requestJson(API_URL);
};

export const createProjectType = async (projectTypeData) => {
  return requestJson(API_URL, {
    method: "POST",
    body: JSON.stringify(projectTypeData),
  });
};

export const updateProjectType = async (id, projectTypeData) => {
  return requestJson(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(projectTypeData),
  });
};

export const deleteProjectType = async (id) => {
  return requestJson(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};
