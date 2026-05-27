// ============================================================
//  pages/AdminDashboard.jsx — Unified LoanEase Admin Dashboard
//
//  Fetches both personal and vehicle loan applications.
//  Tabs: All | Personal Loans | Vehicle Loans | By Status
//  Admin can update status + add remarks for each application.
//  Route: /admin
// ============================================================

import { useEffect, useState } from "react";
import { getPersonalLoanApplications, updatePersonalLoanStatus } from "../api/personalLoanApi.js";
import { getVehicleLoanApplications, updateVehicleLoanStatus }   from "../api/vehicleLoanApi.js";
import "../styles/personalLoan.css";
import "../styles/adminDashboard.css";

const STATUS_OPTIONS = [
  "Pending",
  "Under Review",
  "Document Verification",
  "Approved",
  "Rejected",
  "Disbursed",
];

const STATUS_COLORS = {
  Pending:               { bg: "#fef3c7", color: "#92400e" },
  "Under Review":        { bg: "#dbeafe", color: "#1e40af" },
  "Document Verification": { bg: "#ede9fe", color: "#5b21b6" },
  Approved:              { bg: "#d1fae5", color: "#065f46" },
  Rejected:              { bg: "#fee2e2", color: "#991b1b" },
  Disbursed:             { bg: "#d1fae5", color: "#064e3b" },
};

const ALL_TABS   = ["All", "Personal Loans", "Vehicle Loans", "Pending", "Under Review", "Document Verification", "Approved", "Rejected", "Disbursed"];

function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span className="admin-status-badge" style={{ background: style.bg, color: style.color }}>
      {status}
    </span>
  );
}

