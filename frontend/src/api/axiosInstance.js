// frontend/src/api/axiosInstance.js
//
// All existing API calls continue to work unchanged.
// Added: JWT token is automatically attached if the user is logged in.

import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://loan-l0df.onrender.com/api',
  timeout: 30000,
})

// Automatically attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API