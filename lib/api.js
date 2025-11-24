import axios from 'axios';

// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;
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
        {console.log("api url"+process.env.API_URL)}
  return webApi.post('/auth/login', { email, password });
};
export const registerUser = (userData) => {
  return webApi.post('/auth/register', { ...userData, authMethod: 'manual' });
};

// --- QR Functions ---
export const fetchMyQRs = () => {
  return webApi.get('/users/me/qrs');
};

// --- Query Function (NEW) ---
export const submitQuery = (payload) => {
  return webApi.post('/query', payload);
};

// --- Profile Functions ---
export const fetchProfile = () => {
  return webApi.get('/users/me');
};

export const updateProfile = (profileData) => {
  return webApi.put('/users/me/profile', profileData);
};

export const updateAddress = (addressData) => {
  return webApi.put('/users/me/address', addressData);
};

// --- QR Management Functions ---
export const toggleQRStatus = (qrId, status) => {
  return webApi.post(`/qrs/${qrId}/toggle-status`, { status });
};

export const resendQR = (qrId) => {
  return webApi.post(`/qrs/${qrId}/resend`);
};

// --- Emergency Functions ---
export const fetchQRGuardians = (qrId) => {
  return webApi.get(`/qrs/${qrId}/guardians`);
};

export const sendEmergencyAlert = (payload) => {
  // payload: { qrId, description, phoneNumber, media: [{ base64, type }], guardianId }
  return webApi.post('/emergency/alert', payload);
};

export { webApi };