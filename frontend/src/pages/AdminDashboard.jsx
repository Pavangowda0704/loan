// ============================================================
//  pages/AdminDashboard.jsx — Unified LoanEase Admin Dashboard
//
//  Features added:
//    • "View Details" button opens a 2-panel modal:
//        Left  — all application fields (Applicant, Loan, Employment)
//        Right — uploaded documents list with View + Download
//    • document count shown in the table
//    • document preview (iframe for PDF, img for images)
//    • Status update section preserved
//
//  Route: /admin
// ============================================================

import { useEffect, useState, useCallback } from "react";
import {
  getPersonalLoanApplications,
  updatePersonalLoanStatus,
  getPersonalLoanDetails,
} from "../api/personalLoanApi.js";
import {
  getVehicleLoanApplications,
  updateVehicleLoanStatus,
  getVehicleLoanDetails,
} from "../api/vehicleLoanApi.js";
import "../styles/personalLoan.css";
import "../styles/adminDashboard.css";

// Derive the backend root URL from the same VITE_API_BASE_URL env var
// Local:      VITE_API_BASE_URL = http://localhost:5000/api  → http://localhost:5000
// Production: VITE_API_BASE_URL = https://your.render.com/api → https://your.render.com
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

const STATUS_OPTIONS = [
  "Pending",
  "Under Review",
  "Document Verification",
  "Approved",
  "Rejected",
  "Disbursed",
];

const STATUS_COLORS = {
  Pending:                 { bg: "#fef3c7", color: "#92400e" },
  "Under Review":          { bg: "#dbeafe", color: "#1e40af" },
  "Document Verification": { bg: "#ede9fe", color: "#5b21b6" },
  Approved:                { bg: "#d1fae5", color: "#065f46" },
  Rejected:                { bg: "#fee2e2", color: "#991b1b" },
  Disbursed:               { bg: "#d1fae5", color: "#064e3b" },
};

const ALL_TABS = [
  "All", "Personal Loans", "Vehicle Loans",
  "Pending", "Under Review", "Document Verification",
  "Approved", "Rejected", "Disbursed",
];

function fmt(val) {
  if (val === null || val === undefined || val === "") return "—";
  return val;
}

function fmtMoney(val) {
  if (!val) return "—";
  return `₹${Number(val).toLocaleString("en-IN")}`;
}

function fmtDate(val) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-IN");
}

function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span className="admin-status-badge" style={{ background: style.bg, color: style.color }}>
      {status}
    </span>
  );
}

