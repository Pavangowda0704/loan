import express    from 'express'
import { upload } from '../../shared/middleware/uploadMiddleware.js'
import {
  createVehicleLoan,
  getVehicleLoans,
  getVehicleLoanStats,
  getVehicleLoanById,
  getVehicleLoanDetails,
  updateVehicleLoanStatus,
  uploadVehicleDocuments,
} from './vehicleLoan.controller.js'

const router = express.Router()

router.get('/stats',                                        getVehicleLoanStats)
router.post('/',                                            createVehicleLoan)
router.get('/',                                             getVehicleLoans)
router.get('/:applicationId/details',                       getVehicleLoanDetails)    // ← NEW: full details + docs
router.get('/:applicationId',                               getVehicleLoanById)
router.put('/:applicationId/status',                        updateVehicleLoanStatus)
router.post('/:applicationId/documents', upload.any(),      uploadVehicleDocuments)

export default router
