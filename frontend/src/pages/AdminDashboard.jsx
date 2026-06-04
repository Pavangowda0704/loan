// ============================================================
//  pages/AdminDashboard.jsx — Admin Dashboard with Sidebar
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
import "../styles/personalLoan.css";
import "../styles/adminDashboard.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api$/, "");

const STATUS_OPTIONS = ["Pending","Under Review","Document Verification","Approved","Rejected","Disbursed"];

const STATUS_COLORS = {
  Pending:                 { bg: "#fef3c7", color: "#92400e" },
  "Under Review":          { bg: "#dbeafe", color: "#1e40af" },
  "Document Verification": { bg: "#ede9fe", color: "#5b21b6" },
  Approved:                { bg: "#d1fae5", color: "#065f46" },
  Rejected:                { bg: "#fee2e2", color: "#991b1b" },
  Disbursed:               { bg: "#d1fae5", color: "#064e3b" },
};

const LOAN_TYPE_CONFIG = {
  personal: { label: "Personal Loans", icon: "💰", color: "#7c3aed", bg: "#f5f3ff" },
  vehicle:  { label: "Vehicle Loans",  icon: "🚗", color: "#0369a1", bg: "#e0f2fe" },
  home:     { label: "Home Loans",     icon: "🏠", color: "#0f766e", bg: "#f0fdfa" },
  business: { label: "Business Loans", icon: "💼", color: "#b45309", bg: "#fffbeb" },
};

const STATUS_FILTERS = ["All","Pending","Under Review","Document Verification","Approved","Rejected","Disbursed"];

function fmt(val) { return (val === null || val === undefined || val === "") ? "—" : val; }
function fmtMoney(val) { return !val ? "—" : `₹${Number(val).toLocaleString("en-IN")}`; }
function fmtDate(val)  { return !val ? "—" : new Date(val).toLocaleDateString("en-IN"); }

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || { bg: "#f3f4f6", color: "#374151" };
  return <span className="admin-status-badge" style={{ background: s.bg, color: s.color }}>{status}</span>;
}

// ─── Document row ──────────────────────────────────────────
function DocRow({ doc, index, onPreview }) {
  const rawUrl  = doc.file_url || doc.file_path || "";
  const fileUrl = rawUrl ? (rawUrl.startsWith("http") ? rawUrl : `${API_BASE}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`) : null;
  const isPdf   = doc.file_type?.includes("pdf");

  return (
    <tr>
      <td style={{ padding:"10px 12px", color:"#66738d", fontSize:13 }}>{index+1}</td>
      <td style={{ padding:"10px 12px", fontWeight:700, fontSize:13, color:"#071b46" }}>
        {fmt(doc.document_name).replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
      </td>
      <td style={{ padding:"10px 12px", fontSize:12.5, color:"#374151" }}>{fmt(doc.file_name)}</td>
      <td style={{ padding:"10px 12px", fontSize:12, color:"#66738d" }}>{doc.file_type||"—"}</td>
      <td style={{ padding:"10px 12px", fontSize:12, color:"#66738d", whiteSpace:"nowrap" }}>
        {doc.file_size_kb ? `${doc.file_size_kb} KB` : "—"}
      </td>
      <td style={{ padding:"10px 12px", fontSize:12, color:"#66738d", whiteSpace:"nowrap" }}>
        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}) : "—"}
      </td>
      <td style={{ padding:"10px 12px", whiteSpace:"nowrap" }}>
        {fileUrl ? (
          <div style={{ display:"flex", gap:6 }}>
            <button className="doc-action-btn view" onClick={() => isPdf ? window.open(fileUrl,"_blank","noopener,noreferrer") : onPreview(fileUrl, doc.file_type)}>
              👁 View
            </button>
            <a className="doc-action-btn download" href={fileUrl} download={doc.file_name||"document"} target="_blank" rel="noreferrer">
              ⬇ Download
            </a>
          </div>
        ) : <span style={{ color:"#aaa", fontSize:12 }}>No file</span>}
      </td>
    </tr>
  );
}

