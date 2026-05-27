// ============================================================
//  shared/utils/generateApplicationId.js
// ============================================================

/**
 * Generate a unique application ID.
 * @param {'personal'|'vehicle'|'home'|'business'} type
 */
export function generateApplicationId(type = 'personal') {
  const prefixes = { personal: 'PLN', vehicle: 'VLN', home: 'HLN', business: 'BLN' }
  const prefix = prefixes[type] || 'LNE'
  const rand = Math.floor(Math.random() * 90 + 10)
  return `${prefix}${Date.now()}${rand}`
}
