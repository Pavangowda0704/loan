// ============================================================
//  api/homeLoanApi.js — Home Loan API calls (placeholder)
//  Extend this file when home loan flow is implemented.
// ============================================================
import API from './axiosInstance.js'

export const createHomeLoanApplication = (data) => API.post('/home-loans', data)
export const getHomeLoanApplications = () => API.get('/home-loans')
export const getHomeLoanById = (applicationId) => API.get(`/home-loans/${applicationId}`)
export const updateHomeLoanStatus = (applicationId, data) => API.put(`/home-loans/${applicationId}/status`, data)
