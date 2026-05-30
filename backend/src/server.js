// ============================================================
//  server.js — LoanEase Backend Entry Point
//
//  API Route Groups:
//    /api/applications   → General loan applications (legacy)
//    /api/personal-loans → Personal loan dedicated flow
//    /api/vehicle-loans  → Vehicle loan dedicated flow
//    /api/health         → Health check
//    /uploads            → Static file serving for uploaded docs
// ============================================================

import express from 'express'
import cors    from 'cors'
import dotenv  from 'dotenv'
import path    from 'path'
import { fileURLToPath } from 'url'
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

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// ---------- Middleware ----------
// Allow production Vercel URL + localhost for dev
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// ---------- Static file serving for uploaded documents ----------
// Files are stored at <project_root>/uploads/<applicationId>/<file>
// Accessible at: GET /uploads/<applicationId>/<file>
// Security: only jpg, jpeg, png, pdf are ever stored (enforced in uploadMiddleware)
const uploadsDir = path.join(process.cwd(), 'uploads')
app.use('/uploads', express.static(uploadsDir, {
  // Prevent directory listing
  index: false,
  // Only serve known safe extensions
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase()
    const mimeMap = {
      '.pdf':  'application/pdf',
      '.jpg':  'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png':  'image/png',
    }
    if (mimeMap[ext]) res.setHeader('Content-Type', mimeMap[ext])
    // Allow inline viewing in browser (for PDF/image preview)
    res.setHeader('Content-Disposition', 'inline')
  },
}))

// ---------- Health Check ----------
app.get('/',           (req, res) => res.send('LoanEase API is running'))
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'LoanEase backend is running' }))

// ---------- API Routes ----------
app.use('/api/applications',   applicationRoutes)
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
