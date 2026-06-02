// backend/src/modules/vehicleLoan/vehicleLoan.controller.js

import * as VehicleLoan from "./vehicleLoan.model.js";
import cloudinary from "../../config/cloudinary.js";

const uploadToCloudinary = (file, applicationId) => {
  return new Promise((resolve, reject) => {
    const folder = `loanease/vehicle-loans/${applicationId}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        public_id: `${file.fieldname}-${Date.now()}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

export const createVehicleLoan = async (req, res) => {
  try {
    const { full_name, phone, vehicle_type, loan_amount, monthly_income } = req.body;

    if (!full_name) return res.status(400).json({ success: false, message: "full_name is required" });
    if (!phone) return res.status(400).json({ success: false, message: "phone is required" });
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "phone must be exactly 10 digits" });
    }
    if (!vehicle_type) return res.status(400).json({ success: false, message: "vehicle_type is required" });
    if (!loan_amount) return res.status(400).json({ success: false, message: "loan_amount is required" });
    if (!monthly_income) return res.status(400).json({ success: false, message: "monthly_income is required" });

    const applicationId = await VehicleLoan.createApplication(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle loan application submitted successfully",
      application_id: applicationId,
    });
  } catch (error) {
    console.error("createVehicleLoan error:", error);
    res.status(500).json({ success: false, message: "Server error while submitting application" });
  }
};

export const getVehicleLoans = async (req, res) => {
  try {
    const { status, vehicle_type, city } = req.query;
    const applications = await VehicleLoan.getAllApplications({ status, vehicle_type, city });

    res.json({ success: true, applications });
  } catch (error) {
    console.error("getVehicleLoans error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch vehicle loan applications" });
  }
};

export const getVehicleLoanStats = async (req, res) => {
  try {
    const stats = await VehicleLoan.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error("getVehicleLoanStats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};

export const getVehicleLoanById = async (req, res) => {
  try {
    const application = await VehicleLoan.getApplicationById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error("getVehicleLoanById error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch application" });
  }
};

export const getVehicleLoanDetails = async (req, res) => {
  try {
    const data = await VehicleLoan.getApplicationWithDocuments(req.params.applicationId);

    if (!data) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, ...data });
  } catch (error) {
    console.error("getVehicleLoanDetails error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch application details" });
  }
};

export const updateVehicleLoanStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "status is required" });
    }

    const valid = [
      "Pending",
      "Under Review",
      "Document Verification",
      "Approved",
      "Rejected",
      "Disbursed",
    ];

    if (!valid.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${valid.join(", ")}`,
      });
    }

    await VehicleLoan.updateStatus(req.params.applicationId, status, remarks || "");

    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("updateVehicleLoanStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

export const uploadVehicleDocuments = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({ success: false, message: "No files received" });
    }

    const uploadedResults = await Promise.all(
      files.map((file) => uploadToCloudinary(file, applicationId))
    );

    const docs = files.map((file, index) => ({
      document_name: file.fieldname,
      file_name: file.originalname,
      file_path: uploadedResults[index].secure_url,
      file_type: file.mimetype,
      file_size: file.size,
    }));

    await VehicleLoan.saveDocuments(applicationId, docs);

    res.json({
      success: true,
      message: "Documents uploaded to Cloudinary successfully",
      uploaded: docs.length,
      documents: docs,
    });
  } catch (error) {
    console.error("uploadVehicleDocuments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload documents",
      error: error.message,
    });
  }
};