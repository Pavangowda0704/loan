// ============================================================
//  shared/utils/validators.js — Common form validators
// ============================================================

export const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone)
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const isValidPAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)
export const isValidAadhaar = (aadhaar) => /^[0-9]{12}$/.test(aadhaar)
export const isRequired = (value) => value !== undefined && value !== null && value !== ''
