// ============================================================
//  api.js — Shared Axios Instance
//
//  All API calls in the app import this instance.
//  The base URL comes from the .env file (VITE_API_BASE_URL).
//  If the env variable is not set, it falls back to localhost.
//
//  Usage in any service file:
//    import API from '../api.js'
//    API.get('/some-endpoint')
//    API.post('/some-endpoint', data)
// ============================================================

import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://loan-production-fe55.up.railway.app/api',
})

export default API
