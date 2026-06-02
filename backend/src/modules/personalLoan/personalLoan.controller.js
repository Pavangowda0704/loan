// backend/src/modules/personalLoan/personalLoan.controller.js

import * as PersonalLoan from "./personalLoan.model.js";
import { diskPathToUrl } from "../../shared/utils/fileUrl.js";

export const createPersonalLoan = async (req, res) => {
  try {
    const {
      full_name,
      phone,
      mobile,
      email,
      pan_number,
      pan,
      loan_amount,
      required_amount,
      monthly_income,
    } = req.body;

    if (!full_name) return res.status(400).json({ message: "full_name is required" });

    const phoneVal = phone || mobile;
    if (!phoneVal) return res.status(400).json({ message: "phone is required" });
    if (!/^[0-9]{10}$/.test(phoneVal)) {
      return res.status(400).json({ message: "phone must be exactly 10 digits" });
    }

    if (!email) return res.status(400).json({ message: "email is required" });
    if (!(pan_number || pan)) return res.status(400).json({ message: "PAN number is required" });
    if (!(loan_amount || required_amount)) return res.status(400).json({ message: "loan_amount is required" });
    if (!monthly_income) return res.status(400).json({ message: "monthly_income is required" });

    const applicationId = await PersonalLoan.createApplication(req.body);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application_id: applicationId,
    });
  } catch (error) {
    console.error("createPersonalLoan error:", error);
    res.status(500).json({ success: false, message: "Server error while submitting application" });
  }
};

export const getPersonalLoans = async (req, res) => {
  try {
    const applications = await PersonalLoan.getAllApplications();
    res.json({ success: true, applications });
  } catch (error) {
    console.error("getPersonalLoans error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};

export const getPersonalLoanById = async (req, res) => {
  try {
    const application = await PersonalLoan.getApplicationById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error("getPersonalLoanById error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch application" });
  }
};

export const getPersonalLoanDetails = async (req, res) => {
  try {
    const data = await PersonalLoan.getApplicationWithDocuments(req.params.applicationId);

    if (!data) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, ...data });
  } catch (error) {
    console.error("getPersonalLoanDetails error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch application details" });
  }
};

export const updatePersonalLoanStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "status is required" });
    }

    await PersonalLoan.updateStatus(req.params.applicationId, status, remarks || "");

    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("updatePersonalLoanStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    const docs = (req.files || []).map((file) => ({
      document_name: file.fieldname,
      file_name: file.originalname,
      file_path: diskPathToUrl(file.path),
      file_type: file.mimetype,
      file_size: file.size,
    }));

    if (docs.length === 0) {
      return res.status(400).json({ success: false, message: "No files received" });
    }

    await PersonalLoan.saveDocuments(applicationId, docs);

    res.json({
      success: true,
      message: "Documents uploaded successfully",
      uploaded: docs.length,
      documents: docs,
    });
  } catch (error) {
    console.error("uploadDocuments error:", error);
    res.status(500).json({ success: false, message: "Failed to upload documents" });
  }
};