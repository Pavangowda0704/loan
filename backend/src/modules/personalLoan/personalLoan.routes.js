// ============================================================
//  routes/personalLoanRoutes.js — Personal Loan API Routes
//
//  Mounted at: /api/personal-loans  (see server.js)
//
//  Endpoint summary:
//    POST   /               → Submit new personal loan application
//    GET    /               → Get all personal loan applications (admin)
//    GET    /:applicationId → Get single application by ID (track)
//    PUT    /:applicationId/status    → Update status (admin)
//    POST   /:applicationId/documents → Save document metadata
// ============================================================

import express from 'express'
import {
  createPersonalLoan,
  getPersonalLoans,
  getPersonalLoanById,
  updatePersonalLoanStatus,
  uploadDocuments,
} from './personalLoan.controller.js'

const router = express.Router()

router.post('/',                          createPersonalLoan)
router.get('/',                           getPersonalLoans)
router.get('/:applicationId',             getPersonalLoanById)
router.put('/:applicationId/status',      updatePersonalLoanStatus)
router.post('/:applicationId/documents',  uploadDocuments)

export default router
