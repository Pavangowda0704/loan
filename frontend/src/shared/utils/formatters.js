// ============================================================
//  shared/utils/formatters.js — Common formatting helpers
// ============================================================

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' })
}

export const formatStatus = (status) => {
  const map = { Pending: '⏳ Pending', 'Under Review': '🔍 Under Review', Approved: '✅ Approved', Rejected: '❌ Rejected', Disbursed: '💰 Disbursed' }
  return map[status] || status
}

export const truncate = (str, max = 30) =>
  str && str.length > max ? str.slice(0, max) + '…' : str
