import axios from 'axios';

const API_URL = `https://qnect-backend-app-zne7q.ondigitalocean.app/api/admin`;

const api = axios.create({
    baseURL: API_URL,
});

// --- QR ---
export const fetchQRCodes = () => api.get('/qrs');
export const generateQRCodes = (quantity, assignedSalespersonId) => api.post('/qrs/generate', { quantity, assignedSalespersonId });

// --- Salesperson ---
export const fetchSalespersons = () => api.get('/salespersons');
export const createSalesperson = (salespersonData) => api.post('/salespersons', salespersonData);

// --- User ---
export const fetchUsers = () => api.get('/users');
