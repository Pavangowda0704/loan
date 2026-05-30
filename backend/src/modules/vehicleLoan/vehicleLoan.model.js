// ============================================================
//  vehicleLoan.model.js — Vehicle Loan DB Operations
// ============================================================
import { pool } from '../../config/db.js'

function generateApplicationId() {
  const rand = Math.floor(Math.random() * 900 + 100);
  return `VLN${Date.now()}${rand}`;
}

// ---- CREATE ----
export const createApplication = async (data) => {
  const applicationId = generateApplicationId();

  const sql = `
    INSERT INTO vehicle_loan_applications (
      application_id, full_name, phone, email, dob, pan_number,
      city, vehicle_type, vehicle_condition, vehicle_price,
      down_payment, loan_amount, monthly_income, employment_type,
      tenure, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  const values = [
    applicationId,
    data.full_name,
    data.phone,
    data.email           || null,
    data.dob             || null,
    data.pan_number      || null,
    data.city            || null,
    data.vehicle_type,
    data.vehicle_condition || null,
    data.vehicle_price   || null,
    data.down_payment    || null,
    data.loan_amount,
    data.monthly_income,
    data.employment_type || null,
    data.tenure          || null,
  ];

  await pool.execute(sql, values);
  return applicationId;
};

// ---- READ ALL (with document count for admin list) ----
export const getAllApplications = async (filters = {}) => {
  let sql = `
    SELECT
      v.*,
      COALESCE(d.doc_count, 0) AS document_count
    FROM vehicle_loan_applications v
    LEFT JOIN (
      SELECT application_id, COUNT(*) AS doc_count
      FROM application_documents
      GROUP BY application_id
    ) d ON d.application_id = v.application_id
  `;
  const params = [];
  const where  = [];

  if (filters.status)       { where.push('v.status = ?');       params.push(filters.status); }
  if (filters.vehicle_type) { where.push('v.vehicle_type = ?'); params.push(filters.vehicle_type); }
  if (filters.city)         { where.push('v.city = ?');         params.push(filters.city); }

  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY v.created_at DESC';

  const [rows] = await pool.execute(sql, params);
  return rows;
};

// ---- READ ONE ----
export const getApplicationById = async (applicationId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM vehicle_loan_applications WHERE application_id = ?',
    [applicationId]
  );
  return rows[0] || null;
};

// ---- READ ONE WITH DOCUMENTS (admin detail view) ----
export const getApplicationWithDocuments = async (applicationId) => {
  const [appRows] = await pool.execute(
    'SELECT * FROM vehicle_loan_applications WHERE application_id = ?',
    [applicationId]
  );
  const application = appRows[0] || null;
  if (!application) return null;

  const [docRows] = await pool.execute(
    `SELECT
       id,
       document_name,
       file_name,
       file_path,
       file_type,
       file_size,
       uploaded_at
     FROM application_documents
     WHERE application_id = ?
     ORDER BY uploaded_at ASC`,
    [applicationId]
  );

  const documents = docRows.map(doc => ({
    ...doc,
    file_url: doc.file_path || null,
    file_size_kb: doc.file_size ? Math.round(doc.file_size / 1024) : null,
  }));

  return { ...application, documents };
};

// ---- UPDATE STATUS ----
export const updateStatus = async (applicationId, status, remarks) => {
  await pool.execute(
    `UPDATE vehicle_loan_applications SET status = ?, remarks = ?, updated_at = NOW()
     WHERE application_id = ?`,
    [status, remarks || '', applicationId]
  );
};

// ---- STATS ----
export const getStats = async () => {
  const [rows] = await pool.execute(`
    SELECT
      COUNT(*)                                        AS total,
      SUM(status = 'Pending')                         AS pending,
      SUM(status = 'Under Review')                    AS under_review,
      SUM(status = 'Approved')                        AS approved,
      SUM(status = 'Rejected')                        AS rejected,
      SUM(status = 'Disbursed')                       AS disbursed,
      COALESCE(SUM(loan_amount),0)                    AS total_loan_amount
    FROM vehicle_loan_applications
  `);
  return rows[0];
};

// ---- SAVE DOCUMENTS ----
export const saveDocuments = async (applicationId, documents) => {
  for (const doc of documents) {
    await pool.execute(
      `INSERT INTO application_documents
       (application_id, document_name, file_name, file_path, file_type, file_size)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         file_name=VALUES(file_name), file_path=VALUES(file_path),
         file_type=VALUES(file_type), file_size=VALUES(file_size)`,
      [
        applicationId,
        doc.document_name,
        doc.file_name  || null,
        doc.file_path  || null,
        doc.file_type  || null,
        doc.file_size  || null,
      ]
    )
  }
}
