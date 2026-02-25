import axios from 'axios';

const API_URL = `https://qnect.in/api/salesperson`;

const api = axios.create({
    baseURL: API_URL,
});

// Automatically add the login token to all requests from the salesperson portal
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('qnect_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// --- Salesperson Endpoints ---
export const fetchDashboard = () => api.get('/dashboard');
export const fetchAssignedQRs = () => api.get('/qrs');
export const registerQRSale = (qrId, endUserEmail) => api.post('/qrs/register-sale', { qrId, endUserEmail });
