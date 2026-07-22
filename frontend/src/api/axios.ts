import axios from 'axios';

const defaultBaseUrl = import.meta.env.PROD 
  ? 'https://careertrackbackend.vercel.app/api' 
  : 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach authorization tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careertrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch authentication session errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and let the application react to session expiry
      localStorage.removeItem('careertrack_token');
    }
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
