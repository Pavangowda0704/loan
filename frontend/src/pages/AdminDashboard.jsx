// ============================================================
//  pages/AdminDashboard.jsx — Unified LoanEase Admin Dashboard
//  With advanced filters: search, loan type, employment, status
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
import {
  getHomeLoanApplications,
  updateHomeLoanStatus,
  getHomeLoanDetails,
} from "../api/homeLoanApi.js";
import {
  getBusinessLoanApplications,
  updateBusinessLoanStatus,
  getBusinessLoanDetails,
} from "../api/businessLoanApi.js";
import API from "../api/axiosInstance.js";
import "../styles/personalLoan.css";
import "../styles/adminDashboard.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

const STATUS_OPTIONS = ["Pending","Under Review","Document Verification","Approved","Rejected","Disbursed"];

const STATUS_COLORS = {
  Pending:                 { bg: "#fef3c7", color: "#92400e" },
  "Under Review":          { bg: "#dbeafe", color: "#1e40af" },
  "Document Verification": { bg: "#ede9fe", color: "#5b21b6" },
  Approved:                { bg: "#d1fae5", color: "#065f46" },
  Rejected:                { bg: "#fee2e2", color: "#991b1b" },
  Disbursed:               { bg: "#d1fae5", color: "#064e3b" },
};

// ── Loan products per type (for sub-filter) ──────────────────
const LOAN_PRODUCTS = {
  personal: [
    "Salaried Personal Loan",
    "Self-Employed Personal Loan",
  ],
  vehicle: [
    "New Car Purchase Loan",
    "Used Car Loan",
    "Used Bike Loan",
    "Commercial Vehicle Loan",
    "Agriculture Equipment Loan",
  ],
  home: [
    "Home Loan",
    "Loan Against Property (LAP)",
    "Mortgage Loan",
    "Site Purchase Loan",
    "Balance Transfer & Top-Up",
    "New House Refinance",
    "House Purchase Loan",
    "Construction Loan",
    "Mixed Usage Property Loan",
  ],
  business: [
    "Secured Business Loan",
    "Unsecured Business Loan",
    "Working Capital Loan",
    "Business Expansion Loan",
  ],
};

