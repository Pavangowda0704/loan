import express        from 'express'
import { upload }     from '../../shared/middleware/uploadMiddleware.js'
import {
  createPersonalLoan,
  getPersonalLoans,
  getPersonalLoanById,
  getPersonalLoanDetails,
  updatePersonalLoanStatus,
  uploadDocuments,
} from './personalLoan.controller.js'

const router = express.Router()

router.post('/',                                          createPersonalLoan)
router.get('/',                                           getPersonalLoans)
router.get('/:applicationId/details',                     getPersonalLoanDetails)   // ← NEW: full details + docs
router.get('/:applicationId',                             getPersonalLoanById)
router.put('/:applicationId/status',                      updatePersonalLoanStatus)
router.post('/:applicationId/documents', upload.any(),    uploadDocuments)

export default router
