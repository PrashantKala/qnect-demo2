import axios from 'axios';

const API_URL = `https://qnect-backend-app-zne7q.ondigitalocean.app/api/admin`;

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('qnect_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// --- QR ---
export const fetchQRCodes = () => api.get('/qrs');
export const generateQRCodes = (quantity, assignedSalespersonId) => api.post('/qrs/generate', { quantity, assignedSalespersonId });

// --- Salesperson ---
export const fetchSalespersons = () => api.get('/salespersons');
export const createSalesperson = (salespersonData) => api.post('/salespersons', salespersonData);

// --- User ---
export const fetchUsers = () => api.get('/users');
