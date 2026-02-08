import api from './api';

const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const loginWithOtp = async (mobile, otp) => {
    const response = await api.post(`/auth/login/otp?mobile=${encodeURIComponent(mobile)}&otp=${encodeURIComponent(otp)}`);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

const sendOtp = async (identifier, type) => {
    const response = await api.post(`/auth/send-otp?identifier=${encodeURIComponent(identifier)}&type=${encodeURIComponent(type)}`);
    return response.data;
};

const verifyOtp = async (identifier, otp, type) => {
    const response = await api.post(`/auth/verify-otp?identifier=${encodeURIComponent(identifier)}&otp=${encodeURIComponent(otp)}&type=${encodeURIComponent(type)}`);
    return response.data;
};

export default {
    register,
    login,
    loginWithOtp,
    logout,
    isAuthenticated,
    sendOtp,
    verifyOtp
};
