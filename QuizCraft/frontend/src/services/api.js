import axios from 'axios';

// Use a robust base URL that tries local first
const getApiBaseUrl = () => {
    // We'll handle this in the individual export functions or keep it simple here.
    // However, since these are exported functions, it's better to handle it inside them.
    return "http://localhost:5000/api/auth";
};

const API_BASE_URL = getApiBaseUrl();
const PROD_API_BASE_URL = "https://quiz-app-dq18.onrender.com/api/auth";

// User Registration
export const registerUser = async (userData) => {
    try {
        return await axios.post(`${API_BASE_URL}`, userData);
    } catch (err) {
        return await axios.post(`${PROD_API_BASE_URL}`, userData);
    }
};

// User Login
export const loginUser = async (loginData) => {
    try {
        return await axios.post(`${API_BASE_URL}`, loginData);
    } catch (err) {
        return await axios.post(`${PROD_API_BASE_URL}`, loginData);
    }
};

// Admin Registration
export const registerAdmin = async (adminData) => {
    try {
        return await axios.post(`${API_BASE_URL}`, adminData);
    } catch (err) {
        return await axios.post(`${PROD_API_BASE_URL}`, adminData);
    }
};

// Admin Login
export const loginAdmin = async (adminLoginData) => {
    try {
        return await axios.post(`${API_BASE_URL}`, adminLoginData);
    } catch (err) {
        return await axios.post(`${PROD_API_BASE_URL}`, adminLoginData);
    }
};
