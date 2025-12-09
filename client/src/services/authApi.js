import axios from 'axios';

// IMPORTANT: Replace this with your actual backend URL
const API_URL = 'http://localhost:5000/api/auth'; 

// Function for user login
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        // The server should return { user: {}, token: '...' }
        return response.data; 
    } catch (error) {
        throw error;
    }
};

// Function for user registration
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data; 
    } catch (error) {
        throw error;
    }
};

// You'll need similar functions in chatApi.js for fetching message history via REST.