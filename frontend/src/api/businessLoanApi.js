// frontend/src/api/businessLoanApi.js

import API from "./axiosInstance.js";

// POST /api/business-loans
export const createBusinessLoanApplication = (data) =>
  API.post("/business-loans", data);

// GET /api/business-loans
export const getBusinessLoanApplications = () =>
  API.get("/business-loans");

// GET /api/business-loans/:applicationId
export const getBusinessLoanById = (applicationId) =>
  API.get(`/business-loans/${applicationId}`);

// GET /api/business-loans/:applicationId/details
export const getBusinessLoanDetails = (applicationId) =>
  API.get(`/business-loans/${applicationId}/details`);

// PUT /api/business-loans/:applicationId/status
export const updateBusinessLoanStatus = (applicationId, data) =>
  API.put(`/business-loans/${applicationId}/status`, data);

// POST /api/business-loans/:applicationId/documents
export const uploadBusinessLoanDocuments = (applicationId, formData) =>
  API.post(`/business-loans/${applicationId}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });