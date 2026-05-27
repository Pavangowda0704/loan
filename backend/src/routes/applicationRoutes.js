import express from 'express'
import { pool } from '../config/db.js'

const router = express.Router()

function makeApplicationId(product = 'personal') {
  const prefix = product === 'vehicle' ? 'LEV' : 'LEP'
  return `${prefix}${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`
}

function mapRow(row) {
  return {
    id: row.id,
    applicationId: row.application_id,
    loanProduct: row.loan_product,
    loanType: row.loan_type,
    fullName: row.full_name,
    mobile: row.mobile,
    email: row.email,
    dob: row.dob,
    pan: row.pan,
    city: row.city,
    employmentType: row.employment_type,
    companyName: row.company_name,
    monthlyIncome: Number(row.monthly_income || 0),
    workExperience: row.work_experience,
    requiredAmount: Number(row.required_amount || 0),
    preferredTenure: row.preferred_tenure,
    purpose: row.purpose,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM loan_applications ORDER BY created_at DESC')
    res.json({ applications: rows.map(mapRow) })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const {
      loanProduct,
      loanType,
      fullName,
      mobile,
      email,
      dob,
      pan,
      city,
      employmentType,
      companyName,
      monthlyIncome,
      workExperience,
      requiredAmount,
      preferredTenure,
      purpose,
    } = req.body

    if (!fullName || !mobile || !loanType) {
      return res.status(400).json({ message: 'Full name, mobile number and loan type are required.' })
    }

    const applicationId = makeApplicationId(loanProduct)

    await pool.query(
      `INSERT INTO loan_applications (
        application_id, loan_product, loan_type, full_name, mobile, email, dob, pan, city,
        employment_type, company_name, monthly_income, work_experience, required_amount,
        preferred_tenure, purpose, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicationId,
        loanProduct || 'personal',
        loanType,
        fullName,
        mobile,
        email || null,
        dob || null,
        pan || null,
        city || null,
        employmentType || null,
        companyName || null,
        monthlyIncome || 0,
        workExperience || null,
        requiredAmount || 0,
        preferredTenure || null,
        purpose || null,
        'Under Review',
      ]
    )

    const [rows] = await pool.query('SELECT * FROM loan_applications WHERE application_id = ?', [applicationId])

    res.status(201).json({
      message: 'Application submitted successfully',
      application: mapRow(rows[0]),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/track', async (req, res) => {
  try {
    const { applicationId, mobile } = req.query

    if (!applicationId || !mobile) {
      return res.status(400).json({ message: 'Application ID and mobile number are required.' })
    }

    const [rows] = await pool.query(
      'SELECT * FROM loan_applications WHERE application_id = ? AND mobile = ? LIMIT 1',
      [applicationId, mobile]
    )

    if (!rows.length) {
      return res.status(404).json({ message: 'No application found for the provided details.' })
    }

    res.json({ application: mapRow(rows[0]) })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' })
    }

    await pool.query('UPDATE loan_applications SET status = ? WHERE application_id = ?', [status, applicationId])
    const [rows] = await pool.query('SELECT * FROM loan_applications WHERE application_id = ?', [applicationId])

    if (!rows.length) {
      return res.status(404).json({ message: 'Application not found.' })
    }

    res.json({ message: 'Status updated successfully', application: mapRow(rows[0]) })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
