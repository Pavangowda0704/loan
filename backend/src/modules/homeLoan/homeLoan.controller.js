import * as HomeLoan from "./homeLoan.model.js";
import cloudinary from "../../config/cloudinary.js";

const uploadToCloudinary = (file, applicationId) => {
  return new Promise((resolve, reject) => {
    const folder = `loanease/home-loans/${applicationId}`;

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

export const createHomeLoan = async (req, res) => {
  try {
    const { full_name, phone, mobile, email, loan_amount, required_amount, monthly_income } = req.body;

    if (!full_name) return res.status(400).json({ success: false, message: "full_name is required" });

    const phoneVal = phone || mobile;
    if (!phoneVal) return res.status(400).json({ success: false, message: "phone is required" });
    if (!/^[0-9]{10}$/.test(phoneVal)) {
      return res.status(400).json({ success: false, message: "phone must be exactly 10 digits" });
    }

    if (!email) return res.status(400).json({ success: false, message: "email is required" });
    if (!(loan_amount || required_amount)) {
      return res.status(400).json({ success: false, message: "loan_amount is required" });
    }
    if (!monthly_income) return res.status(400).json({ success: false, message: "monthly_income is required" });

    const applicationId = await HomeLoan.createApplication(req.body);

    res.status(201).json({
      success: true,
      message: "Home loan application submitted successfully",
      application_id: applicationId,
    });
  } catch (error) {
    console.error("createHomeLoan error:", error);
    res.status(500).json({ success: false, message: "Server error while submitting home loan" });
  }
};

export const getHomeLoans = async (req, res) => {
  try {
    const applications = await HomeLoan.getAllApplications();
    res.json({ success: true, applications });
  } catch (error) {
    console.error("getHomeLoans error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch home loans" });
  }
};

export const getHomeLoanById = async (req, res) => {
  try {
    const application = await HomeLoan.getApplicationById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error("getHomeLoanById error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch home loan" });
  }
};

export const getHomeLoanDetails = async (req, res) => {
  try {
    const data = await HomeLoan.getApplicationWithDocuments(req.params.applicationId);

    if (!data) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, ...data });
  } catch (error) {
    console.error("getHomeLoanDetails error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch home loan details" });
  }
};

export const updateHomeLoanStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "status is required" });
    }

    await HomeLoan.updateStatus(req.params.applicationId, status, remarks || "");

    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("updateHomeLoanStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

export const uploadHomeDocuments = async (req, res) => {
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

    await HomeLoan.saveDocuments(applicationId, docs);

    res.json({
      success: true,
      message: "Home loan documents uploaded successfully",
      uploaded: docs.length,
      documents: docs,
    });
  } catch (error) {
    console.error("uploadHomeDocuments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload home loan documents",
      error: error.message,
    });
  }
};