const EMPTY_FILTERS = { search: "", loanType: "", employment: "", status: "", amountRange: "", loanProduct: "" };

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

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({ filters, onChange, onClear, totalShown, totalAll, activeSection }) {
  const hasActive = filters.search || filters.loanType || filters.employment || filters.status || filters.loanProduct;
  return (
    <div style={{ background: "#fff", border: "1px solid #e6edff", borderRadius: 14, padding: "16px 18px", marginBottom: 16, boxShadow: "0 1px 4px rgba(7,27,70,0.05)" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>

        {/* Search */}
        <div style={{ flex: "2 1 200px", minWidth: 180 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#66738d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Search</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14 }}>🔍</span>
            <input
              placeholder="Name, email, phone, app ID…"
              value={filters.search}
              onChange={e => onChange("search", e.target.value)}
              style={{ width: "100%", padding: "8px 12px 8px 30px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Loan Type — only shown in All Applications */}
        {activeSection === "all" && (
          <div style={{ flex: "1 1 140px", minWidth: 130 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#66738d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Loan Type</div>
            <select value={filters.loanType} onChange={e => onChange("loanType", e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", outline: "none", background: "#fff", cursor: "pointer" }}>
              <option value="">All Types</option>
              <option value="personal">💰 Personal Loan</option>
              <option value="vehicle">🚗 Vehicle Loan</option>
              <option value="home">🏠 Home Loan</option>
              <option value="business">💼 Business Loan</option>
            </select>
          </div>
        )}

        {/* Loan Product — only shown inside a specific loan type section */}
        {LOAN_PRODUCTS[activeSection] && (
          <div style={{ flex: "1 1 200px", minWidth: 180 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#66738d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Loan Product</div>
            <select value={filters.loanProduct} onChange={e => onChange("loanProduct", e.target.value)}
              style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", outline: "none", background: "#fff", cursor: "pointer" }}>
              <option value="">All Products</option>
              {LOAN_PRODUCTS[activeSection].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        )}

        {/* Employment Type */}
        <div style={{ flex: "1 1 150px", minWidth: 140 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#66738d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Employment Type</div>
          <select value={filters.employment} onChange={e => onChange("employment", e.target.value)}
            style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", outline: "none", background: "#fff", cursor: "pointer" }}>
            <option value="">All Employment</option>
            <option value="Salaried">💼 Salaried</option>
            <option value="Self-Employed">🏢 Self-Employed</option>
            <option value="Business Owner">🏭 Business Owner</option>
            <option value="Freelancer">💻 Freelancer</option>
          </select>
        </div>

        {/* Status */}
        <div style={{ flex: "1 1 150px", minWidth: 140 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#66738d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Status</div>
          <select value={filters.status} onChange={e => onChange("status", e.target.value)}
            style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", outline: "none", background: "#fff", cursor: "pointer" }}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Amount Range */}
        <div style={{ flex: "1 1 140px", minWidth: 130 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#66738d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Loan Amount</div>
          <select value={filters.amountRange} onChange={e => onChange("amountRange", e.target.value)}
            style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", outline: "none", background: "#fff", cursor: "pointer" }}>
            <option value="">Any Amount</option>
            <option value="0-100000">Under ₹1L</option>
            <option value="100000-500000">₹1L – ₹5L</option>
            <option value="500000-1000000">₹5L – ₹10L</option>
            <option value="1000000-5000000">₹10L – ₹50L</option>
            <option value="5000000+">Above ₹50L</option>
          </select>
        </div>

        {/* Clear button */}
        {hasActive && (
          <div style={{ flex: "0 0 auto", alignSelf: "flex-end" }}>
            <button onClick={onClear}
              style={{ padding: "8px 16px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              ✕ Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Result count */}
      <div style={{ marginTop: 10, fontSize: 12.5, color: "#66738d" }}>
        Showing <strong style={{ color: "#071b46" }}>{totalShown}</strong> of <strong style={{ color: "#071b46" }}>{totalAll}</strong> applications
        {hasActive && <span style={{ color: "#1455d9", fontWeight: 600 }}> (filtered)</span>}
      </div>
    </div>
  );
}

// ─── Document row ─────────────────────────────────────────────────────────────
function DocRow({ doc, index, onPreview }) {
  const rawUrl  = doc.file_url || doc.file_path || "";
  const fileUrl = rawUrl
    ? rawUrl.startsWith("http") ? rawUrl
      : `${API_BASE}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`
    : null;
  const isPdf = doc.file_type?.includes("pdf");

  return (
    <tr>
      <td style={{ padding: "10px 12px", color: "#66738d", fontSize: 13 }}>{index + 1}</td>
      <td style={{ padding: "10px 12px", fontWeight: 700, fontSize: 13, color: "#071b46" }}>
        {fmt(doc.document_name).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
      </td>
      <td style={{ padding: "10px 12px", fontSize: 12.5, color: "#374151" }}>{fmt(doc.file_name)}</td>
      <td style={{ padding: "10px 12px", fontSize: 12, color: "#66738d" }}>{doc.file_type || "—"}</td>
      <td style={{ padding: "10px 12px", fontSize: 12, color: "#66738d", whiteSpace: "nowrap" }}>
        {doc.file_size_kb ? `${doc.file_size_kb} KB` : "—"}
      </td>
      <td style={{ padding: "10px 12px", fontSize: 12, color: "#66738d", whiteSpace: "nowrap" }}>
        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
      </td>
      <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
        {fileUrl ? (
          <div style={{ display: "flex", gap: 6 }}>
            <button className="doc-action-btn view"
              onClick={() => isPdf ? window.open(fileUrl, "_blank", "noopener,noreferrer") : onPreview(fileUrl, doc.file_type)}>
              👁 View
            </button>
            <a className="doc-action-btn download" href={fileUrl} download={doc.file_name || "document"} target="_blank" rel="noreferrer">
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

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ app, loanType, onClose, onStatusUpdate }) {
  const [detailData,    setDetailData]    = useState(null);
  const [loadingDocs,   setLoadingDocs]   = useState(true);
  const [status,        setStatus]        = useState(app.status);
  const [remarks,       setRemarks]       = useState(app.remarks || "");
  const [saving,        setSaving]        = useState(false);
  const [previewUrl,    setPreviewUrl]    = useState(null);
  const [previewType,   setPreviewType]   = useState(null);
  const [activeSection, setActiveSection] = useState("details");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const fn =
          loanType === "vehicle"  ? getVehicleLoanDetails  :
          loanType === "home"     ? getHomeLoanDetails      :
          loanType === "business" ? getBusinessLoanDetails  :
                                    getPersonalLoanDetails;
        const res = await fn(app.application_id);
        setDetailData(res.data);
      } catch {
        setDetailData(app);
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

  const data = detailData || app;
  const docs = detailData?.documents || detailData?.data?.documents || detailData?.application?.documents || [];
  const isVehicle  = loanType === "vehicle";
  const isHome     = loanType === "home";
  const isBusiness = loanType === "business";

  const loanTypeLabel =
    isVehicle  ? "🚗 Vehicle Loan"  :
    isHome     ? "🏠 Home Loan"     :
    isBusiness ? "💼 Business Loan" :
                 "💰 Personal Loan";

  const applicantRows = isVehicle
    ? [["Full Name",data.full_name],["Phone",data.phone],["Email",data.email],["Date of Birth",fmtDate(data.dob)],["PAN Number",data.pan_number],["City",data.city],["Nationality","Indian"]]
    : [["Full Name",data.full_name],["Father's Name",data.father_name||"—"],["Date of Birth",fmtDate(data.dob)],["Gender",data.gender||"—"],["Marital Status",data.marital_status||"—"],["Mobile",data.phone||data.mobile],["Email",data.email],["Alternate Mobile",data.alternate_mobile||"—"],["PAN Number",data.pan_number||data.pan],["Aadhaar Number",data.aadhaar_number||"—"],["Address",data.address||"—"],["City",data.city],["State",data.state||"—"],["Pincode",data.pincode||"—"],["Nationality","Indian"]];

  const loanRows = isVehicle
    ? [["Loan Amount",fmtMoney(data.loan_amount)],["Vehicle Type",data.vehicle_type],["Vehicle Condition",data.vehicle_condition],["Vehicle Price",fmtMoney(data.vehicle_price)],["Down Payment",fmtMoney(data.down_payment)],["Tenure",data.tenure?`${data.tenure} months`:"—"],["Employment Type",data.employment_type],["Monthly Income",fmtMoney(data.monthly_income)]]
    : isHome
    ? [["Loan Amount",fmtMoney(data.loan_amount||data.required_amount)],["Loan Type",data.loan_type||"Home Loan"],["Property Type",data.property_type||"—"],["Property Location",data.property_location||data.city||"—"],["Property Value",fmtMoney(data.property_value)],["Tenure",data.tenure?`${data.tenure} months`:"—"],["Employment Type",data.employment_type],["Monthly Income",fmtMoney(data.monthly_income)],["Existing EMI",fmtMoney(data.existing_emi)],["Interest Rate (%)",data.interest_rate||"—"]]
    : isBusiness
    ? [["Loan Amount",fmtMoney(data.loan_amount||data.required_amount)],["Loan Type",data.loan_type||"Business Loan"],["Business Name",data.business_name||"—"],["Business Type",data.business_type||"—"],["Years in Business",data.years_in_business||"—"],["Annual Turnover",fmtMoney(data.annual_turnover)],["Tenure",data.tenure?`${data.tenure} months`:"—"],["Monthly Income",fmtMoney(data.monthly_income)],["Existing EMI",fmtMoney(data.existing_emi)],["Interest Rate (%)",data.interest_rate||"—"]]
    : [["Loan Amount",fmtMoney(data.loan_amount||data.required_amount)],["Loan Product",data.loan_product||"Personal Loan"],["Purpose",data.loan_purpose||data.purpose],["Tenure",data.tenure?`${data.tenure} months`:"—"],["Employment Type",data.employment_type],["Company Name",data.company_name],["Work Experience",data.work_experience],["Monthly Income",fmtMoney(data.monthly_income)],["Existing EMI",fmtMoney(data.existing_emi)],["Interest Rate (%)",data.interest_rate||"—"]];

  const FieldSection = ({ title, rows }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: 800, fontSize: 13, color: "#1455d9", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</div>
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
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 860, width: "95vw" }}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 11, color: "#1455d9", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
              {loanTypeLabel} Application
            </div>
            <h2 style={{ margin: 0 }}>{data.application_id}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StatusBadge status={data.status} />
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #e6edff", paddingLeft: 26 }}>
          {["details","documents"].map(sec => (
            <button key={sec} onClick={() => setActiveSection(sec)} style={{ border: "none", background: "transparent", padding: "12px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", borderBottom: activeSection === sec ? "2px solid #1455d9" : "2px solid transparent", color: activeSection === sec ? "#1455d9" : "#66738d", marginBottom: -1, display: "flex", alignItems: "center", gap: 6 }}>
              {sec === "details" ? "📋 Application Details" : `📄 Documents (${loadingDocs ? "…" : docs.length})`}
            </button>
          ))}
        </div>

        <div className="modal-body" style={{ maxHeight: "68vh", overflowY: "auto" }}>
          {activeSection === "details" && (
            <>
              {(app.user_email || app.user_phone) && (
                <div style={{ background: "#eef4ff", border: "1px solid #c7d9f8", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 32, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#1455d9", textTransform: "uppercase", letterSpacing: "0.05em", width: "100%", marginBottom: 6 }}>🔗 Registered Account</div>
                  {app.user_email && <div><div style={{ fontSize: 11, color: "#66738d", fontWeight: 600 }}>Email</div><div style={{ fontSize: 13.5, fontWeight: 700, color: "#071b46" }}>{app.user_email}</div></div>}
                  {app.user_phone && <div><div style={{ fontSize: 11, color: "#66738d", fontWeight: 600 }}>Phone</div><div style={{ fontSize: 13.5, fontWeight: 700, color: "#071b46" }}>{app.user_phone}</div></div>}
                </div>
              )}
              <FieldSection title="Applicant Information" rows={applicantRows} />
              <FieldSection title="Loan Information" rows={loanRows} />
              <div className="modal-update-section">
                <h3>Update Status</h3>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
                <textarea placeholder="Add remarks (optional)…" value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} />
                <button className="pl-primary-btn" onClick={save} disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </>
          )}
          {activeSection === "documents" && (
            <div>
              {loadingDocs ? (
                <p style={{ textAlign: "center", padding: 32, color: "#66738d" }}>Loading documents…</p>
              ) : docs.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                  <p style={{ color: "#66738d" }}>No documents uploaded yet.</p>
                </div>
              ) : (
                <>
                  <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #e6edff", marginBottom: 20 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                      <thead>
                        <tr style={{ background: "#f0f5ff" }}>
                          {["#","Document Type","File Name","File Type","Size","Uploaded On","Actions"].map(h => (
                            <th key={h} style={{ padding: "11px 12px", textAlign: "left", fontSize: 11, fontWeight: 800, color: "#66738d", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {docs.map((doc, i) => (
                          <DocRow key={doc.id} doc={doc} index={i}
                            onPreview={(url, type) => { setPreviewUrl(url); setPreviewType(type); }} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {previewUrl && (
                    <div style={{ border: "1px solid #e6edff", borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ padding: "10px 16px", background: "#f0f5ff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: "#071b46" }}>Document Preview</span>
                        <button onClick={() => setPreviewUrl(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#66738d", fontWeight: 700 }}>✕ Close</button>
                      </div>
                      {previewType?.includes("image") ? (
                        <img src={previewUrl} alt="preview" style={{ width: "100%", maxHeight: 500, objectFit: "contain", background: "#f8f8f8" }} />
                      ) : (
                        <iframe src={previewUrl} title="preview" style={{ width: "100%", height: 480, border: "none" }} />
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

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersContent() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    API.get("/auth/users")
      .then(res => setUsers(res.data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  if (loading) return <p className="track-loading">Loading users…</p>;

  return (
    <>
      <div className="admin-topbar">
        <div>
          <div className="admin-topbar__title">Registered Users</div>
          <div className="admin-topbar__subtitle">{users.length} total users</div>
        </div>
      </div>
      <div className="admin-stats" style={{ marginBottom: 20 }}>
        <div className="stat-card"><h2>{users.length}</h2><p>Total Users</p></div>
        <div className="stat-card approved"><h2>{users.filter(u => u.total_applications > 0).length}</h2><p>With Applications</p></div>
        <div className="stat-card pending"><h2>{users.filter(u => u.total_applications === 0).length}</h2><p>No Applications</p></div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input placeholder="Search by name, email or phone…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: "9px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13.5, width: "100%", maxWidth: 360, fontFamily: "inherit", outline: "none" }} />
      </div>
      {filtered.length === 0 ? (
        <div className="admin-empty"><div className="admin-empty__icon">👥</div><div className="admin-empty__title">No users found</div></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Registered On</th><th>Total Applications</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => (
                <tr key={u.id}>
                  <td style={{ color: "#66738d", fontWeight: 600, fontSize: 12 }}>{idx + 1}</td>
                  <td style={{ fontWeight: 700 }}>{u.name || "—"}</td>
                  <td style={{ fontSize: 13, color: "#374151" }}>{u.email || "—"}</td>
                  <td style={{ fontSize: 13, color: "#374151" }}>{u.phone || "—"}</td>
                  <td style={{ fontSize: 13, color: "#66738d", whiteSpace: "nowrap" }}>
                    {new Date(u.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <span style={{ background: u.total_applications > 0 ? "#eef4ff" : "#f3f4f6", color: u.total_applications > 0 ? "#1455d9" : "#9ca3af", borderRadius: 8, padding: "3px 12px", fontSize: 13, fontWeight: 700 }}>
                      {u.total_applications}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─── Admin Login ──────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'loanease@admin2024';
const STORAGE_KEY    = 'loanease_admin_auth';

function AdminLogin({ onSuccess }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState(false);
  const submit = () => {
    if (pwd === ADMIN_PASSWORD) { sessionStorage.setItem(STORAGE_KEY, '1'); onSuccess(); }
    else { setErr(true); setTimeout(() => setErr(false), 2000); }
  };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7ff' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem', width: 360, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#071b46', marginBottom: 6 }}>Admin Access</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>Enter password to continue</p>
        <input type="password" value={pwd} onChange={e => setPwd(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Admin password" autoFocus
          style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${err ? '#ef4444' : '#d1d5db'}`, borderRadius: 10, fontSize: 15, marginBottom: 12, outline: 'none', fontFamily: 'inherit' }} />
        {err && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 8 }}>Incorrect password</p>}
        <button onClick={submit} style={{ width: '100%', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Login →
        </button>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem(STORAGE_KEY));
  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;
  return <AdminDashboardInner />;
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function AdminDashboardInner() {
  const [personalApps, setPersonalApps] = useState([]);
  const [vehicleApps,  setVehicleApps]  = useState([]);
  const [homeApps,     setHomeApps]     = useState([]);
  const [businessApps, setBusinessApps] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeSection, setActiveSection] = useState("all");
  const [filters,      setFilters]      = useState(EMPTY_FILTERS);
  const [selectedApp,  setSelectedApp]  = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, vRes, hRes, bRes] = await Promise.all([
        getPersonalLoanApplications(),
        getVehicleLoanApplications(),
        getHomeLoanApplications(),
        getBusinessLoanApplications(),
      ]);
      const safe = (res) => Array.isArray(res.data) ? res.data : res.data?.applications || [];
      setPersonalApps(safe(pRes));
      setVehicleApps(safe(vRes));
      setHomeApps(safe(hRes));
      setBusinessApps(safe(bRes));
      setError(null);
    } catch (err) {
      console.error("Admin fetch error:", err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setFilters(EMPTY_FILTERS);
  };

  const handleStatusUpdate = async (appId, data, loanType) => {
    if      (loanType === "vehicle")  await updateVehicleLoanStatus(appId, data);
    else if (loanType === "home")     await updateHomeLoanStatus(appId, data);
    else if (loanType === "business") await updateBusinessLoanStatus(appId, data);
    else                              await updatePersonalLoanStatus(appId, data);
    await fetchAll();
  };

  const combined = [
    ...personalApps.map(a => ({ ...a, _loanType: "personal"  })),
    ...vehicleApps.map( a => ({ ...a, _loanType: "vehicle"   })),
    ...homeApps.map(    a => ({ ...a, _loanType: "home"       })),
    ...businessApps.map(a => ({ ...a, _loanType: "business"  })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Step 1: sidebar filter
  const sidebarFiltered = combined.filter(a => {
    if (activeSection === "all")      return true;
    if (activeSection === "personal") return a._loanType === "personal";
    if (activeSection === "vehicle")  return a._loanType === "vehicle";
    if (activeSection === "home")     return a._loanType === "home";
    if (activeSection === "business") return a._loanType === "business";
    return a.status === activeSection;
  });

  // Step 2: apply filter bar on top of sidebar filter
  const filtered = sidebarFiltered.filter(a => {
    const s = filters.search.toLowerCase();
    if (s) {
      const match =
        a.full_name?.toLowerCase().includes(s) ||
        a.email?.toLowerCase().includes(s) ||
        a.phone?.includes(s) ||
        a.mobile?.includes(s) ||
        a.application_id?.toLowerCase().includes(s) ||
        a.user_email?.toLowerCase().includes(s) ||
        a.user_phone?.includes(s);
      if (!match) return false;
    }
    if (filters.loanType && a._loanType !== filters.loanType) return false;
    if (filters.status   && a.status !== filters.status)       return false;
    if (filters.employment) {
      const empType = (a.employment_type || "").toLowerCase();
      if (!empType.includes(filters.employment.toLowerCase())) return false;
    }
    if (filters.amountRange) {
      const amt = Number(a.loan_amount || a.required_amount || 0);
      const [min, max] = filters.amountRange.split("-");
      if (max === "+") { if (amt < Number(min)) return false; }
      else { if (amt < Number(min) || amt > Number(max)) return false; }
    }
    if (filters.loanProduct) {
      const product = (a.loan_product || a.loan_type || a.vehicle_type || a.loan_purpose || "").toLowerCase();
      if (!product.includes(filters.loanProduct.toLowerCase())) return false;
    }
    return true;
  });

  const counts = {
    all:                     combined.length,
    personal:                personalApps.length,
    vehicle:                 vehicleApps.length,
    home:                    homeApps.length,
    business:                businessApps.length,
    Pending:                 combined.filter(a => a.status === "Pending").length,
    "Under Review":          combined.filter(a => a.status === "Under Review").length,
    "Document Verification": combined.filter(a => a.status === "Document Verification").length,
    Approved:                combined.filter(a => a.status === "Approved").length,
    Rejected:                combined.filter(a => a.status === "Rejected").length,
    Disbursed:               combined.filter(a => a.status === "Disbursed").length,
  };

  const loanTypeItems = [
    { key: "all",      icon: "📋", label: "All Applications", count: counts.all },
    { key: "personal", icon: "💰", label: "Personal Loans",   count: counts.personal,  type: "personal" },
    { key: "vehicle",  icon: "🚗", label: "Vehicle Loans",    count: counts.vehicle,   type: "vehicle"  },
    { key: "home",     icon: "🏠", label: "Home Loans",       count: counts.home,      type: "home"     },
    { key: "business", icon: "💼", label: "Business Loans",   count: counts.business,  type: "business" },
  ];

  const statusItems = [
    { key: "Pending",               icon: "⏳", label: "Pending",          count: counts.Pending },
    { key: "Under Review",          icon: "🔍", label: "Under Review",     count: counts["Under Review"] },
    { key: "Document Verification", icon: "📄", label: "Doc Verification", count: counts["Document Verification"] },
    { key: "Approved",              icon: "✅", label: "Approved",         count: counts.Approved },
    { key: "Rejected",              icon: "❌", label: "Rejected",         count: counts.Rejected },
    { key: "Disbursed",             icon: "💸", label: "Disbursed",        count: counts.Disbursed },
  ];

  const sectionTitle =
    activeSection === "all"      ? "All Applications"  :
    activeSection === "personal" ? "Personal Loans"    :
    activeSection === "vehicle"  ? "Vehicle Loans"     :
    activeSection === "home"     ? "Home Loans"        :
    activeSection === "business" ? "Business Loans"    :
    activeSection === "users"    ? "Registered Users"  :
    `${activeSection} Applications`;

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-title">LoanEase</div>
          <div className="admin-sidebar__logo-sub">Admin Panel</div>
        </div>

        <div className="admin-sidebar__section">
          <div className="admin-sidebar__section-label">Overview</div>
          {loanTypeItems.map(item => (
            <button key={item.key}
              className={`admin-sidebar__item${activeSection === item.key ? " active" : ""}`}
              data-type={item.type}
              onClick={() => handleSectionChange(item.key)}
            >
              <span className="admin-sidebar__item-icon">{item.icon}</span>
              <span className="admin-sidebar__item-label">{item.label}</span>
              {item.count > 0 && <span className="admin-sidebar__item-count">{item.count}</span>}
            </button>
          ))}
        </div>

        <div className="admin-sidebar__divider" />

        <div className="admin-sidebar__section">
          <div className="admin-sidebar__section-label">Quick Filters</div>
          {statusItems.map(item => (
            <button key={item.key}
              className={`admin-sidebar__item${activeSection === item.key ? " active" : ""}`}
              onClick={() => handleSectionChange(item.key)}
            >
              <span className="admin-sidebar__item-icon">{item.icon}</span>
              <span className="admin-sidebar__item-label">{item.label}</span>
              {item.count > 0 && <span className="admin-sidebar__item-count">{item.count}</span>}
            </button>
          ))}
        </div>

        <div className="admin-sidebar__divider" />

        <div className="admin-sidebar__section">
          <div className="admin-sidebar__section-label">Management</div>
          <button
            className={`admin-sidebar__item${activeSection === "users" ? " active" : ""}`}
            onClick={() => handleSectionChange("users")}
          >
            <span className="admin-sidebar__item-icon">👥</span>
            <span className="admin-sidebar__item-label">Registered Users</span>
          </button>
        </div>

        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__refresh" onClick={fetchAll}>
            <span>↻</span> Refresh Data
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">
        {loading ? (
          <p className="track-loading">Loading dashboard…</p>
        ) : error ? (
          <p style={{ color: "red", padding: 32 }}>{error}</p>
        ) : activeSection === "users" ? (
          <UsersContent />
        ) : (
          <>
            <div className="admin-topbar">
              <div>
                <div className="admin-topbar__title">{sectionTitle}</div>
                <div className="admin-topbar__subtitle">{sidebarFiltered.length} total applications</div>
              </div>
            </div>

            {/* Stats */}
            <div className="admin-stats">
              <div className="stat-card"><h2>{combined.length}</h2><p>Total</p></div>
              <div className="stat-card"><h2>{counts.personal}</h2><p>Personal</p></div>
              <div className="stat-card"><h2>{counts.vehicle}</h2><p>Vehicle</p></div>
              <div className="stat-card"><h2>{counts.home}</h2><p>Home</p></div>
              <div className="stat-card"><h2>{counts.business}</h2><p>Business</p></div>
              <div className="stat-card approved"><h2>{counts.Approved}</h2><p>Approved</p></div>
              <div className="stat-card pending"><h2>{counts.Pending}</h2><p>Pending</p></div>
            </div>

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onChange={(key, val) => setFilters(f => ({ ...f, [key]: val }))}
              onClear={() => setFilters(EMPTY_FILTERS)}
              totalShown={filtered.length}
              totalAll={sidebarFiltered.length}
              activeSection={activeSection}
            />

            {/* Table */}
            {filtered.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty__icon">🔍</div>
                <div className="admin-empty__title">No results found</div>
                <div className="admin-empty__desc">Try adjusting your filters or search term.</div>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Application ID</th>
                      <th>Applicant Name</th>
                      <th>Mobile</th>
                      <th>Reg. Email</th>
                      <th>Reg. Phone</th>
                      <th>Loan Amount</th>
                      <th>Type</th>
                      <th>Employment</th>
                      <th>Status</th>
                      <th>Applied On</th>
                      <th>Docs</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((app, idx) => {
                      const loanLabel =
                        app._loanType === "vehicle"  ? (app.vehicle_type  || "Vehicle Loan")  :
                        app._loanType === "home"     ? (app.loan_type     || "Home Loan")     :
                        app._loanType === "business" ? (app.loan_type     || "Business Loan") :
                                                       (app.loan_purpose  || app.loan_product || "Personal Loan");
                      const loanIcon =
                        app._loanType === "vehicle"  ? "🚗" :
                        app._loanType === "home"     ? "🏠" :
                        app._loanType === "business" ? "💼" : "💰";
                      const amount   = app.loan_amount || app.required_amount || 0;
                      const docCount = app.document_count ?? "—";
                      const empType  = app.employment_type || "—";

                      return (
                        <tr key={app.application_id}>
                          <td style={{ color: "#66738d", fontWeight: 600, fontSize: 12 }}>{idx + 1}</td>
                          <td><span className="app-id-chip">{app.application_id}</span></td>
                          <td style={{ fontWeight: 600 }}>{app.full_name}</td>
                          <td style={{ fontSize: 13 }}>{app.phone || app.mobile}</td>
                          <td style={{ fontSize: 12.5, color: app.user_email ? "#1455d9" : "#9ca3af" }}>
                            {app.user_email || "—"}
                          </td>
                          <td style={{ fontSize: 12.5, color: app.user_phone ? "#374151" : "#9ca3af" }}>
                            {app.user_phone || "—"}
                          </td>
                          <td style={{ fontWeight: 700 }}>{fmtMoney(amount)}</td>
                          <td>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0f5ff", borderRadius: 8, padding: "3px 10px", fontSize: 12.5, fontWeight: 600, color: "#1455d9", whiteSpace: "nowrap" }}>
                              {loanIcon} {loanLabel}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: 12.5, color: "#374151", background: "#f9fafb", borderRadius: 6, padding: "2px 8px", whiteSpace: "nowrap" }}>
                              {empType}
                            </span>
                          </td>
                          <td><StatusBadge status={app.status} /></td>
                          <td style={{ whiteSpace: "nowrap", fontSize: 13, color: "#66738d" }}>
                            {new Date(app.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td>
                            <span style={{ background: docCount > 0 ? "#eef4ff" : "#f3f4f6", color: docCount > 0 ? "#1455d9" : "#9ca3af", borderRadius: 8, padding: "3px 10px", fontSize: 12.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                              📄 {docCount}
                            </span>
                          </td>
                          <td>
                            <button className="admin-action-btn"
                              onClick={() => { setSelectedApp(app); setSelectedType(app._loanType); }}>
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {selectedApp && (
        <DetailModal
          app={selectedApp}
          loanType={selectedType}
          onClose={() => { setSelectedApp(null); setSelectedType(null); }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

export default AdminDashboard;