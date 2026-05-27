// ============================================================
//  modules/personalLoan/personalLoan.validation.js
//  Validation helpers extracted from the controller.
// ============================================================

export function validateCreatePersonalLoan(body) {
  const { full_name, phone, mobile, email, pan_number, pan, loan_amount, required_amount, monthly_income } = body
  const errors = []
  if (!full_name)                         errors.push('full_name is required')
  const phoneVal = phone || mobile
  if (!phoneVal)                          errors.push('phone is required')
  else if (!/^[0-9]{10}$/.test(phoneVal)) errors.push('phone must be exactly 10 digits')
  if (!email)                             errors.push('email is required')
  if (!(pan_number || pan))               errors.push('PAN number is required')
  if (!(loan_amount || required_amount))  errors.push('loan_amount is required')
  if (!monthly_income)                    errors.push('monthly_income is required')
  return errors
}
