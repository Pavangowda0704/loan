import express from "express";
import { upload } from "../../shared/middleware/uploadMiddleware.js";

import {
  createBusinessLoan,
  getBusinessLoans,
  getBusinessLoanById,
  getBusinessLoanDetails,
  updateBusinessLoanStatus,
  uploadBusinessDocuments,
} from "./businessLoan.controller.js";

const router = express.Router();

router.post("/", createBusinessLoan);
router.get("/", getBusinessLoans);
router.get("/:applicationId/details", getBusinessLoanDetails);
router.get("/:applicationId", getBusinessLoanById);
router.put("/:applicationId/status", updateBusinessLoanStatus);
router.post("/:applicationId/documents", upload.any(), uploadBusinessDocuments);

export default router;