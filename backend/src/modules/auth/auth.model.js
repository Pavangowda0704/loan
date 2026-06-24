// backend/src/modules/auth/auth.model.js
import { pool } from "../../config/db.js";

export const findByEmailOrPhone = async (identifier) => {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1`,
    [identifier, identifier]
  );
  return rows[0] || null;
};

export const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, name, email, phone, created_at FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

export const createUser = async ({ name, email, phone, password_hash }) => {
  const [result] = await pool.execute(
    `INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)`,
    [name || null, email || null, phone || null, password_hash]
  );
  return result.insertId;
};

export const getUserApplications = async (userId) => {
  // Get user's email + phone for matching old applications
  const [userRows] = await pool.execute(
    `SELECT email, phone FROM users WHERE id = ?`,
    [userId]
  );
  const user  = userRows[0];
  const email = user?.email || null;
  const phone = user?.phone || null;

  // ── Personal loans ──────────────────────────────────────────────────────────
  // Columns: application_id, loan_product, loan_purpose, loan_amount,
  //          status, created_at, remarks, email, phone, user_id
  const [personal] = await pool.execute(`
    SELECT
      application_id,
      'personal'                                             AS loan_type,
      COALESCE(loan_product, loan_purpose, 'Personal Loan') AS label,
      COALESCE(loan_amount, 0)                              AS loan_amount,
      status, created_at, remarks
    FROM personal_loan_applications
    WHERE user_id = ?
       OR (email IS NOT NULL AND email = ?)
       OR (phone IS NOT NULL AND phone = ?)
    ORDER BY created_at DESC
  `, [userId, email, phone]);

  // ── Vehicle loans ───────────────────────────────────────────────────────────
  // Need vehicle_loan_applications columns — using safe fields
  const [vehicle] = await pool.execute(`
    SELECT
      application_id,
      'vehicle'                              AS loan_type,
      COALESCE(vehicle_type, 'Vehicle Loan') AS label,
      COALESCE(loan_amount, 0)               AS loan_amount,
      status, created_at, remarks
    FROM vehicle_loan_applications
    WHERE user_id = ?
       OR (email IS NOT NULL AND email = ?)
       OR (phone IS NOT NULL AND phone = ?)
    ORDER BY created_at DESC
  `, [userId, email, phone]);

  // ── Home loans ──────────────────────────────────────────────────────────────
  // Columns: loan_product, loan_type (actual col), loan_amount, purpose
  // IMPORTANT: alias the result 'loan_type' carefully to avoid clash
  const [home] = await pool.execute(`
    SELECT
      application_id,
      'home'                                              AS loan_type,
      COALESCE(loan_product, purpose, 'Home Loan')        AS label,
      COALESCE(loan_amount, 0)                            AS loan_amount,
      status, created_at, remarks
    FROM home_loan_applications
    WHERE user_id = ?
       OR (email IS NOT NULL AND email = ?)
       OR (phone IS NOT NULL AND phone = ?)
    ORDER BY created_at DESC
  `, [userId, email, phone]);

  // ── Business loans ──────────────────────────────────────────────────────────
  // Columns: loan_product, loan_type (actual col), loan_amount, purpose
  const [business] = await pool.execute(`
    SELECT
      application_id,
      'business'                                          AS loan_type,
      COALESCE(loan_product, purpose, 'Business Loan')    AS label,
      COALESCE(loan_amount, 0)                            AS loan_amount,
      status, created_at, remarks
    FROM business_loan_applications
    WHERE user_id = ?
       OR (email IS NOT NULL AND email = ?)
       OR (phone IS NOT NULL AND phone = ?)
    ORDER BY created_at DESC
  `, [userId, email, phone]);

  // Deduplicate by application_id then sort newest first
  const seen = new Set();
  return [...personal, ...vehicle, ...home, ...business]
    .filter(a => {
      if (seen.has(a.application_id)) return false;
      seen.add(a.application_id);
      return true;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

// ── Admin: all registered users with loan counts ──────────────────────────────
export const getAllUsers = async () => {
  const [rows] = await pool.execute(`
    SELECT
      u.id, u.name, u.email, u.phone, u.created_at,
      (
        SELECT COUNT(*) FROM personal_loan_applications
        WHERE user_id = u.id
           OR (u.email IS NOT NULL AND email = u.email)
           OR (u.phone IS NOT NULL AND phone = u.phone)
      ) +
      (
        SELECT COUNT(*) FROM vehicle_loan_applications
        WHERE user_id = u.id
           OR (u.email IS NOT NULL AND email = u.email)
           OR (u.phone IS NOT NULL AND phone = u.phone)
      ) +
      (
        SELECT COUNT(*) FROM home_loan_applications
        WHERE user_id = u.id
           OR (u.email IS NOT NULL AND email = u.email)
           OR (u.phone IS NOT NULL AND phone = u.phone)
      ) +
      (
        SELECT COUNT(*) FROM business_loan_applications
        WHERE user_id = u.id
           OR (u.email IS NOT NULL AND email = u.email)
           OR (u.phone IS NOT NULL AND phone = u.phone)
      ) AS total_applications
    FROM users u
    ORDER BY u.created_at DESC
  `);
  return rows;
};