// ============================================================
//  models/personalLoanModel.js — Personal Loan DB Operations
//
//  All direct SQL for personal loans.
//  Uses the dedicated personal_loan_applications table.
//
//  Application ID format: PLN + timestamp + 2 random digits
//  Example: PLN174825120048
// ============================================================

import { pool } from '../config/db.js'

function generateApplicationId() {
  const rand = Math.floor(Math.random() * 90 + 10)
  return `PLN${Date.now()}${rand}`
}

// ---- CREATE ----
export const createApplication = async (data) => {
  const applicationId = generateApplicationId()

  const sql = `
    INSERT INTO personal_loan_applications (
      application_id, full_name, phone, email, dob, pan_number,
      city, employment_type, company_name, monthly_income,
      work_experience, existing_emi, loan_product,
      loan_amount, tenure, loan_purpose, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  // Support both old field names (mobile/pan/required_amount/preferred_tenure/purpose)
  // and new field names for forward compatibility
  const values = [
    applicationId,
    data.full_name,
    data.phone        || data.mobile,
    data.email        || null,
    data.dob          || null,
    data.pan_number   || data.pan   || null,
    data.city         || null,
    data.employment_type  || null,
    data.company_name     || null,
    data.monthly_income   || null,
    data.work_experience  || null,
    data.existing_emi     || null,
    data.loan_product     || 'Personal Loan',
    data.loan_amount   || data.required_amount  || null,
    data.tenure        || data.preferred_tenure || null,
    data.loan_purpose  || data.purpose          || null,
    'Pending',
  ]

  await pool.execute(sql, values)
  return applicationId
}

// ---- READ ALL ----
export const getAllApplications = async () => {
  const [rows] = await pool.execute(
    'SELECT * FROM personal_loan_applications ORDER BY created_at DESC'
  )
  return rows
}

// ---- READ ONE ----
export const getApplicationById = async (applicationId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM personal_loan_applications WHERE application_id = ?',
    [applicationId]
  )
  return rows[0] || null
}

// ---- UPDATE STATUS ----
export const updateStatus = async (applicationId, status, remarks) => {
  await pool.execute(
    `UPDATE personal_loan_applications
     SET status = ?, remarks = ?
     WHERE application_id = ?`,
    [status, remarks || '', applicationId]
  )
}

// ---- SAVE DOCUMENTS (metadata only) ----
export const saveDocuments = async (applicationId, documents) => {
  for (const doc of documents) {
    await pool.execute(
      `INSERT INTO application_documents
       (application_id, document_name, file_name, file_type)
       VALUES (?, ?, ?, ?)`,
      [applicationId, doc.document_name, doc.file_name || null, doc.file_type || null]
    )
  }
}
