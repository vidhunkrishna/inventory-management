import axios from 'axios';

// Ready for future backend integration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example interceptor for Auth tokens
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('auth_user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
