// ============================================================
//  routes/vehicleLoanRoutes.js — Vehicle Loan API Routes
//
//  Mounted at: /api/vehicle-loans  (see server.js)
//
//  Endpoint summary:
//    POST   /               → Submit new vehicle loan application
//    GET    /               → Get all vehicle loan applications (admin)
//    GET    /:applicationId → Get single application by ID (track)
//    PUT    /:applicationId/status → Update status (admin)
// ============================================================

import express from 'express'
import {
  createVehicleLoan,
  getVehicleLoans,
  getVehicleLoanById,
  updateVehicleLoanStatus,
} from '../controllers/vehicleLoanController.js'

const router = express.Router()

router.post('/',                       createVehicleLoan)
router.get('/',                        getVehicleLoans)
router.get('/:applicationId',          getVehicleLoanById)
router.put('/:applicationId/status',   updateVehicleLoanStatus)

export default router
