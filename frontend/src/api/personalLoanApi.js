// ============================================================
//  api/personalLoanApi.js — Personal Loan API calls
// ============================================================

import API from './axiosInstance.js'

// POST /api/personal-loans
export const createPersonalLoan = (data) =>
  API.post('/personal-loans', data)

// Alias
export const createPersonalLoanApplication = createPersonalLoan

// GET /api/personal-loans
export const getPersonalLoans = () =>
  API.get('/personal-loans')

export const getPersonalLoanApplications = getPersonalLoans

// GET /api/personal-loans/:applicationId
export const getPersonalLoanById = (applicationId) =>
  API.get(`/personal-loans/${applicationId}`)

// GET /api/personal-loans/:applicationId/details  ← NEW
// Returns full application + documents array with file_url
export const getPersonalLoanDetails = (applicationId) =>
  API.get(`/personal-loans/${applicationId}/details`)

// PUT /api/personal-loans/:applicationId/status
export const updatePersonalLoanStatus = (applicationId, data) =>
  API.put(`/personal-loans/${applicationId}/status`, data)

// POST /api/personal-loans/:applicationId/documents
export const uploadPersonalLoanDocuments = (applicationId, formData) =>
  API.post(`/personal-loans/${applicationId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