// ─── Document row in the detail modal ────────────────────────────────────────
function DocRow({ doc, index, onPreview }) {
  // file_url is now a full Cloudinary URL — use directly
  const fileUrl = doc.file_url || null;
  const isPdf   = doc.file_type?.includes("pdf");

  return (
    <tr>
      <td style={{ padding: "10px 12px", color: "#66738d", fontSize: 13 }}>{index + 1}</td>
      <td style={{ padding: "10px 12px", fontWeight: 700, fontSize: 13, color: "#071b46" }}>
        {fmt(doc.document_name).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
      </td>
      <td style={{ padding: "10px 12px", fontSize: 12.5, color: "#374151" }}>
        {fmt(doc.file_name)}
      </td>
      <td style={{ padding: "10px 12px", fontSize: 12, color: "#66738d" }}>
        {doc.file_type || "—"}
      </td>
      <td style={{ padding: "10px 12px", fontSize: 12, color: "#66738d", whiteSpace: "nowrap" }}>
        {doc.file_size_kb ? `${doc.file_size_kb} KB` : "—"}
      </td>
      <td style={{ padding: "10px 12px", fontSize: 12, color: "#66738d", whiteSpace: "nowrap" }}>
        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
      </td>
      <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
        {fileUrl ? (
          <div style={{ display: "flex", gap: 6 }}>
            <button
              className="doc-action-btn view"
              onClick={() => onPreview(fileUrl, doc.file_type)}
            >
              👁 View
            </button>
            <a
              className="doc-action-btn download"
              href={fileUrl}
              download={doc.file_name || "document"}
              target="_blank"
              rel="noreferrer"
            >
              ⬇ Download
            </a>
          </div>
        ) : (
          <span style={{ color: "#aaa", fontSize: 12 }}>No file</span>
        )}
      </td>
    </tr>
  );
}

// ─── Detail modal ─────────────────────────────────────────────────────────────
function DetailModal({ app, loanType, onClose, onStatusUpdate }) {
  const [detailData, setDetailData] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [status,  setStatus]   = useState(app.status);
  const [remarks, setRemarks]  = useState(app.remarks || "");
  const [saving,  setSaving]   = useState(false);
  const [previewUrl,  setPreviewUrl]  = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [activeSection, setActiveSection] = useState("details"); // "details" | "documents"

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const fn = loanType === "vehicle" ? getVehicleLoanDetails : getPersonalLoanDetails;
        const res = await fn(app.application_id);
        setDetailData(res.data);
      } catch {
        setDetailData(app); // fallback to list data
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDetails();
  }, [app.application_id, loanType]);

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

  const data  = detailData || app;
  const docs  = detailData?.documents || [];
  const isVehicle = loanType === "vehicle";

  const applicantRows = isVehicle
    ? [
        ["Full Name",   data.full_name],
        ["Phone",       data.phone],
        ["Email",       data.email],
        ["Date of Birth", fmtDate(data.dob)],
        ["PAN Number",  data.pan_number],
        ["City",        data.city],
        ["Nationality", "Indian"],
      ]
    : [
        ["Full Name",   data.full_name],
        ["Father's Name", data.father_name || "—"],
        ["Date of Birth", fmtDate(data.dob)],
        ["Gender",      data.gender || "—"],
        ["Marital Status", data.marital_status || "—"],
        ["Mobile",      data.phone || data.mobile],
        ["Email",       data.email],
        ["Alternate Mobile", data.alternate_mobile || "—"],
        ["PAN Number",  data.pan_number || data.pan],
        ["Aadhaar Number", data.aadhaar_number || "—"],
        ["Address",     data.address || "—"],
        ["City",        data.city],
        ["State",       data.state || "—"],
        ["Pincode",     data.pincode || "—"],
        ["Nationality", "Indian"],
      ];

  const loanRows = isVehicle
    ? [
        ["Loan Amount",       fmtMoney(data.loan_amount)],
        ["Vehicle Type",      data.vehicle_type],
        ["Vehicle Condition", data.vehicle_condition],
        ["Vehicle Price",     fmtMoney(data.vehicle_price)],
        ["Down Payment",      fmtMoney(data.down_payment)],
        ["Tenure",            data.tenure ? `${data.tenure} months` : "—"],
        ["Employment Type",   data.employment_type],
        ["Monthly Income",    fmtMoney(data.monthly_income)],
      ]
    : [
        ["Loan Amount",     fmtMoney(data.loan_amount || data.required_amount)],
        ["Loan Product",    data.loan_product || "Personal Loan"],
        ["Purpose",         data.loan_purpose || data.purpose],
        ["Tenure",          data.tenure ? `${data.tenure} months` : "—"],
        ["Employment Type", data.employment_type],
        ["Company Name",    data.company_name],
        ["Work Experience", data.work_experience],
        ["Monthly Income",  fmtMoney(data.monthly_income)],
        ["Existing EMI",    fmtMoney(data.existing_emi)],
        ["Interest Rate (%)", data.interest_rate || "—"],
      ];

  const FieldSection = ({ title, rows }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: 800, fontSize: 13, color: "#1455d9", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {title}
      </div>
      <div className="modal-detail-grid">
        {rows.map(([label, val]) => (
          <div className="modal-detail-row" key={label}>
            <span className="modal-label">{label}</span>
            <span className="modal-val">{fmt(val)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 860, width: "95vw" }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 11, color: "#1455d9", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
              {isVehicle ? "🚗 Vehicle Loan" : "💰 Personal Loan"} Application
            </div>
            <h2 style={{ margin: 0 }}>{data.application_id}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StatusBadge status={data.status} />
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Section tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e6edff", paddingLeft: 26 }}>
          {["details", "documents"].map(sec => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              style={{
                border: "none",
                background: "transparent",
                padding: "12px 18px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                borderBottom: activeSection === sec ? "2px solid #1455d9" : "2px solid transparent",
                color: activeSection === sec ? "#1455d9" : "#66738d",
                marginBottom: -1,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {sec === "details" ? "📋 Application Details" : `📄 Documents (${loadingDocs ? "…" : docs.length})`}
            </button>
          ))}
        </div>

        <div className="modal-body" style={{ maxHeight: "68vh", overflowY: "auto" }}>

          {/* ── DETAILS SECTION ── */}
          {activeSection === "details" && (
            <>
              <FieldSection title="Applicant Information" rows={applicantRows} />
              <FieldSection title="Loan Information" rows={loanRows} />

              {/* Status Update */}
              <div className="modal-update-section">
                <h3>Update Status</h3>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
                <textarea
                  placeholder="Add remarks (optional)…"
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  rows={3}
                />
                <button className="pl-primary-btn" onClick={save} disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </>
          )}

          {/* ── DOCUMENTS SECTION ── */}
          {activeSection === "documents" && (
            <div>
              {loadingDocs ? (
                <p style={{ textAlign: "center", padding: 32, color: "#66738d" }}>Loading documents…</p>
              ) : docs.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                  <p style={{ color: "#66738d" }}>No documents uploaded yet for this application.</p>
                </div>
              ) : (
                <>
                  <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #e6edff", marginBottom: 20 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                      <thead>
                        <tr style={{ background: "#f0f5ff" }}>
                          {["#", "Document Type", "Original File Name", "File Type", "File Size", "Uploaded On", "Actions"].map(h => (
                            <th key={h} style={{ padding: "11px 12px", textAlign: "left", fontSize: 11, fontWeight: 800, color: "#66738d", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {docs.map((doc, i) => (
                          <DocRow
                            key={doc.id}
                            doc={doc}
                            index={i}
                            onPreview={(url, type) => { setPreviewUrl(url); setPreviewType(type); }}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Inline preview */}
                  {previewUrl && (
                    <div style={{ border: "1px solid #e6edff", borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ padding: "10px 16px", background: "#f0f5ff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: "#071b46" }}>Document Preview</span>
                        <button
                          onClick={() => setPreviewUrl(null)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#66738d", fontWeight: 700 }}
                        >
                          ✕ Close Preview
                        </button>
                      </div>
                      {previewType?.includes("image") ? (
                        <img
                          src={previewUrl}
                          alt="Document preview"
                          style={{ width: "100%", maxHeight: 500, objectFit: "contain", background: "#f8f8f8" }}
                        />
                      ) : (
                        <iframe
                          src={previewUrl}
                          title="Document preview"
                          style={{ width: "100%", height: 480, border: "none" }}
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
// ✅ ADDED: Simple admin password guard
const ADMIN_PASSWORD = 'loanease@admin2024'
const STORAGE_KEY = 'loanease_admin_auth'

function AdminLogin({ onSuccess }) {
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState(false)
  const submit = () => {
    if (pwd === ADMIN_PASSWORD) { sessionStorage.setItem(STORAGE_KEY, '1'); onSuccess() }
    else { setErr(true); setTimeout(() => setErr(false), 2000) }
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7ff' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem', width: 360, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#071b46', marginBottom: 6 }}>Admin Access</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>Enter password to continue</p>
        <input
          type="password" value={pwd} onChange={e => setPwd(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Admin password"
          style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${err ? '#ef4444' : '#d1d5db'}`, borderRadius: 10, fontSize: 15, marginBottom: 12, outline: 'none', fontFamily: 'inherit' }}
          autoFocus
        />
        {err && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 8 }}>Incorrect password</p>}
        <button onClick={submit}
          style={{ width: '100%', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Login →
        </button>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem(STORAGE_KEY))
  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />

  return <AdminDashboardInner />
}

function AdminDashboardInner() {
  const [personalApps, setPersonalApps] = useState([]);
  const [vehicleApps,  setVehicleApps]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [activeTab, setActiveTab]     = useState("All");
  const [selectedApp,  setSelectedApp]  = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const fetchAll = useCallback(async () => {
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
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleStatusUpdate = async (appId, data, loanType) => {
    if (loanType === "vehicle") {
      await updateVehicleLoanStatus(appId, data);
    } else {
      await updatePersonalLoanStatus(appId, data);
    }
    await fetchAll();
  };

  const combined = [
    ...personalApps.map(a => ({ ...a, _loanType: "personal" })),
    ...vehicleApps.map( a => ({ ...a, _loanType: "vehicle"  })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filtered = combined.filter(a => {
    if (activeTab === "All")            return true;
    if (activeTab === "Personal Loans") return a._loanType === "personal";
    if (activeTab === "Vehicle Loans")  return a._loanType === "vehicle";
    return a.status === activeTab;
  });

  const counts = {
    All:           combined.length,
    "Personal Loans": personalApps.length,
    "Vehicle Loans":  vehicleApps.length,
    Pending:                 combined.filter(a => a.status === "Pending").length,
    "Under Review":          combined.filter(a => a.status === "Under Review").length,
    "Document Verification": combined.filter(a => a.status === "Document Verification").length,
    Approved:                combined.filter(a => a.status === "Approved").length,
    Rejected:                combined.filter(a => a.status === "Rejected").length,
    Disbursed:               combined.filter(a => a.status === "Disbursed").length,
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
          {ALL_TABS.map(tab => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {counts[tab] > 0 && <span className="tab-count">{counts[tab]}</span>}
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
                  <th>#</th>
                  <th>Application ID</th>
                  <th>Applicant Name</th>
                  <th>Mobile Number</th>
                  <th>Loan Amount</th>
                  <th>Purpose / Type</th>
                  <th>Status</th>
                  <th>Applied On</th>
                  <th>Documents</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, idx) => {
                  const loanLabel = app._loanType === "vehicle"
                    ? (app.vehicle_type || "Vehicle Loan")
                    : (app.loan_purpose || app.loan_product || "Personal Loan");

                  const amount = app.loan_amount || app.required_amount || 0;
                  const docCount = app.document_count ?? "—";

                  return (
                    <tr key={app.application_id}>
                      <td style={{ color: "#66738d", fontWeight: 600, fontSize: 12 }}>{idx + 1}</td>
                      <td>
                        <span className="app-id-chip">{app.application_id}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{app.full_name}</td>
                      <td>{app.phone || app.mobile}</td>
                      <td style={{ fontWeight: 700 }}>{fmtMoney(amount)}</td>
                      <td>
                        <span className={`loan-type-chip ${app._loanType}`}>
                          {app._loanType === "vehicle" ? "🚗" : "💰"} {loanLabel}
                        </span>
                      </td>
                      <td><StatusBadge status={app.status} /></td>
                      <td style={{ whiteSpace: "nowrap", fontSize: 13, color: "#66738d" }}>
                        {new Date(app.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td>
                        <span style={{
                          background: docCount > 0 ? "#eef4ff" : "#f3f4f6",
                          color: docCount > 0 ? "#1455d9" : "#9ca3af",
                          borderRadius: 8,
                          padding: "3px 10px",
                          fontSize: 12.5,
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}>
                          📄 {docCount}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-action-btn"
                          onClick={() => { setSelectedApp(app); setSelectedType(app._loanType); }}
                        >
                          View Details
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

