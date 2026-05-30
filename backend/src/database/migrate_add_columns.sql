-- ============================================================
--  Migration: Add missing columns to application_documents
--  Run this ONCE on your Railway MySQL database
--  Safe to run even if columns already exist (uses IF NOT EXISTS logic)
-- ============================================================

-- Add file_path column (stores relative path like uploads/PLN123/pan_1234.pdf)
ALTER TABLE application_documents
  ADD COLUMN IF NOT EXISTS file_path VARCHAR(500) AFTER file_name;

-- Add file_size column (stores bytes as integer)
ALTER TABLE application_documents
  ADD COLUMN IF NOT EXISTS file_size INT AFTER file_type;

-- Add UNIQUE constraint so ON DUPLICATE KEY UPDATE works correctly
-- (prevents duplicate doc entries on re-upload)
ALTER TABLE application_documents
  ADD UNIQUE KEY IF NOT EXISTS uq_app_doc (application_id, document_name);

-- Verify the result
DESCRIBE application_documents;
