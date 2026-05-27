-- ============================================================
--  schema.sql — LoanEase Database Setup (Full)
--
--  HOW TO USE:
--    1. Open MySQL Workbench or any MySQL client
--    2. Copy this entire file and run it
--    3. This creates the database and all tables
--    4. Safe to re-run — uses IF NOT EXISTS everywhere
--
--  Tables:
--    loan_applications            → legacy general table (keep)
--    application_documents        → document metadata
--    personal_loan_applications   → dedicated personal loan table
--    vehicle_loan_applications    → dedicated vehicle loan table
-- ============================================================

CREATE DATABASE IF NOT EXISTS loanease;
USE loanease;

-- ---- Table 1: loan_applications (legacy — do not drop) ----
CREATE TABLE IF NOT EXISTS loan_applications (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  application_id   VARCHAR(30)   NOT NULL UNIQUE,
  loan_product     VARCHAR(50)   NOT NULL,
  loan_type        VARCHAR(100)  NOT NULL,
  full_name        VARCHAR(255)  NOT NULL,
  mobile           VARCHAR(20)   NOT NULL,
  email            VARCHAR(255),
  dob              DATE          NULL,
  pan              VARCHAR(20),
  city             VARCHAR(100),
  employment_type  VARCHAR(100),
  company_name     VARCHAR(255),
  monthly_income   DECIMAL(12,2),
  work_experience  VARCHAR(100),
  existing_emi     DECIMAL(12,2),
  required_amount  DECIMAL(12,2),
  preferred_tenure VARCHAR(100),
  purpose          VARCHAR(255),
  status           VARCHAR(50)   DEFAULT 'Under Review',
  remarks          TEXT,
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---- Table 2: application_documents ----
CREATE TABLE IF NOT EXISTS application_documents (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  application_id   VARCHAR(30)   NOT NULL,
  document_name    VARCHAR(255)  NOT NULL,
  file_name        VARCHAR(255),
  file_type        VARCHAR(100),
  uploaded_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ---- Table 3: personal_loan_applications ----
CREATE TABLE IF NOT EXISTS personal_loan_applications (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  application_id   VARCHAR(30)   NOT NULL UNIQUE,
  full_name        VARCHAR(255)  NOT NULL,
  phone            VARCHAR(20)   NOT NULL,
  email            VARCHAR(255),
  dob              DATE          NULL,
  pan_number       VARCHAR(20),
  city             VARCHAR(100),
  employment_type  VARCHAR(100),
  company_name     VARCHAR(255),
  monthly_income   DECIMAL(12,2),
  work_experience  VARCHAR(100),
  existing_emi     DECIMAL(12,2),
  loan_product     VARCHAR(100),
  loan_amount      DECIMAL(12,2),
  tenure           VARCHAR(50),
  loan_purpose     VARCHAR(255),
  status           VARCHAR(50)   DEFAULT 'Pending',
  remarks          TEXT,
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---- Table 4: vehicle_loan_applications ----
CREATE TABLE IF NOT EXISTS vehicle_loan_applications (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  application_id   VARCHAR(30)   NOT NULL UNIQUE,
  full_name        VARCHAR(255)  NOT NULL,
  phone            VARCHAR(20)   NOT NULL,
  email            VARCHAR(255),
  dob              DATE          NULL,
  pan_number       VARCHAR(20),
  city             VARCHAR(100),
  vehicle_type     VARCHAR(100),
  vehicle_condition VARCHAR(50),
  vehicle_price    DECIMAL(14,2),
  down_payment     DECIMAL(14,2),
  loan_amount      DECIMAL(14,2),
  monthly_income   DECIMAL(12,2),
  employment_type  VARCHAR(100),
  tenure           VARCHAR(50),
  status           VARCHAR(50)   DEFAULT 'Pending',
  remarks          TEXT,
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
