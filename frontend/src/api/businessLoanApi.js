// frontend/src/api/businessLoanApi.js
// Matches the exact pattern of personalLoanApi.js
import API from "./axiosInstance.js";

export const createBusinessLoan = (data) =>
  API.post("/business-loans", data);

export const getBusinessLoan = (id) =>
  API.get(`/business-loans/${id}`);

export const uploadBusinessLoanDocuments = (applicationId, formData) =>
  API.post(`/business-loans/${applicationId}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAllBusinessLoans = () =>
  API.get("/business-loans");

export const updateBusinessLoanStatus = (id, status, remarks) =>
  API.put(`/business-loans/${id}/status`, { status, remarks });