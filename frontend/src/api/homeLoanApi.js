// frontend/src/api/homeLoanApi.js

import API from "./axiosInstance.js";

// POST /api/home-loans
export const createHomeLoanApplication = (data) =>
  API.post("/home-loans", data);

// GET /api/home-loans
export const getHomeLoanApplications = () =>
  API.get("/home-loans");

// GET /api/home-loans/:applicationId
export const getHomeLoanById = (applicationId) =>
  API.get(`/home-loans/${applicationId}`);

// GET /api/home-loans/:applicationId/details
export const getHomeLoanDetails = (applicationId) =>
  API.get(`/home-loans/${applicationId}/details`);

// PUT /api/home-loans/:applicationId/status
export const updateHomeLoanStatus = (applicationId, data) =>
  API.put(`/home-loans/${applicationId}/status`, data);

// POST /api/home-loans/:applicationId/documents
export const uploadHomeLoanDocuments = (applicationId, formData) =>
  API.post(`/home-loans/${applicationId}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });