// ============================================================
//  data/personalLoanData.js — Personal Loan static data
// ============================================================

export const personalLoanFeatures = [
  { label: 'Loan Amount', value: 'Up to ₹40 Lakhs' },
  { label: 'Interest Rate', value: 'Starting at 10.5% p.a.' },
  { label: 'Tenure', value: '12 – 60 months' },
  { label: 'Processing Fee', value: 'Up to 2% + GST' },
]

export const personalLoanPurposes = [
  'Medical Emergency',
  'Home Renovation',
  'Wedding',
  'Education',
  'Travel',
  'Debt Consolidation',
  'Business',
  'Other',
]

export const personalLoanEligibility = {
  minAge: 21,
  maxAge: 60,
  minIncome: 20000,
  employmentTypes: ['Salaried', 'Self-Employed'],
}
