// ============================================================
//  config/db.js — MySQL Connection Pool
//
//  Uses mysql2/promise so every query returns a Promise.
//  The pool keeps up to 10 open connections and reuses them.
//
//  Exported:
//    pool      → use for all SQL queries: pool.query(sql, values)
//    connectDB → call once at startup to verify DB is reachable
// ============================================================

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASSWORD || '',
  database:         process.env.DB_NAME     || 'loanease',
  waitForConnections: true,
  connectionLimit:  10,
})

export async function connectDB() {
  try {
    const connection = await pool.getConnection()
    console.log('MySQL connected successfully')
    connection.release()
  } catch (error) {
    console.error('MySQL connection failed:', error.message)
    console.error('Check backend/.env — DB_HOST, DB_USER, DB_PASSWORD, DB_NAME')
    process.exit(1)
  }
}
