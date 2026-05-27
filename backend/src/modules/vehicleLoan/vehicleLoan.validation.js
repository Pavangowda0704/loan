// ============================================================
//  modules/vehicleLoan/vehicleLoan.validation.js
// ============================================================

export function validateCreateVehicleLoan(body) {
  const { full_name, phone, vehicle_type, loan_amount, monthly_income } = body
  const errors = []
  if (!full_name)                         errors.push('full_name is required')
  if (!phone)                             errors.push('phone is required')
  else if (!/^[0-9]{10}$/.test(phone))    errors.push('phone must be exactly 10 digits')
  if (!vehicle_type)                      errors.push('vehicle_type is required')
  if (!loan_amount)                       errors.push('loan_amount is required')
  if (!monthly_income)                    errors.push('monthly_income is required')
  return errors
}
