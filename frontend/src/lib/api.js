import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});




api.interceptors.request.use(
  (config) => {
    // 1. Safely check for token
    const token = localStorage.getItem('soundmatch_token');
    
    // 2. Only add header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 3. Log the specific error to your console for debugging
    console.error("Axios Error Details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('soundmatch_token');
      // Don't redirect automatically if you want to keep showing mock data
    }
    return Promise.reject(error);
  }
);

export default api;