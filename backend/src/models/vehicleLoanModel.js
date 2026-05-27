// ============================================================
//  models/vehicleLoanModel.js — Vehicle Loan DB Operations
//
//  All direct SQL queries for vehicle loans live here.
//  The controller calls these functions — never writes SQL.
//
//  Functions:
//    createApplication(data)           → INSERT, returns applicationId
//    getAllApplications()               → SELECT all vehicle loans
//    getApplicationById(applicationId) → SELECT one by ID
//    updateStatus(id, status, remarks) → UPDATE status + remarks
// ============================================================

import { pool } from '../config/db.js'

// Generate: VLN + timestamp + 2 random digits
// Example: VLN17482512001248
function generateApplicationId() {
  const rand = Math.floor(Math.random() * 90 + 10)
  return `VLN${Date.now()}${rand}`
}

// ---- CREATE ----
export const createApplication = async (data) => {
  const applicationId = generateApplicationId()

  const sql = `
    INSERT INTO vehicle_loan_applications (
      application_id, full_name, phone, email, dob, pan_number,
      city, vehicle_type, vehicle_condition, vehicle_price,
      down_payment, loan_amount, monthly_income, employment_type,
      tenure, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const values = [
    applicationId,
    data.full_name,
    data.phone,
    data.email            || null,
    data.dob              || null,
    data.pan_number       || null,
    data.city             || null,
    data.vehicle_type,
    data.vehicle_condition || null,
    data.vehicle_price    || null,
    data.down_payment     || null,
    data.loan_amount,
    data.monthly_income,
    data.employment_type  || null,
    data.tenure           || null,
    'Pending',
  ]

  await pool.execute(sql, values)
  return applicationId
}

// ---- READ ALL ----
export const getAllApplications = async () => {
  const [rows] = await pool.execute(
    'SELECT * FROM vehicle_loan_applications ORDER BY created_at DESC'
  )
  return rows
}

// ---- READ ONE ----
export const getApplicationById = async (applicationId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM vehicle_loan_applications WHERE application_id = ?',
    [applicationId]
  )
  return rows[0] || null
}

// ---- UPDATE STATUS ----
export const updateStatus = async (applicationId, status, remarks) => {
  await pool.execute(
    `UPDATE vehicle_loan_applications
     SET status = ?, remarks = ?
     WHERE application_id = ?`,
    [status, remarks || '', applicationId]
  )
}
