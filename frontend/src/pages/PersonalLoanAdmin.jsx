// ============================================================
//  pages/PersonalLoanAdmin.jsx — Admin Dashboard
//
//  Shows all personal loan applications in a table.
//  Admin can update the status of each application.
//
//  Route: /admin/personal-loans
//
//  Fixes applied vs original:
//    - app.phone → app.mobile  (matches DB column name)
//    - app.loan_amount → app.required_amount (correct field)
//    - Added loading + error states
// ============================================================

import { useEffect, useState } from 'react'
import { getPersonalLoans, updatePersonalLoanStatus } from '../api/personalLoanApi.js'
import '../styles/personalLoan.css'

function PersonalLoanAdmin() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const res = await getPersonalLoans()
      setApplications(res.data)
    } catch (err) {
      setError('Failed to load applications. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchApplications() }, [])

  const updateStatus = async (applicationId, status) => {
    const remarks = prompt('Add remarks (optional)') || ''
    try {
      await updatePersonalLoanStatus(applicationId, { status, remarks })
      fetchApplications()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  if (loading) return <section className="pl-page"><p>Loading applications...</p></section>
  if (error)   return <section className="pl-page"><p style={{ color: 'red' }}>{error}</p></section>

  return (
    <section className="pl-page">
      <div className="admin-card">
        <span className="pl-tag">Admin Dashboard</span>
        <h1>Personal Loan Applications</h1>
        <p>{applications.length} application(s) found</p>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Loan Product</th>
                <th>Employment</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.application_id}>
                  <td>{app.application_id}</td>
                  <td>{app.full_name}</td>
                  <td>{app.mobile}</td>
                  <td>{app.loan_product}</td>
                  <td>{app.employment_type || '—'}</td>
                  <td>{app.required_amount ? Number(app.required_amount).toLocaleString('en-IN') : '—'}</td>
                  <td>{app.status}</td>
                  <td>{new Date(app.created_at).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.application_id, e.target.value)}
                    >
                      <option>Under Review</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                      <option>Disbursed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default PersonalLoanAdmin
