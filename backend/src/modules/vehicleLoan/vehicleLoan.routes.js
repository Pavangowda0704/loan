// ============================================================
//  vehicleLoan.routes.js  —  Mounted at /api/vehicle-loans
// ============================================================
import express from 'express'
import {
  createVehicleLoan,
  getVehicleLoans,
  getVehicleLoanStats,
  getVehicleLoanById,
  updateVehicleLoanStatus,
} from './vehicleLoan.controller.js'

const router = express.Router()

// Stats (must be before /:id to avoid param collision)
router.get('/stats',                   getVehicleLoanStats)

// CRUD
router.post('/',                       createVehicleLoan)
router.get('/',                        getVehicleLoans)
router.get('/:applicationId',          getVehicleLoanById)
router.put('/:applicationId/status',   updateVehicleLoanStatus)

export default router