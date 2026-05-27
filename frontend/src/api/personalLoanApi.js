// ============================================================
//  services/personalLoanApi.js — Personal Loan API calls
//
//  All HTTP calls for the personal loan flow go through here.
//  Uses the shared Axios instance from api.js (baseURL set there).
// ============================================================

import API from './axiosInstance.js'

// POST /api/personal-loans
export const createPersonalLoan = (data) =>
  API.post('/personal-loans', data)

// Alias for consistent naming across services
export const createPersonalLoanApplication = createPersonalLoan

// GET /api/personal-loans
export const getPersonalLoans = () =>
  API.get('/personal-loans')

export const getPersonalLoanApplications = getPersonalLoans

// GET /api/personal-loans/:applicationId
export const getPersonalLoanById = (applicationId) =>
  API.get(`/personal-loans/${applicationId}`)

// PUT /api/personal-loans/:applicationId/status
export const updatePersonalLoanStatus = (applicationId, data) =>
  API.put(`/personal-loans/${applicationId}/status`, data)

// POST /api/personal-loans/:applicationId/documents
export const uploadPersonalLoanDocuments = (applicationId, documents) =>
  API.post(`/personal-loans/${applicationId}/documents`, { documents })