// ─── Detail Modal ──────────────────────────────────────────
function DetailModal({ app, loanType, onClose, onStatusUpdate }) {
  const [detailData,    setDetailData]    = useState(null);
  const [loadingDocs,   setLoadingDocs]   = useState(true);
  const [status,        setStatus]        = useState(app.status);
  const [remarks,       setRemarks]       = useState(app.remarks || "");
  const [saving,        setSaving]        = useState(false);
  const [previewUrl,    setPreviewUrl]    = useState(null);
  const [previewType,   setPreviewType]   = useState(null);
  const [activeSection, setActiveSection] = useState("details");
  const cfg = LOAN_TYPE_CONFIG[loanType] || LOAN_TYPE_CONFIG.personal;

  useEffect(() => {
    (async () => {
      try {
        const fnMap = { personal:getPersonalLoanDetails, vehicle:getVehicleLoanDetails, home:getHomeLoanDetails, business:getBusinessLoanDetails };
        const res = await (fnMap[loanType] || getPersonalLoanDetails)(app.application_id);
        setDetailData(res.data);
      } catch { setDetailData(app); }
      finally  { setLoadingDocs(false); }
    })();
  }, [app.application_id, loanType]);

  const save = async () => {
    setSaving(true);
    try { await onStatusUpdate(app.application_id, { status, remarks }, loanType); onClose(); }
    catch { alert("Failed to update status"); }
    finally { setSaving(false); }
  };

  const data = detailData || app;
  const docs = detailData?.documents || detailData?.data?.documents || detailData?.application?.documents || [];

  const applicantRows = [
    ["Full Name", data.full_name], ["Date of Birth", fmtDate(data.dob)],
    ["Mobile", data.phone||data.mobile], ["Email", data.email],
    ["PAN Number", data.pan_number||data.pan], ["City", data.city],
    ["State", data.state||"—"], ["Address", data.address||"—"],
  ];

  const loanRows = loanType === "vehicle" ? [
    ["Loan Amount", fmtMoney(data.loan_amount)], ["Vehicle Type", data.vehicle_type],
    ["Vehicle Condition", data.vehicle_condition], ["Vehicle Price", fmtMoney(data.vehicle_price)],
    ["Down Payment", fmtMoney(data.down_payment)], ["Tenure", data.tenure?`${data.tenure} months`:"—"],
    ["Employment Type", data.employment_type], ["Monthly Income", fmtMoney(data.monthly_income)],
  ] : loanType === "home" ? [
    ["Loan Amount", fmtMoney(data.loan_amount)], ["Loan Type", data.loan_type||"—"],
    ["Property Type", data.property_type||"—"], ["Property Value", fmtMoney(data.property_value)],
    ["Property Location", data.property_location||"—"], ["Tenure", data.tenure?`${data.tenure} years`:"—"],
    ["Employment Type", data.employment_type], ["Monthly Income", fmtMoney(data.monthly_income)],
    ["Purpose", data.purpose||"—"],
  ] : loanType === "business" ? [
    ["Loan Amount", fmtMoney(data.loan_amount)], ["Loan Type", data.loan_type||"—"],
    ["Business Name", data.business_name||"—"], ["Business Type", data.business_type||"—"],
    ["Annual Turnover", fmtMoney(data.annual_turnover)], ["Monthly Income", fmtMoney(data.monthly_income)],
    ["Tenure", data.tenure||"—"], ["Purpose", data.purpose||"—"],
  ] : [
    ["Loan Amount", fmtMoney(data.loan_amount||data.required_amount)],
    ["Loan Product", data.loan_product||"Personal Loan"], ["Purpose", data.loan_purpose||data.purpose],
    ["Tenure", data.tenure?`${data.tenure} months`:"—"], ["Employment Type", data.employment_type],
    ["Company Name", data.company_name], ["Monthly Income", fmtMoney(data.monthly_income)],
    ["Existing EMI", fmtMoney(data.existing_emi)],
  ];

  const FieldSection = ({ title, rows }) => (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontWeight:800, fontSize:13, color:cfg.color, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>{title}</div>
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
      <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:860, width:"95vw" }}>
        <div className="modal-header" style={{ borderBottom:`3px solid ${cfg.color}` }}>
          <div>
            <div style={{ fontSize:11, color:cfg.color, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>
              {cfg.icon} {cfg.label.replace(/s$/,"")} Application
            </div>
            <h2 style={{ margin:0 }}>{data.application_id}</h2>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <StatusBadge status={data.status} />
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div style={{ display:"flex", borderBottom:"1px solid #e6edff", paddingLeft:26 }}>
          {["details","documents"].map(sec => (
            <button key={sec} onClick={()=>setActiveSection(sec)} style={{
              border:"none", background:"transparent", padding:"12px 18px",
              fontWeight:700, fontSize:13, cursor:"pointer",
              borderBottom: activeSection===sec ? `2px solid ${cfg.color}` : "2px solid transparent",
              color: activeSection===sec ? cfg.color : "#66738d",
              marginBottom:-1, fontFamily:"inherit",
            }}>
              {sec==="details" ? "📋 Application Details" : `📄 Documents (${loadingDocs?"…":docs.length})`}
            </button>
          ))}
        </div>

        <div className="modal-body" style={{ maxHeight:"68vh", overflowY:"auto" }}>
          {activeSection === "details" && (
            <>
              <FieldSection title="Applicant Information" rows={applicantRows} />
              <FieldSection title="Loan Information" rows={loanRows} />
              <div className="modal-update-section">
                <h3>Update Status</h3>
                <select value={status} onChange={e=>setStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
                </select>
                <textarea placeholder="Add remarks (optional)…" value={remarks} onChange={e=>setRemarks(e.target.value)} rows={3} />
                <button className="pl-primary-btn" onClick={save} disabled={saving} style={{ background:cfg.color }}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </>
          )}
          {activeSection === "documents" && (
            loadingDocs ? <p style={{ textAlign:"center", padding:32, color:"#66738d" }}>Loading documents…</p>
            : docs.length === 0 ? (
              <div style={{ textAlign:"center", padding:40 }}>
                <div style={{ fontSize:36, marginBottom:8 }}>📭</div>
                <p style={{ color:"#66738d" }}>No documents uploaded yet.</p>
              </div>
            ) : (
              <>
                <div style={{ overflowX:"auto", borderRadius:12, border:"1px solid #e6edff", marginBottom:20 }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
                    <thead>
                      <tr style={{ background:"#f0f5ff" }}>
                        {["#","Document Type","File Name","Type","Size","Uploaded On","Actions"].map(h=>(
                          <th key={h} style={{ padding:"11px 12px", textAlign:"left", fontSize:11, fontWeight:800, color:"#66738d", textTransform:"uppercase", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {docs.map((doc,i)=>(
                        <DocRow key={doc.id} doc={doc} index={i} onPreview={(url,type)=>{setPreviewUrl(url);setPreviewType(type);}} />
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewUrl && (
                  <div style={{ border:"1px solid #e6edff", borderRadius:12, overflow:"hidden" }}>
                    <div style={{ padding:"10px 16px", background:"#f0f5ff", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontWeight:700, fontSize:13, color:"#071b46" }}>Document Preview</span>
                      <button onClick={()=>setPreviewUrl(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#66738d", fontWeight:700 }}>✕ Close</button>
                    </div>
                    {previewType?.includes("image")
                      ? <img src={previewUrl} alt="preview" style={{ width:"100%", maxHeight:500, objectFit:"contain", background:"#f8f8f8" }} />
                      : <iframe src={previewUrl} title="preview" style={{ width:"100%", height:480, border:"none" }} />
                    }
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Login ───────────────────────────────────────────
const ADMIN_PASSWORD = "loanease@admin2024";
const STORAGE_KEY    = "loanease_admin_auth";

function AdminLogin({ onSuccess }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => {
    if (pwd === ADMIN_PASSWORD) { sessionStorage.setItem(STORAGE_KEY,"1"); onSuccess(); }
    else { setErr(true); setTimeout(()=>setErr(false),2000); }
  };
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f7ff" }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"2.5rem", width:360, boxShadow:"0 4px 24px rgba(0,0,0,0.10)", textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
        <h2 style={{ fontSize:20, fontWeight:700, color:"#071b46", marginBottom:6 }}>Admin Access</h2>
        <p style={{ fontSize:14, color:"#6b7280", marginBottom:24 }}>Enter password to continue</p>
        <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Admin password" autoFocus
          style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${err?"#ef4444":"#d1d5db"}`, borderRadius:10, fontSize:15, marginBottom:12, outline:"none", fontFamily:"inherit" }} />
        {err && <p style={{ color:"#ef4444", fontSize:13, marginBottom:8 }}>Incorrect password</p>}
        <button onClick={submit} style={{ width:"100%", background:"#1a56db", color:"#fff", border:"none", borderRadius:10, padding:"11px", fontSize:15, fontWeight:600, cursor:"pointer" }}>
          Login →
        </button>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem(STORAGE_KEY));
  if (!authed) return <AdminLogin onSuccess={()=>setAuthed(true)} />;
  return <AdminDashboardInner />;
}

// ─── Main Dashboard ────────────────────────────────────────
function AdminDashboardInner() {
  const [personalApps, setPersonalApps] = useState([]);
  const [vehicleApps,  setVehicleApps]  = useState([]);
  const [homeApps,     setHomeApps]     = useState([]);
  const [businessApps, setBusinessApps] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // Sidebar selection: "all" | "personal" | "vehicle" | "home" | "business"
  const [activeLoanType, setActiveLoanType] = useState("all");
  // Status filter within the selected loan type
  const [activeStatus,   setActiveStatus]   = useState("All");
  const [selectedApp,    setSelectedApp]    = useState(null);
  const [selectedType,   setSelectedType]   = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, vRes, hRes, bRes] = await Promise.all([
        getPersonalLoanApplications(),
        getVehicleLoanApplications(),
        getHomeLoanApplications(),
        getBusinessLoanApplications(),
      ]);
      setPersonalApps(Array.isArray(pRes.data) ? pRes.data : pRes.data?.applications || []);
      setVehicleApps( Array.isArray(vRes.data) ? vRes.data : vRes.data?.applications || []);
      setHomeApps(    Array.isArray(hRes.data) ? hRes.data : hRes.data?.applications || []);
      setBusinessApps(Array.isArray(bRes.data) ? bRes.data : bRes.data?.applications || []);
      setError(null);
    } catch (err) {
      console.error("Admin fetch error:", err);
      setError("Failed to load applications. Is the backend running?");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleStatusUpdate = async (appId, data, loanType) => {
    if      (loanType==="vehicle")  await updateVehicleLoanStatus(appId, data);
    else if (loanType==="home")     await updateHomeLoanStatus(appId, data);
    else if (loanType==="business") await updateBusinessLoanStatus(appId, data);
    else                            await updatePersonalLoanStatus(appId, data);
    await fetchAll();
  };

  // All apps combined
  const combined = [
    ...personalApps.map(a=>({...a,_loanType:"personal"})),
    ...vehicleApps.map( a=>({...a,_loanType:"vehicle"})),
    ...homeApps.map(    a=>({...a,_loanType:"home"})),
    ...businessApps.map(a=>({...a,_loanType:"business"})),
  ].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));

  // Filter by sidebar loan type
  const byLoanType = activeLoanType === "all" ? combined : combined.filter(a=>a._loanType===activeLoanType);

  // Filter by status
  const filtered = activeStatus === "All" ? byLoanType : byLoanType.filter(a=>a.status===activeStatus);

  // Counts per loan type (for sidebar badges)
  const loanCounts = {
    all:      combined.length,
    personal: personalApps.length,
    vehicle:  vehicleApps.length,
    home:     homeApps.length,
    business: businessApps.length,
  };

  // Status counts within current loan type selection
  const statusCounts = STATUS_FILTERS.reduce((acc, s) => {
    acc[s] = s === "All" ? byLoanType.length : byLoanType.filter(a=>a.status===s).length;
    return acc;
  }, {});

  // Active config for header accent
  const activeCfg = activeLoanType === "all" ? null : LOAN_TYPE_CONFIG[activeLoanType];

  if (loading) return (
    <div className="admin-layout">
      <div className="admin-sidebar"><div className="admin-sidebar__logo"><div className="admin-sidebar__logo-title">LoanEase</div><div className="admin-sidebar__logo-sub">Admin Panel</div></div></div>
      <div className="admin-main"><p className="track-loading">Loading dashboard…</p></div>
    </div>
  );

  if (error) return (
    <div className="admin-layout">
      <div className="admin-sidebar"><div className="admin-sidebar__logo"><div className="admin-sidebar__logo-title">LoanEase</div></div></div>
      <div className="admin-main"><p style={{ color:"red", padding:32 }}>{error}</p></div>
    </div>
  );

  return (
    <div className="admin-layout">

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-title">LoanEase</div>
          <div className="admin-sidebar__logo-sub">Admin Panel</div>
        </div>

        {/* Overview */}
        <div className="admin-sidebar__section">
          <div className="admin-sidebar__section-label">Overview</div>
          <button
            className={`admin-sidebar__item ${activeLoanType==="all"?"active":""}`}
            onClick={()=>{ setActiveLoanType("all"); setActiveStatus("All"); }}
          >
            <span className="admin-sidebar__item-icon">📊</span>
            <span className="admin-sidebar__item-label">All Applications</span>
            <span className="admin-sidebar__item-count">{loanCounts.all}</span>
          </button>
        </div>

        <div className="admin-sidebar__divider" />

        {/* Loan Types */}
        <div className="admin-sidebar__section">
          <div className="admin-sidebar__section-label">Loan Types</div>
          {Object.entries(LOAN_TYPE_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              data-type={key}
              className={`admin-sidebar__item ${activeLoanType===key?"active":""}`}
              onClick={()=>{ setActiveLoanType(key); setActiveStatus("All"); }}
            >
              <span className="admin-sidebar__item-icon">{cfg.icon}</span>
              <span className="admin-sidebar__item-label">{cfg.label}</span>
              <span className="admin-sidebar__item-count">{loanCounts[key]}</span>
            </button>
          ))}
        </div>

        <div className="admin-sidebar__divider" />

        {/* Quick status filters */}
        <div className="admin-sidebar__section">
          <div className="admin-sidebar__section-label">Quick Filters</div>
          {["Pending","Under Review","Approved","Rejected"].map(s => {
            const count = combined.filter(a=>a.status===s).length;
            return (
              <button key={s}
                className={`admin-sidebar__item ${activeLoanType==="all"&&activeStatus===s?"active":""}`}
                onClick={()=>{ setActiveLoanType("all"); setActiveStatus(s); }}
              >
                <span className="admin-sidebar__item-icon">
                  {s==="Pending"?"⏳":s==="Under Review"?"🔍":s==="Approved"?"✅":"❌"}
                </span>
                <span className="admin-sidebar__item-label">{s}</span>
                {count > 0 && <span className="admin-sidebar__item-count">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Footer refresh */}
        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__refresh" onClick={fetchAll}>
            <span>↻</span> Refresh Data
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="admin-main">

        {/* Top bar */}
        <div className="admin-topbar">
          <div>
            {activeCfg ? (
              <div className="admin-topbar__accent" style={{ background: activeCfg.bg, color: activeCfg.color }}>
                {activeCfg.icon} {activeCfg.label}
              </div>
            ) : (
              <div className="admin-topbar__accent" style={{ background:"#eef4ff", color:"#1455d9" }}>
                📊 All Loan Types
              </div>
            )}
            <div className="admin-topbar__title">
              {activeCfg ? activeCfg.label : "All Applications"}
            </div>
            <div className="admin-topbar__subtitle">
              {filtered.length} application{filtered.length !== 1 ? "s" : ""} {activeStatus !== "All" ? `· ${activeStatus}` : ""}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card" style={{ borderTop:"3px solid #6366f1" }}>
            <h2>{byLoanType.length}</h2>
            <p>Total</p>
          </div>
          {["Pending","Under Review","Approved","Rejected","Disbursed"].map(s => {
            const c = STATUS_COLORS[s];
            return (
              <div key={s} className="stat-card" style={{ borderTop:`3px solid ${c.color}`, cursor:"pointer" }}
                onClick={()=>setActiveStatus(activeStatus===s?"All":s)}>
                <h2 style={{ color: c.color }}>{statusCounts[s]||0}</h2>
                <p>{s}</p>
              </div>
            );
          })}
        </div>

        {/* Status filter pills */}
        <div className="admin-status-bar">
          {STATUS_FILTERS.map(s => (
            <button key={s}
              className={`admin-status-btn ${activeStatus===s?"active":""}`}
              onClick={()=>setActiveStatus(s)}
            >
              {s}
              {statusCounts[s] > 0 && <span className="tab-count">{statusCounts[s]}</span>}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="admin-table-wrap">
          {filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty__icon">📭</div>
              <div className="admin-empty__title">No applications found</div>
              <div className="admin-empty__desc">
                {activeLoanType !== "all"
                  ? `No ${LOAN_TYPE_CONFIG[activeLoanType]?.label} with status "${activeStatus}"`
                  : `No applications with status "${activeStatus}"`}
              </div>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Application ID</th>
                  <th>Applicant Name</th>
                  <th>Mobile</th>
                  <th>Loan Amount</th>
                  {activeLoanType === "all" && <th>Loan Type</th>}
                  <th>Status</th>
                  <th>Applied On</th>
                  <th>Docs</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, idx) => {
                  const cfg      = LOAN_TYPE_CONFIG[app._loanType];
                  const amount   = app.loan_amount || app.required_amount || 0;
                  const docCount = app.document_count ?? "—";
                  return (
                    <tr key={app.application_id}>
                      <td style={{ color:"#66738d", fontWeight:600, fontSize:12 }}>{idx+1}</td>
                      <td><span className="app-id-chip">{app.application_id}</span></td>
                      <td style={{ fontWeight:600 }}>{app.full_name}</td>
                      <td>{app.phone||app.mobile}</td>
                      <td style={{ fontWeight:700 }}>{fmtMoney(amount)}</td>
                      {activeLoanType === "all" && (
                        <td>
                          <span style={{ background:cfg.bg, color:cfg.color, borderRadius:8, padding:"3px 10px", fontSize:12.5, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4 }}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </td>
                      )}
                      <td><StatusBadge status={app.status} /></td>
                      <td style={{ whiteSpace:"nowrap", fontSize:13, color:"#66738d" }}>
                        {new Date(app.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                      </td>
                      <td>
                        <span style={{
                          background: docCount>0?"#eef4ff":"#f3f4f6",
                          color: docCount>0?"#1455d9":"#9ca3af",
                          borderRadius:8, padding:"3px 10px", fontSize:12.5, fontWeight:700,
                          display:"inline-flex", alignItems:"center", gap:4,
                        }}>
                          📄 {docCount}
                        </span>
                      </td>
                      <td>
                        <button className="admin-action-btn"
                          style={{ background: cfg.color }}
                          onClick={()=>{ setSelectedApp(app); setSelectedType(app._loanType); }}>
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
      </main>

      {selectedApp && (
        <DetailModal
          app={selectedApp}
          loanType={selectedType}
          onClose={()=>{ setSelectedApp(null); setSelectedType(null); }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

export default AdminDashboard;