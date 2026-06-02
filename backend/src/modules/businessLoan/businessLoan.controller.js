import * as BusinessLoan from "./businessLoan.model.js";
import cloudinary from "../../config/cloudinary.js";

const uploadToCloudinary = (file, applicationId) => {
  return new Promise((resolve, reject) => {
    const folder = `loanease/business-loans/${applicationId}`;

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

export const createBusinessLoan = async (req, res) => {
  try {
    const { full_name, phone, mobile, email, loan_amount, required_amount } = req.body;

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

    const applicationId = await BusinessLoan.createApplication(req.body);

    res.status(201).json({
      success: true,
      message: "Business loan application submitted successfully",
      application_id: applicationId,
    });
  } catch (error) {
    console.error("createBusinessLoan error:", error);
    res.status(500).json({ success: false, message: "Server error while submitting business loan" });
  }
};

export const getBusinessLoans = async (req, res) => {
  try {
    const applications = await BusinessLoan.getAllApplications();
    res.json({ success: true, applications });
  } catch (error) {
    console.error("getBusinessLoans error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch business loans" });
  }
};

export const getBusinessLoanById = async (req, res) => {
  try {
    const application = await BusinessLoan.getApplicationById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error("getBusinessLoanById error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch business loan" });
  }
};

export const getBusinessLoanDetails = async (req, res) => {
  try {
    const data = await BusinessLoan.getApplicationWithDocuments(req.params.applicationId);

    if (!data) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, ...data });
  } catch (error) {
    console.error("getBusinessLoanDetails error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch business loan details" });
  }
};

export const updateBusinessLoanStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "status is required" });
    }

    await BusinessLoan.updateStatus(req.params.applicationId, status, remarks || "");

    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("updateBusinessLoanStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

export const uploadBusinessDocuments = async (req, res) => {
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

    await BusinessLoan.saveDocuments(applicationId, docs);

    res.json({
      success: true,
      message: "Business loan documents uploaded successfully",
      uploaded: docs.length,
      documents: docs,
    });
  } catch (error) {
    console.error("uploadBusinessDocuments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload business loan documents",
      error: error.message,
    });
  }
};