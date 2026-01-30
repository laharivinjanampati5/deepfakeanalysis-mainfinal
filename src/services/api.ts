
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with auth header support
const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    login: async (userData: any) => {
        const response = await api.post('/auth/login', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user') || 'null');
    }
};

export const analysisService = {
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        // Check if we are logged in, if not, maybe anonymous upload?
        // For now, assume protected routes need login, so frontend should handle "Guest" login or similar.
        // Or we make the backend route optional auth.
        // Let's assume the user must be logged in. 
        // If we want a demo mode, we can auto-login a guest user.

        const response = await api.post('/analyze/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    getResult: async (id: string) => {
        const response = await api.get(`/analyze/${id}`);
        return response.data;
    }
};

export default api;
