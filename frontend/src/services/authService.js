// services/authService.js
import { API_BASE_URL } from "./api";

export const registerUser = async (name, email, password, role, company, phone) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name, 
                email, 
                password, 
                role,
                company: company || "",
                phone: phone || ""
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }
        
        return data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }
        
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};
