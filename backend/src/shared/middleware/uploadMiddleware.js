// ============================================================
//  uploadMiddleware.js — Multer file upload config (Cloudinary)
// ============================================================

import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config()

// 1. Configure Cloudinary using your Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// 2. Configure Multer to upload directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const appId = req.params.applicationId || req.body.application_id || 'temp'
    return {
      folder: `loan_applications/${appId}`, // Creates a folder in Cloudinary for each application
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      resource_type: 'auto' // Important for accepting both PDFs (raw) and Images
    }
  },
})

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
})