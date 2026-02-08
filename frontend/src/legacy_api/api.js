// api.js
import axios from "axios";

const getBaseUrl = () => {
  const { protocol, hostname, port } = window.location;
  if (port === "5173") {
    return "";
  }
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//${hostname}:8080`;
  }
  return "https://api.skilledup.tech";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    
    console.error('API Error:', error.response?.status, error.message);
    
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 401:
          // Unauthorized - Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login?session=expired";
          break;
          
        case 403:
          // Forbidden - User doesn't have permission
          console.error("Access forbidden");
          break;
          
        case 404:
          // Not Found
          console.error("Resource not found");
          break;
          
        case 500:
          // Server Error
          console.error("Server error occurred");
          break;
          
        default:
          console.error("API error:", error.response.status);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
