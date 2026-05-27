// ============================================================
//  api/businessLoanApi.js — Business Loan API calls (placeholder)
//  Extend this file when business loan flow is implemented.
// ============================================================
import API from './axiosInstance.js'

export const createBusinessLoanApplication = (data) => API.post('/business-loans', data)
export const getBusinessLoanApplications = () => API.get('/business-loans')
export const getBusinessLoanById = (applicationId) => API.get(`/business-loans/${applicationId}`)
export const updateBusinessLoanStatus = (applicationId, data) => API.put(`/business-loans/${applicationId}/status`, data)