function DetailModal({ app, loanType, onClose, onStatusUpdate }) {
  const [status, setStatus]   = useState(app.status);
  const [remarks, setRemarks] = useState(app.remarks || "");
  const [saving, setSaving]   = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onStatusUpdate(app.application_id, { status, remarks }, loanType);
      onClose();
    } catch {
      alert("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const isVehicle = loanType === "vehicle";
  const rows = isVehicle
    ? [
        ["Application ID", app.application_id],
        ["Full Name",      app.full_name],
        ["Phone",          app.phone],
        ["Email",          app.email || "—"],
        ["City",           app.city  || "—"],
        ["Vehicle Type",   app.vehicle_type],
        ["Vehicle Condition", app.vehicle_condition],
        ["Vehicle Price",  app.vehicle_price ? `₹${Number(app.vehicle_price).toLocaleString("en-IN")}` : "—"],
        ["Down Payment",   app.down_payment  ? `₹${Number(app.down_payment).toLocaleString("en-IN")}`  : "—"],
        ["Loan Amount",    app.loan_amount   ? `₹${Number(app.loan_amount).toLocaleString("en-IN")}`   : "—"],
        ["Monthly Income", app.monthly_income? `₹${Number(app.monthly_income).toLocaleString("en-IN")}`: "—"],
        ["Employment",     app.employment_type || "—"],
        ["Tenure",         app.tenure ? `${app.tenure} months` : "—"],
        ["Applied On",     new Date(app.created_at).toLocaleDateString("en-IN")],
      ]
    : [
        ["Application ID", app.application_id],
        ["Full Name",      app.full_name],
        ["Phone",          app.phone || app.mobile],
        ["Email",          app.email || "—"],
        ["City",           app.city  || "—"],
        ["PAN",            app.pan_number || app.pan || "—"],
        ["Employment",     app.employment_type || "—"],
        ["Company",        app.company_name || "—"],
        ["Monthly Income", app.monthly_income ? `₹${Number(app.monthly_income).toLocaleString("en-IN")}` : "—"],
        ["Loan Product",   app.loan_product  || "Personal Loan"],
        ["Loan Amount",    app.loan_amount   ? `₹${Number(app.loan_amount).toLocaleString("en-IN")}` : "—"],
        ["Tenure",         app.tenure ? `${app.tenure} months` : "—"],
        ["Purpose",        app.loan_purpose || "—"],
        ["Applied On",     new Date(app.created_at).toLocaleDateString("en-IN")],
      ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Application Details</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-detail-grid">
            {rows.map(([label, val]) => (
              <div className="modal-detail-row" key={label}>
                <span className="modal-label">{label}</span>
                <span className="modal-val">{val}</span>
              </div>
            ))}
          </div>

          <div className="modal-update-section">
            <h3>Update Status</h3>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <textarea
              placeholder="Add remarks (optional)…"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
            <button className="pl-primary-btn" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [personalApps, setPersonalApps] = useState([]);
  const [vehicleApps,  setVehicleApps]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [activeTab, setActiveTab]   = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, vRes] = await Promise.all([
        getPersonalLoanApplications(),
        getVehicleLoanApplications(),
      ]);
      setPersonalApps(pRes.data || []);
      setVehicleApps(vRes.data  || []);
    } catch {
      setError("Failed to load applications. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleStatusUpdate = async (appId, data, loanType) => {
    if (loanType === "vehicle") {
      await updateVehicleLoanStatus(appId, data);
    } else {
      await updatePersonalLoanStatus(appId, data);
    }
    await fetchAll();
  };

  // Build combined list
  const combined = [
    ...personalApps.map((a) => ({ ...a, _loanType: "personal" })),
    ...vehicleApps.map( (a) => ({ ...a, _loanType: "vehicle"  })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filtered = combined.filter((a) => {
    if (activeTab === "All")            return true;
    if (activeTab === "Personal Loans") return a._loanType === "personal";
    if (activeTab === "Vehicle Loans")  return a._loanType === "vehicle";
    return a.status === activeTab;
  });

  const counts = {
    All:           combined.length,
    "Personal Loans": personalApps.length,
    "Vehicle Loans":  vehicleApps.length,
    Pending:           combined.filter((a) => a.status === "Pending").length,
    "Under Review":    combined.filter((a) => a.status === "Under Review").length,
    "Document Verification": combined.filter((a) => a.status === "Document Verification").length,
    Approved:          combined.filter((a) => a.status === "Approved").length,
    Rejected:          combined.filter((a) => a.status === "Rejected").length,
    Disbursed:         combined.filter((a) => a.status === "Disbursed").length,
  };

  if (loading) return <section className="pl-page"><p className="track-loading">Loading dashboard…</p></section>;
  if (error)   return <section className="pl-page"><p style={{ color: "red", padding: 32 }}>{error}</p></section>;

  return (
    <section className="pl-page admin-page">
      <div className="admin-card">
        <div className="admin-header">
          <div>
            <span className="pl-tag">Admin Dashboard</span>
            <h1>Loan Application Management</h1>
          </div>
          <button className="pl-secondary-btn" onClick={fetchAll}>↻ Refresh</button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <h2>{combined.length}</h2>
            <p>Total Applications</p>
          </div>
          <div className="stat-card personal">
            <h2>{personalApps.length}</h2>
            <p>Personal Loans</p>
          </div>
          <div className="stat-card vehicle">
            <h2>{vehicleApps.length}</h2>
            <p>Vehicle Loans</p>
          </div>
          <div className="stat-card approved">
            <h2>{counts.Approved}</h2>
            <p>Approved</p>
          </div>
          <div className="stat-card pending">
            <h2>{counts.Pending}</h2>
            <p>Pending</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {ALL_TABS.map((tab) => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {counts[tab] > 0 && (
                <span className="tab-count">{counts[tab]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="admin-table-wrap">
          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", padding: 40, color: "#66738d" }}>
              No applications found for this filter.
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Applicant Name</th>
                  <th>Mobile</th>
                  <th>Loan Type</th>
                  <th>Loan Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => {
                  const loanLabel = app._loanType === "vehicle"
                    ? (app.vehicle_type || "Vehicle Loan")
                    : (app.loan_product || "Personal Loan");

                  const amount = app.loan_amount || app.required_amount || 0;

                  return (
                    <tr key={app.application_id}>
                      <td>
                        <span className="app-id-chip">{app.application_id}</span>
                      </td>
                      <td>{app.full_name}</td>
                      <td>{app.phone || app.mobile}</td>
                      <td>
                        <span className={`loan-type-chip ${app._loanType}`}>
                          {app._loanType === "vehicle" ? "🚗" : "💰"} {loanLabel}
                        </span>
                      </td>
                      <td>₹{Number(amount).toLocaleString("en-IN")}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td>{new Date(app.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                      <td>
                        <button
                          className="admin-action-btn"
                          onClick={() => { setSelectedApp(app); setSelectedType(app._loanType); }}
                        >
                          View / Update
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedApp && (
        <DetailModal
          app={selectedApp}
          loanType={selectedType}
          onClose={() => { setSelectedApp(null); setSelectedType(null); }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </section>
  );
}

export default AdminDashboard;
