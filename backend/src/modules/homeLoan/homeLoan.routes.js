import express from "express";
import { upload } from "../../shared/middleware/uploadMiddleware.js";

import {
  createHomeLoan,
  getHomeLoans,
  getHomeLoanById,
  getHomeLoanDetails,
  updateHomeLoanStatus,
  uploadHomeDocuments,
} from "./homeLoan.controller.js";

const router = express.Router();

router.post("/", createHomeLoan);
router.get("/", getHomeLoans);
router.get("/:applicationId/details", getHomeLoanDetails);
router.get("/:applicationId", getHomeLoanById);
router.put("/:applicationId/status", updateHomeLoanStatus);
router.post("/:applicationId/documents", upload.any(), uploadHomeDocuments);

export default router;