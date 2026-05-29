// ============================================================
//  uploadMiddleware.js — Multer file upload config
//  Stores files in /uploads/<applicationId>/
//  Accepts: jpg, jpeg, png, pdf — max 5MB per file
// ============================================================

import multer from 'multer'
import path   from 'path'
import fs     from 'fs'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const appId = req.params.applicationId || req.body.application_id || 'temp'
    const dir   = path.join(process.cwd(), 'uploads', appId)
    fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext      = path.extname(file.originalname)
    const safeName = file.fieldname + '_' + Date.now() + ext
    cb(null, safeName)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.pdf']
  const ext     = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) cb(null, true)
  else cb(new Error(`File type ${ext} not allowed`), false)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})
