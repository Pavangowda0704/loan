import { pool } from "../../config/db.js";

function generateApplicationId() {
  const rand = Math.floor(Math.random() * 90 + 10);
  return `HLN${Date.now()}${rand}`;
}

export const createApplication = async (data) => {
  const applicationId = generateApplicationId();

  const sql = `
    INSERT INTO home_loan_applications (
      application_id, loan_product, loan_type,
      full_name, phone, email, dob, pan_number,
      city, state, pincode, address,
      employment_type, company_name, monthly_income,
      work_experience, existing_emi,
      property_type, property_location, property_value,
      loan_amount, tenure, purpose, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    applicationId,
    data.loan_product || "Home Loan",
    data.loan_type || data.home_loan_type || null,
    data.full_name,
    data.phone || data.mobile,
    data.email || null,
    data.dob || null,
    data.pan_number || data.pan || null,
    data.city || null,
    data.state || null,
    data.pincode || null,
    data.address || null,
    data.employment_type || null,
    data.company_name || null,
    data.monthly_income || null,
    data.work_experience || null,
    data.existing_emi || null,
    data.property_type || null,
    data.property_location || null,
    data.property_value || null,
    data.loan_amount || data.required_amount || null,
    data.tenure || data.preferred_tenure || null,
    data.purpose || data.loan_purpose || null,
    "Pending",
  ];

  await pool.execute(sql, values);
  return applicationId;
};

export const getAllApplications = async () => {
  const [rows] = await pool.execute(`
    SELECT h.*, COALESCE(d.doc_count, 0) AS document_count
    FROM home_loan_applications h
    LEFT JOIN (
      SELECT application_id, COUNT(*) AS doc_count
      FROM application_documents
      GROUP BY application_id
    ) d ON d.application_id = h.application_id
    ORDER BY h.created_at DESC
  `);
  return rows;
};

export const getApplicationById = async (applicationId) => {
  const [rows] = await pool.execute(
    "SELECT * FROM home_loan_applications WHERE application_id = ?",
    [applicationId]
  );
  return rows[0] || null;
};

export const getApplicationWithDocuments = async (applicationId) => {
  const [appRows] = await pool.execute(
    "SELECT * FROM home_loan_applications WHERE application_id = ?",
    [applicationId]
  );

  const application = appRows[0] || null;
  if (!application) return null;

  const [docRows] = await pool.execute(
    `SELECT id, document_name, file_name, file_path, file_type, file_size, uploaded_at
     FROM application_documents
     WHERE application_id = ?
     ORDER BY uploaded_at ASC`,
    [applicationId]
  );

  const documents = docRows.map((doc) => ({
    ...doc,
    file_url: doc.file_path || null,
    file_size_kb: doc.file_size ? Math.round(doc.file_size / 1024) : null,
  }));

  return { ...application, documents };
};

export const updateStatus = async (applicationId, status, remarks) => {
  await pool.execute(
    `UPDATE home_loan_applications
     SET status = ?, remarks = ?
     WHERE application_id = ?`,
    [status, remarks || "", applicationId]
  );
};

export const saveDocuments = async (applicationId, documents) => {
  for (const doc of documents) {
    await pool.execute(
      `INSERT INTO application_documents
       (application_id, document_name, file_name, file_path, file_type, file_size)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         file_name = VALUES(file_name),
         file_path = VALUES(file_path),
         file_type = VALUES(file_type),
         file_size = VALUES(file_size)`,
      [
        applicationId,
        doc.document_name,
        doc.file_name || null,
        doc.file_path || null,
        doc.file_type || null,
        doc.file_size || null,
      ]
    );
  }
};