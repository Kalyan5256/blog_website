import axios from 'axios';
 
// Create one axios instance with the backend's base URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:5000/api
});
 
// INTERCEPTOR: runs automatically BEFORE every request is sent
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
 
  return config;
});
 
export default axiosInstance;
