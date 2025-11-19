import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://ai-fitness-3.onrender.com/api',
  timeout: 60000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? 'Unknown error';
    return Promise.reject(new Error(message));
  },
);

export default api;

