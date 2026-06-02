// ============================================================
//  uploadMiddleware.js — Multer file upload config (Local Disk)
// ============================================================

import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Ensure local upload directory exists
const uploadDir = './uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure Multer to save files on your server's disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Generate a unique file name using the application ID and a timestamp
    const appId = req.params.applicationId || req.body.application_id || 'temp'
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fileExt = path.extname(file.originalname).toLowerCase()
    cb(null, `${appId}-${uniqueSuffix}${fileExt}`)
  }
})

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      return cb(null, true)
    }
    cb(new Error('Only .png, .jpg, .jpeg, and .pdf formats are allowed!'))
  }
})