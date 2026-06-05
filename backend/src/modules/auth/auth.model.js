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
  const [personal] = await pool.execute(
    `SELECT application_id, 'personal' AS loan_type, loan_product AS label,
            loan_amount, status, created_at, remarks
     FROM personal_loan_applications WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  const [vehicle] = await pool.execute(
    `SELECT application_id, 'vehicle' AS loan_type, vehicle_type AS label,
            loan_amount, status, created_at, remarks
     FROM vehicle_loan_applications WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  const [home] = await pool.execute(
    `SELECT application_id, 'home' AS loan_type, loan_type AS label,
            loan_amount, status, created_at, remarks
     FROM home_loan_applications WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  const [business] = await pool.execute(
    `SELECT application_id, 'business' AS loan_type, loan_type AS label,
            loan_amount, status, created_at, remarks
     FROM business_loan_applications WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );

  return [...personal, ...vehicle, ...home, ...business]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

// ✅ NEW — All registered users with their loan counts
export const getAllUsers = async () => {
  const [rows] = await pool.execute(`
    SELECT
      u.id,
      u.name,
      u.email,
      u.phone,
      u.created_at,
      (
        SELECT COUNT(*) FROM personal_loan_applications  WHERE user_id = u.id
      ) +
      (
        SELECT COUNT(*) FROM vehicle_loan_applications   WHERE user_id = u.id
      ) +
      (
        SELECT COUNT(*) FROM home_loan_applications      WHERE user_id = u.id
      ) +
      (
        SELECT COUNT(*) FROM business_loan_applications  WHERE user_id = u.id
      ) AS total_applications
    FROM users u
    ORDER BY u.created_at DESC
  `);
  return rows;
};