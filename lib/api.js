import axios from 'axios';

// This is the URL of your backend server
const API_URL = 'http://localhost:3001/api';

const webApi = axios.create({
  baseURL: API_URL,
});

// This "interceptor" automatically adds the login token
webApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('qnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- Auth Functions ---
export const loginUser = (email, password) => {
  return webApi.post('/auth/login', { email, password });
};
export const registerUser = (name, email, password) => {
  return webApi.post('/auth/register', { name, email, password, authMethod: 'manual' });
};

// --- QR Functions ---
export const fetchMyQRs = () => {
  return webApi.get('/users/me/qrs');
};

// --- Query Function (NEW) ---
export const submitQuery = (payload) => {
  return webApi.post('/query', payload);
};