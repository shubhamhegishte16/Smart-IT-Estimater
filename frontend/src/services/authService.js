import { API_BASE_URL, requestJson } from "./api";

const API_URL = `${API_BASE_URL}/auth`;

export const loginUser = async (email, password) => {
  return requestJson(`${API_URL}/login`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const registerUser = async (
  name,
  email,
  password,
  role
) => {
  return requestJson(`${API_URL}/register`, {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      role,
    }),
  });
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
