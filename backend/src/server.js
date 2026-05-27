// ============================================================
//  server.js — LoanEase Backend Entry Point
//
//  API Route Groups:
//    /api/applications   → General loan applications (legacy)
//    /api/personal-loans → Personal loan dedicated flow
//    /api/vehicle-loans  → Vehicle loan dedicated flow
//    /api/health         → Health check
// ============================================================

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'

// Legacy route (kept for backward compat)
import applicationRoutes from './routes/applicationRoutes.js'

// Module-based routes
import personalLoanRoutes from './modules/personalLoan/personalLoan.routes.js'
import vehicleLoanRoutes  from './modules/vehicleLoan/vehicleLoan.routes.js'

// Global error handler
import { errorHandler } from './shared/middleware/errorHandler.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

// ---------- Middleware ----------
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

// ---------- Health Check ----------
app.get('/',            (req, res) => res.send('LoanEase API is running'))
app.get('/api/health',  (req, res) => res.json({ status: 'ok', message: 'LoanEase backend is running' }))

// ---------- API Routes ----------
app.use('/api/applications',  applicationRoutes)
app.use('/api/personal-loans', personalLoanRoutes)
app.use('/api/vehicle-loans',  vehicleLoanRoutes)

// ---------- Global Error Handler ----------
app.use(errorHandler)

// ---------- Start Server ----------
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  )
})
