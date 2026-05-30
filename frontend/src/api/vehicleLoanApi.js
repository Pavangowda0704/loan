// ============================================================
//  api/vehicleLoanApi.js — Vehicle Loan API calls
// ============================================================

import API from './axiosInstance.js'

// POST /api/vehicle-loans
export const createVehicleLoanApplication = (data) =>
  API.post('/vehicle-loans', data)

// GET /api/vehicle-loans
export const getVehicleLoanApplications = () =>
  API.get('/vehicle-loans')

// GET /api/vehicle-loans/:applicationId
export const getVehicleLoanById = (applicationId) =>
  API.get(`/vehicle-loans/${applicationId}`)

// GET /api/vehicle-loans/:applicationId/details  ← NEW
// Returns full application + documents array with file_url
export const getVehicleLoanDetails = (applicationId) =>
  API.get(`/vehicle-loans/${applicationId}/details`)

// PUT /api/vehicle-loans/:applicationId/status
export const updateVehicleLoanStatus = (applicationId, data) =>
  API.put(`/vehicle-loans/${applicationId}/status`, data)

// POST /api/vehicle-loans/:applicationId/documents  ✅ ADDED
export const uploadVehicleDocuments = (applicationId, formData) =>
  API.post(`/vehicle-loans/${applicationId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
