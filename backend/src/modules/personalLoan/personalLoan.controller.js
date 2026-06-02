// ============================================================
//  controllers/personalLoanController.js
//
//  Sits between the route and the model.
//  Uses dedicated personal_loan_applications table.
// ============================================================

import * as PersonalLoan from './personalLoan.model.js'
import { diskPathToUrl } from '../../shared/utils/fileUrl.js'

// POST /api/personal-loans
export const createPersonalLoan = async (req, res) => {
  try {
    const { full_name, phone, mobile, email, pan_number, pan, loan_amount, required_amount, monthly_income } = req.body

    if (!full_name)     return res.status(400).json({ message: 'full_name is required' })

    const phoneVal = phone || mobile
    if (!phoneVal)      return res.status(400).json({ message: 'phone is required' })
    if (!/^[0-9]{10}$/.test(phoneVal))
                        return res.status(400).json({ message: 'phone must be exactly 10 digits' })
    if (!email)         return res.status(400).json({ message: 'email is required' })
    if (!(pan_number || pan))
                        return res.status(400).json({ message: 'PAN number is required' })
    if (!(loan_amount || required_amount))
                        return res.status(400).json({ message: 'loan_amount is required' })
    if (!monthly_income)
                        return res.status(400).json({ message: 'monthly_income is required' })

    const applicationId = await PersonalLoan.createApplication(req.body)
    res.status(201).json({
      message: 'Application submitted successfully',
      application_id: applicationId,
    })
  } catch (error) {
    console.error('createPersonalLoan error:', error)
    res.status(500).json({ message: 'Server error while submitting application' })
  }
}

// GET /api/personal-loans
export const getPersonalLoans = async (req, res) => {
  try {
    const applications = await PersonalLoan.getAllApplications()
    res.json(applications)
  } catch (error) {
    console.error('getPersonalLoans error:', error)
    res.status(500).json({ message: 'Failed to fetch applications' })
  }
}

// GET /api/personal-loans/:applicationId
export const getPersonalLoanById = async (req, res) => {
  try {
    const application = await PersonalLoan.getApplicationById(req.params.applicationId)
    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }
    res.json(application)
  } catch (error) {
    console.error('getPersonalLoanById error:', error)
    res.status(500).json({ message: 'Failed to fetch application' })
  }
}

// GET /api/personal-loans/:applicationId/details
// Returns full application data + documents array with file URLs
export const getPersonalLoanDetails = async (req, res) => {
  try {
    const data = await PersonalLoan.getApplicationWithDocuments(req.params.applicationId)
    if (!data) {
      return res.status(404).json({ message: 'Application not found' })
    }
    res.json(data)
  } catch (error) {
    console.error('getPersonalLoanDetails error:', error)
    res.status(500).json({ message: 'Failed to fetch application details' })
  }
}

// PUT /api/personal-loans/:applicationId/status
export const updatePersonalLoanStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body
    if (!status) {
      return res.status(400).json({ message: 'status is required' })
    }
    await PersonalLoan.updateStatus(req.params.applicationId, status, remarks || '')
    res.json({ message: 'Status updated successfully' })
  } catch (error) {
    console.error('updatePersonalLoanStatus error:', error)
    res.status(500).json({ message: 'Failed to update status' })
  }
}

// POST /api/personal-loans/:applicationId/documents
// Accepts multipart/form-data — files stored on disk via multer
export const uploadDocuments = async (req, res) => {
  try {
    const applicationId = req.params.applicationId

    const docs = (req.files || []).map(f => ({
      document_name: f.fieldname,
      file_name:     f.originalname,
      file_path:     diskPathToUrl(f.path),   // store public URL, not disk path
      file_type:     f.mimetype,
      file_size:     f.size,
    }))

    if (docs.length === 0) {
      return res.status(400).json({ message: 'No files received' })
    }

    await PersonalLoan.saveDocuments(applicationId, docs)
    res.json({
      message: 'Documents uploaded successfully',
      uploaded: docs.length,
      files: docs.map(d => ({ name: d.document_name, file: d.file_name })),
    })
  } catch (error) {
    console.error('uploadDocuments error:', error)
    res.status(500).json({ message: 'Failed to upload documents' })
  }
}
