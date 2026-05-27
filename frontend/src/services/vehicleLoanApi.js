// ============================================================
//  services/vehicleLoanApi.js — Vehicle Loan API calls
//
//  All HTTP calls for the vehicle loan flow go through here.
//  Uses the shared Axios instance from api.js (baseURL set there).
//
//  Used by:
//    VehicleLoanApply.jsx  → createVehicleLoanApplication
//    AdminDashboard.jsx    → getVehicleLoanApplications, updateVehicleLoanStatus
//    TrackApplication.jsx  → getVehicleLoanById
// ============================================================

import API from '../api.js'

// POST /api/vehicle-loans
export const createVehicleLoanApplication = (data) =>
  API.post('/vehicle-loans', data)

// GET /api/vehicle-loans
export const getVehicleLoanApplications = () =>
  API.get('/vehicle-loans')

// GET /api/vehicle-loans/:applicationId
export const getVehicleLoanById = (applicationId) =>
  API.get(`/vehicle-loans/${applicationId}`)

// PUT /api/vehicle-loans/:applicationId/status
export const updateVehicleLoanStatus = (applicationId, data) =>
  API.put(`/vehicle-loans/${applicationId}/status`, data)
