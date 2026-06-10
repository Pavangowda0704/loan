// ============================================================
//  pages/AdminDashboard.jsx — Plumzo Capital Services Admin
//  Brand: Navy #1B3A6B | Emerald #00B87A | Sky #2196F3
// ============================================================

import { useEffect, useState, useCallback } from "react";
import {
  getPersonalLoanApplications, updatePersonalLoanStatus, getPersonalLoanDetails,
} from "../api/personalLoanApi.js";
import {
  getVehicleLoanApplications, updateVehicleLoanStatus, getVehicleLoanDetails,
} from "../api/vehicleLoanApi.js";
import {
  getHomeLoanApplications, updateHomeLoanStatus, getHomeLoanDetails,
} from "../api/homeLoanApi.js";
import {
  getBusinessLoanApplications, updateBusinessLoanStatus, getBusinessLoanDetails,
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
  Approved:                { bg: "#dcfce7", color: "#14532d" },
  Rejected:                { bg: "#fee2e2", color: "#991b1b" },
  Disbursed:               { bg: "#d1fae5", color: "#064e3b" },
};

function fmt(val) { return (val === null || val === undefined || val === "") ? "—" : val; }
function fmtMoney(val) { return val ? `₹${Number(val).toLocaleString("en-IN")}` : "—"; }
function fmtDate(val)  { return val ? new Date(val).toLocaleDateString("en-IN") : "—"; }

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || { bg: "#f3f4f6", color: "#374151" };
  return <span className="admin-status-badge" style={{ background: s.bg, color: s.color }}>{status}</span>;
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({ filters, onChange, onClear, totalShown, totalAll }) {
  const hasActive = filters.search || filters.loanType || filters.employment || filters.status || filters.amountRange;
  const sel = { width:"100%", padding:"8px 12px", border:"1.5px solid #e2e8f2", borderRadius:9, fontSize:13.5, fontFamily:"inherit", outline:"none", background:"#fff", cursor:"pointer", color:"#0f2444" };
  const lbl = { fontSize:10.5, fontWeight:700, color:"#8fa3bc", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5 };

  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f2", borderRadius:14, padding:"16px 18px", marginBottom:16, boxShadow:"0 1px 4px rgba(27,58,107,0.07)" }}>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"flex-end" }}>

        {/* Search */}
        <div style={{ flex:"2 1 200px", minWidth:180 }}>
          <div style={lbl}>Search</div>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#8fa3bc", fontSize:14 }}>🔍</span>
            <input placeholder="Name, email, phone, app ID…" value={filters.search}
              onChange={e => onChange("search", e.target.value)}
              style={{ ...sel, paddingLeft:30 }} />
          </div>
        </div>

        {/* Loan Type */}
        <div style={{ flex:"1 1 140px", minWidth:130 }}>
          <div style={lbl}>Loan Type</div>
          <select value={filters.loanType} onChange={e => onChange("loanType", e.target.value)} style={sel}>
            <option value="">All Types</option>
            <option value="personal">💰 Personal</option>
            <option value="vehicle">🚗 Vehicle</option>
            <option value="home">🏠 Home</option>
            <option value="business">💼 Business</option>
          </select>
        </div>

        {/* Employment */}
        <div style={{ flex:"1 1 150px", minWidth:140 }}>
          <div style={lbl}>Employment</div>
          <select value={filters.employment} onChange={e => onChange("employment", e.target.value)} style={sel}>
            <option value="">All Types</option>
            <option value="Salaried">💼 Salaried</option>
            <option value="Self-Employed">🏢 Self-Employed</option>
            <option value="Business Owner">🏭 Business Owner</option>
            <option value="Freelancer">💻 Freelancer</option>
          </select>
        </div>

        {/* Status */}
        <div style={{ flex:"1 1 150px", minWidth:140 }}>
          <div style={lbl}>Status</div>
          <select value={filters.status} onChange={e => onChange("status", e.target.value)} style={sel}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Amount */}
        <div style={{ flex:"1 1 140px", minWidth:130 }}>
          <div style={lbl}>Loan Amount</div>
          <select value={filters.amountRange} onChange={e => onChange("amountRange", e.target.value)} style={sel}>
            <option value="">Any Amount</option>
            <option value="0-100000">Under ₹1L</option>
            <option value="100000-500000">₹1L – ₹5L</option>
            <option value="500000-1000000">₹5L – ₹10L</option>
            <option value="1000000-5000000">₹10L – ₹50L</option>
            <option value="5000000+">Above ₹50L</option>
          </select>
        </div>

        {hasActive && (
          <div style={{ flex:"0 0 auto", alignSelf:"flex-end" }}>
            <button onClick={onClear}
              style={{ padding:"8px 16px", background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:9, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
              ✕ Clear
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop:10, fontSize:12.5, color:"#8fa3bc" }}>
        Showing <strong style={{ color:"#0f2444" }}>{totalShown}</strong> of <strong style={{ color:"#0f2444" }}>{totalAll}</strong> applications
        {hasActive && <span style={{ color:"#00B87A", fontWeight:600 }}> — filtered</span>}
      </div>
    </div>
  );
}

// ─── Document Row ─────────────────────────────────────────────────────────────
function DocRow({ doc, index, onPreview }) {
  const rawUrl  = doc.file_url || doc.file_path || "";
  const fileUrl = rawUrl ? (rawUrl.startsWith("http") ? rawUrl : `${API_BASE}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`) : null;
  const isPdf   = doc.file_type?.includes("pdf");
  return (
    <tr>
      <td style={{ padding:"10px 14px", color:"#8fa3bc", fontSize:13 }}>{index+1}</td>
      <td style={{ padding:"10px 14px", fontWeight:700, fontSize:13, color:"#0f2444" }}>
        {fmt(doc.document_name).replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
      </td>
      <td style={{ padding:"10px 14px", fontSize:12.5, color:"#4a5f7a" }}>{fmt(doc.file_name)}</td>
      <td style={{ padding:"10px 14px", fontSize:12, color:"#8fa3bc" }}>{doc.file_type||"—"}</td>
      <td style={{ padding:"10px 14px", fontSize:12, color:"#8fa3bc", whiteSpace:"nowrap" }}>
        {doc.file_size_kb ? `${doc.file_size_kb} KB` : "—"}
      </td>
      <td style={{ padding:"10px 14px", fontSize:12, color:"#8fa3bc", whiteSpace:"nowrap" }}>
        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}) : "—"}
      </td>
      <td style={{ padding:"10px 14px", whiteSpace:"nowrap" }}>
        {fileUrl ? (
          <div style={{ display:"flex", gap:6 }}>
            <button className="doc-action-btn view"
              onClick={() => isPdf ? window.open(fileUrl,"_blank","noopener,noreferrer") : onPreview(fileUrl,doc.file_type)}>
              👁 View
            </button>
            <a className="doc-action-btn download" href={fileUrl} download={doc.file_name||"document"} target="_blank" rel="noreferrer">
              ⬇ Save
            </a>
          </div>
        ) : <span style={{ color:"#cbd5e1", fontSize:12 }}>No file</span>}
      </td>
    </tr>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ app, loanType, onClose, onStatusUpdate }) {
  const [detailData,    setDetailData]    = useState(null);
  const [loadingDocs,   setLoadingDocs]   = useState(true);
  const [status,        setStatus]        = useState(app.status);
  const [remarks,       setRemarks]       = useState(app.remarks||"");
  const [saving,        setSaving]        = useState(false);
  const [previewUrl,    setPreviewUrl]    = useState(null);
  const [previewType,   setPreviewType]   = useState(null);
  const [activeSection, setActiveSection] = useState("details");

  useEffect(() => {
    const fn = loanType==="vehicle" ? getVehicleLoanDetails : loanType==="home" ? getHomeLoanDetails : loanType==="business" ? getBusinessLoanDetails : getPersonalLoanDetails;
    fn(app.application_id)
      .then(res => setDetailData(res.data))
      .catch(() => setDetailData(app))
      .finally(() => setLoadingDocs(false));
  }, [app.application_id, loanType]);

  const save = async () => {
    setSaving(true);
    try { await onStatusUpdate(app.application_id, { status, remarks }, loanType); onClose(); }
    catch { alert("Failed to update status"); }
    finally { setSaving(false); }
  };

  const data = detailData || app;
  const docs = detailData?.documents || detailData?.data?.documents || detailData?.application?.documents || [];
  const isVehicle = loanType==="vehicle", isHome = loanType==="home", isBiz = loanType==="business";

  const icons  = { vehicle:"🚗", home:"🏠", business:"💼", personal:"💰" };
  const labels = { vehicle:"Vehicle Loan", home:"Home Loan", business:"Business Loan", personal:"Personal Loan" };

  const applicantRows = isVehicle
    ? [["Full Name",data.full_name],["Phone",data.phone],["Email",data.email],["Date of Birth",fmtDate(data.dob)],["PAN Number",data.pan_number],["City",data.city]]
    : [["Full Name",data.full_name],["Father's Name",data.father_name||"—"],["Date of Birth",fmtDate(data.dob)],["Gender",data.gender||"—"],["Marital Status",data.marital_status||"—"],["Mobile",data.phone||data.mobile],["Email",data.email],["PAN Number",data.pan_number||data.pan],["Aadhaar Number",data.aadhaar_number||"—"],["Address",data.address||"—"],["City",data.city],["State",data.state||"—"],["Pincode",data.pincode||"—"]];

  const loanRows = isVehicle
    ? [["Loan Amount",fmtMoney(data.loan_amount)],["Vehicle Type",data.vehicle_type],["Vehicle Condition",data.vehicle_condition],["Vehicle Price",fmtMoney(data.vehicle_price)],["Down Payment",fmtMoney(data.down_payment)],["Tenure",data.tenure?`${data.tenure} months`:"—"],["Employment Type",data.employment_type],["Monthly Income",fmtMoney(data.monthly_income)]]
    : isHome
    ? [["Loan Amount",fmtMoney(data.loan_amount||data.required_amount)],["Loan Type",data.loan_type||"Home Loan"],["Property Type",data.property_type||"—"],["Property Value",fmtMoney(data.property_value)],["Tenure",data.tenure?`${data.tenure} months`:"—"],["Employment Type",data.employment_type],["Monthly Income",fmtMoney(data.monthly_income)],["Existing EMI",fmtMoney(data.existing_emi)]]
    : isBiz
    ? [["Loan Amount",fmtMoney(data.loan_amount||data.required_amount)],["Business Name",data.business_name||"—"],["Business Type",data.business_type||"—"],["Annual Turnover",fmtMoney(data.annual_turnover)],["Tenure",data.tenure?`${data.tenure} months`:"—"],["Monthly Income",fmtMoney(data.monthly_income)],["Existing EMI",fmtMoney(data.existing_emi)]]
    : [["Loan Amount",fmtMoney(data.loan_amount||data.required_amount)],["Loan Product",data.loan_product||"Personal Loan"],["Purpose",data.loan_purpose||data.purpose],["Tenure",data.tenure?`${data.tenure} months`:"—"],["Employment Type",data.employment_type],["Company Name",data.company_name],["Monthly Income",fmtMoney(data.monthly_income)],["Existing EMI",fmtMoney(data.existing_emi)]];

  const FieldSection = ({ title, rows }) => (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontWeight:800, fontSize:11, color:"#00B87A", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.1em", display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ flex:1, height:1, background:"linear-gradient(90deg,#00B87A22,transparent)" }} />
        {title}
        <span style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,#00B87A22)" }} />
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
      <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:860, width:"95vw" }}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`linear-gradient(135deg,#1B3A6B,#254d8f)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
              {icons[loanType]||"💰"}
            </div>
            <div>
              <div style={{ fontSize:11, color:"#00B87A", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>
                {labels[loanType]||"Loan"} Application
              </div>
              <h2 style={{ margin:0 }}>{data.application_id}</h2>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <StatusBadge status={data.status} />
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:"2px solid #f0f4f9", paddingLeft:22, background:"#fafcff" }}>
          {["details","documents"].map(sec => (
            <button key={sec} onClick={() => setActiveSection(sec)} style={{ border:"none", background:"transparent", padding:"13px 18px", fontWeight:700, fontSize:13, cursor:"pointer", borderBottom: activeSection===sec ? "2px solid #00B87A" : "2px solid transparent", color: activeSection===sec ? "#00B87A" : "#8fa3bc", marginBottom:-2, display:"flex", alignItems:"center", gap:6, fontFamily:"inherit", transition:"color 0.15s" }}>
              {sec==="details" ? "📋 Details" : `📄 Documents (${loadingDocs?"…":docs.length})`}
            </button>
          ))}
        </div>

        <div className="modal-body" style={{ maxHeight:"68vh", overflowY:"auto" }}>
          {activeSection==="details" && (
            <>
              {(app.user_email||app.user_phone) && (
                <div style={{ background:"linear-gradient(135deg,#eef9f4,#e8f4ff)", border:"1px solid #b8e8d4", borderRadius:12, padding:"14px 18px", marginBottom:20, display:"flex", gap:28, flexWrap:"wrap", alignItems:"center" }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#00B87A", textTransform:"uppercase", letterSpacing:"0.08em", width:"100%", marginBottom:4 }}>🔗 Linked Account</div>
                  {app.user_email && <div><div style={{ fontSize:10.5, color:"#8fa3bc", fontWeight:600, marginBottom:2 }}>Email</div><div style={{ fontSize:13.5, fontWeight:700, color:"#0f2444" }}>{app.user_email}</div></div>}
                  {app.user_phone && <div><div style={{ fontSize:10.5, color:"#8fa3bc", fontWeight:600, marginBottom:2 }}>Phone</div><div style={{ fontSize:13.5, fontWeight:700, color:"#0f2444" }}>{app.user_phone}</div></div>}
                </div>
              )}
              <FieldSection title="Applicant Information" rows={applicantRows} />
              <FieldSection title="Loan Details" rows={loanRows} />
              <div className="modal-update-section">
                <h3>Update Application Status</h3>
                <select value={status} onChange={e=>setStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
                </select>
                <textarea placeholder="Add remarks or notes (optional)…" value={remarks} onChange={e=>setRemarks(e.target.value)} rows={3} />
                <button className="pl-primary-btn" onClick={save} disabled={saving}>
                  {saving ? "Saving…" : "✓ Save Changes"}
                </button>
              </div>
            </>
          )}

          {activeSection==="documents" && (
            docs.length===0 && !loadingDocs ? (
              <div style={{ textAlign:"center", padding:48 }}>
                <div style={{ fontSize:40, marginBottom:12, opacity:0.3 }}>📭</div>
                <p style={{ color:"#8fa3bc", fontWeight:600 }}>No documents uploaded yet.</p>
              </div>
            ) : loadingDocs ? (
              <p style={{ textAlign:"center", padding:32, color:"#8fa3bc" }}>Loading documents…</p>
            ) : (
              <>
                <div style={{ overflowX:"auto", borderRadius:12, border:"1px solid #e2e8f2", marginBottom:16 }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
                    <thead>
                      <tr style={{ background:"linear-gradient(90deg,#f0f5ff,#f4faf7)" }}>
                        {["#","Type","File Name","Format","Size","Uploaded","Actions"].map(h=>(
                          <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10.5, fontWeight:700, color:"#8fa3bc", textTransform:"uppercase", letterSpacing:"0.07em", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {docs.map((doc,i)=>(
                        <DocRow key={doc.id} doc={doc} index={i}
                          onPreview={(url,type)=>{setPreviewUrl(url);setPreviewType(type);}} />
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewUrl && (
                  <div style={{ border:"1px solid #e2e8f2", borderRadius:12, overflow:"hidden" }}>
                    <div style={{ padding:"10px 16px", background:"linear-gradient(90deg,#f0f5ff,#f4faf7)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontWeight:700, fontSize:13, color:"#0f2444" }}>Document Preview</span>
                      <button onClick={()=>setPreviewUrl(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#8fa3bc", fontWeight:700, fontSize:13 }}>✕ Close</button>
                    </div>
                    {previewType?.includes("image")
                      ? <img src={previewUrl} alt="preview" style={{ width:"100%", maxHeight:500, objectFit:"contain", background:"#f8f8f8" }} />
                      : <iframe src={previewUrl} title="preview" style={{ width:"100%", height:480, border:"none" }} />}
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

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersContent() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    API.get("/auth/users")
      .then(res => setUsers(res.data.users||[]))
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
          <div className="admin-topbar__subtitle">{users.length} accounts created</div>
        </div>
      </div>

      <div className="admin-stats" style={{ marginBottom:20 }}>
        <div className="stat-card"><h2>{users.length}</h2><p>Total Users</p></div>
        <div className="stat-card approved"><h2>{users.filter(u=>u.total_applications>0).length}</h2><p>Active Applicants</p></div>
        <div className="stat-card pending"><h2>{users.filter(u=>u.total_applications===0).length}</h2><p>No Applications</p></div>
      </div>

      <div style={{ marginBottom:16 }}>
        <div style={{ position:"relative", maxWidth:360 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#8fa3bc" }}>🔍</span>
          <input placeholder="Search name, email, phone…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:"100%", padding:"9px 14px 9px 36px", border:"1.5px solid #e2e8f2", borderRadius:10, fontSize:13.5, fontFamily:"inherit", outline:"none" }} />
        </div>
      </div>

      {filtered.length===0 ? (
        <div className="admin-empty"><div className="admin-empty__icon">👥</div><div className="admin-empty__title">No users found</div></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Registered On</th><th>Applications</th></tr></thead>
            <tbody>
              {filtered.map((u,idx) => (
                <tr key={u.id}>
                  <td style={{ color:"#8fa3bc", fontWeight:600, fontSize:12 }}>{idx+1}</td>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,#1B3A6B,#00B87A)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:13, flexShrink:0 }}>
                        {u.name?.[0]?.toUpperCase()||"?"}
                      </div>
                      <span style={{ fontWeight:700 }}>{u.name||"—"}</span>
                    </div>
                  </td>
                  <td style={{ fontSize:13, color:"#4a5f7a" }}>{u.email||"—"}</td>
                  <td style={{ fontSize:13, color:"#4a5f7a" }}>{u.phone||"—"}</td>
                  <td style={{ fontSize:13, color:"#8fa3bc", whiteSpace:"nowrap" }}>
                    {new Date(u.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                  </td>
                  <td>
                    <span style={{ background: u.total_applications>0 ? "#e6f9f2" : "#f4f7fb", color: u.total_applications>0 ? "#009962" : "#8fa3bc", borderRadius:8, padding:"3px 12px", fontSize:13, fontWeight:700 }}>
                      {u.total_applications} loan{u.total_applications!==1?"s":""}
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
    if (pwd===ADMIN_PASSWORD) { sessionStorage.setItem(STORAGE_KEY,'1'); onSuccess(); }
    else { setErr(true); setTimeout(()=>setErr(false),2000); }
  };
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0f2444 0%,#1B3A6B 50%,#122952 100%)' }}>
      <div style={{ background:'#fff', borderRadius:20, padding:'2.5rem', width:380, boxShadow:'0 40px 100px rgba(15,36,68,0.4)', textAlign:'center' }}>
        <img src="/plumzo_logo.jpg" alt="Plumzo" style={{ height:56, marginBottom:20, objectFit:"contain" }} />
        <h2 style={{ fontSize:20, fontWeight:800, color:'#0f2444', marginBottom:6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Admin Portal</h2>
        <p style={{ fontSize:14, color:'#8fa3bc', marginBottom:24 }}>Enter your admin password to continue</p>
        <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Admin password" autoFocus
          style={{ width:'100%', padding:'11px 14px', border:`1.5px solid ${err?'#ef4444':'#e2e8f2'}`, borderRadius:10, fontSize:15, marginBottom:12, outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.2s' }} />
        {err && <p style={{ color:'#ef4444', fontSize:13, marginBottom:8 }}>⚠ Incorrect password</p>}
        <button onClick={submit}
          style={{ width:'100%', background:'linear-gradient(135deg,#1B3A6B,#254d8f)', color:'#fff', border:'none', borderRadius:10, padding:'12px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(27,58,107,0.35)', transition:'all 0.15s' }}>
          Sign In →
        </button>
        <div style={{ marginTop:16, padding:"10px 0", borderTop:"1px solid #f0f4f9" }}>
          <span style={{ fontSize:12, color:"#8fa3bc" }}>🔒 Plumzo Capital Services — Admin Only</span>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem(STORAGE_KEY));
  if (!authed) return <AdminLogin onSuccess={()=>setAuthed(true)} />;
  return <AdminDashboardInner />;
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const EMPTY_FILTERS = { search:"", loanType:"", employment:"", status:"", amountRange:"" };

function AdminDashboardInner() {
  const [personalApps, setPersonalApps] = useState([]);
  const [vehicleApps,  setVehicleApps]  = useState([]);
  const [homeApps,     setHomeApps]     = useState([]);
  const [businessApps, setBusinessApps] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeSection,setActiveSection]= useState("all");
  const [filters,      setFilters]      = useState(EMPTY_FILTERS);
  const [selectedApp,  setSelectedApp]  = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes,vRes,hRes,bRes] = await Promise.all([
        getPersonalLoanApplications(), getVehicleLoanApplications(),
        getHomeLoanApplications(),     getBusinessLoanApplications(),
      ]);
      const safe = r => Array.isArray(r.data) ? r.data : r.data?.applications||[];
      setPersonalApps(safe(pRes)); setVehicleApps(safe(vRes));
      setHomeApps(safe(hRes));     setBusinessApps(safe(bRes));
      setError(null);
    } catch(e) { console.error(e); setError("Failed to load applications."); }
    finally { setLoading(false); }
  }, []);

  useEffect(()=>{ fetchAll(); },[fetchAll]);

  const handleSectionChange = s => { setActiveSection(s); setFilters(EMPTY_FILTERS); };

  const handleStatusUpdate = async (appId, data, loanType) => {
    if      (loanType==="vehicle")  await updateVehicleLoanStatus(appId,data);
    else if (loanType==="home")     await updateHomeLoanStatus(appId,data);
    else if (loanType==="business") await updateBusinessLoanStatus(appId,data);
    else                            await updatePersonalLoanStatus(appId,data);
    await fetchAll();
  };

  const combined = [
    ...personalApps.map(a=>({...a,_loanType:"personal"})),
    ...vehicleApps.map( a=>({...a,_loanType:"vehicle"})),
    ...homeApps.map(    a=>({...a,_loanType:"home"})),
    ...businessApps.map(a=>({...a,_loanType:"business"})),
  ].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));

  const sidebarFiltered = combined.filter(a => {
    if (activeSection==="all")      return true;
    if (["personal","vehicle","home","business"].includes(activeSection)) return a._loanType===activeSection;
    return a.status===activeSection;
  });

  const filtered = sidebarFiltered.filter(a => {
    const s = filters.search.toLowerCase();
    if (s && ![a.full_name,a.email,a.phone,a.mobile,a.application_id,a.user_email,a.user_phone].some(v=>v?.toLowerCase().includes(s))) return false;
    if (filters.loanType   && a._loanType!==filters.loanType) return false;
    if (filters.status     && a.status!==filters.status) return false;
    if (filters.employment && !(a.employment_type||"").toLowerCase().includes(filters.employment.toLowerCase())) return false;
    if (filters.amountRange) {
      const amt = Number(a.loan_amount||a.required_amount||0);
      const [mn,mx] = filters.amountRange.split("-");
      if (mx==="+") { if (amt<Number(mn)) return false; }
      else { if (amt<Number(mn)||amt>Number(mx)) return false; }
    }
    return true;
  });

  const c = {
    all:combined.length, personal:personalApps.length, vehicle:vehicleApps.length,
    home:homeApps.length, business:businessApps.length,
    Pending:combined.filter(a=>a.status==="Pending").length,
    "Under Review":combined.filter(a=>a.status==="Under Review").length,
    "Document Verification":combined.filter(a=>a.status==="Document Verification").length,
    Approved:combined.filter(a=>a.status==="Approved").length,
    Rejected:combined.filter(a=>a.status==="Rejected").length,
    Disbursed:combined.filter(a=>a.status==="Disbursed").length,
  };

  const navItems = [
    { key:"all",      icon:"⬡",  label:"All Applications", count:c.all },
    { key:"personal", icon:"💰", label:"Personal Loans",   count:c.personal,  type:"personal" },
    { key:"vehicle",  icon:"🚗", label:"Vehicle Loans",    count:c.vehicle,   type:"vehicle"  },
    { key:"home",     icon:"🏠", label:"Home Loans",       count:c.home,      type:"home"     },
    { key:"business", icon:"💼", label:"Business Loans",   count:c.business,  type:"business" },
  ];

  const statusItems = [
    { key:"Pending",               icon:"⏳", label:"Pending",          count:c.Pending },
    { key:"Under Review",          icon:"🔍", label:"Under Review",     count:c["Under Review"] },
    { key:"Document Verification", icon:"📄", label:"Doc Verification", count:c["Document Verification"] },
    { key:"Approved",              icon:"✅", label:"Approved",         count:c.Approved },
    { key:"Rejected",              icon:"❌", label:"Rejected",         count:c.Rejected },
    { key:"Disbursed",             icon:"💸", label:"Disbursed",        count:c.Disbursed },
  ];

  const sectionTitle = {
    all:"All Applications", personal:"Personal Loans", vehicle:"Vehicle Loans",
    home:"Home Loans", business:"Business Loans", users:"Registered Users",
  }[activeSection] || `${activeSection} Applications`;

  const LOAN_ICONS  = { personal:"💰", vehicle:"🚗", home:"🏠", business:"💼" };
  const LOAN_COLORS = { personal:"#1B3A6B", vehicle:"#2196F3", home:"#009962", business:"#7c3aed" };
  const LOAN_BG     = { personal:"#eef0f8", vehicle:"#e3f2fd", home:"#e6f9f2", business:"#f3e8ff" };

  return (
    <div className="admin-layout">

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <img src="/plumzo_logo.jpg" alt="Plumzo" className="admin-sidebar__logo-img" />
          <div className="admin-sidebar__logo-text">
            <div className="admin-sidebar__logo-title">Plumzo</div>
            <div className="admin-sidebar__logo-sub">Admin Panel</div>
          </div>
        </div>

        <div className="admin-sidebar__section">
          <div className="admin-sidebar__section-label">Loan Types</div>
          {navItems.map(item => (
            <button key={item.key}
              className={`admin-sidebar__item${activeSection===item.key?" active":""}`}
              data-type={item.type}
              onClick={()=>handleSectionChange(item.key)}
            >
              <span className="admin-sidebar__item-icon">{item.icon}</span>
              <span className="admin-sidebar__item-label">{item.label}</span>
              {item.count>0 && <span className="admin-sidebar__item-count">{item.count}</span>}
            </button>
          ))}
        </div>

        <div className="admin-sidebar__divider" />

        <div className="admin-sidebar__section">
          <div className="admin-sidebar__section-label">Quick Filters</div>
          {statusItems.map(item => (
            <button key={item.key}
              className={`admin-sidebar__item${activeSection===item.key?" active":""}`}
              onClick={()=>handleSectionChange(item.key)}
            >
              <span className="admin-sidebar__item-icon">{item.icon}</span>
              <span className="admin-sidebar__item-label">{item.label}</span>
              {item.count>0 && <span className="admin-sidebar__item-count">{item.count}</span>}
            </button>
          ))}
        </div>

        <div className="admin-sidebar__divider" />

        <div className="admin-sidebar__section">
          <div className="admin-sidebar__section-label">Management</div>
          <button
            className={`admin-sidebar__item${activeSection==="users"?" active":""}`}
            onClick={()=>handleSectionChange("users")}
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
        {loading ? <p className="track-loading">Loading dashboard…</p>
         : error  ? <p style={{ color:"#ef4444", padding:32 }}>{error}</p>
         : activeSection==="users" ? <UsersContent />
         : (
          <>
            <div className="admin-topbar">
              <div>
                <div className="admin-topbar__title">{sectionTitle}</div>
                <div className="admin-topbar__subtitle">{sidebarFiltered.length} total · {c.Approved} approved · {c.Pending} pending</div>
              </div>
            </div>

            {/* Stats */}
            <div className="admin-stats">
              <div className="stat-card"><h2 style={{ color:"#1B3A6B" }}>{c.all}</h2><p>Total</p></div>
              <div className="stat-card"><h2 style={{ color:"#1B3A6B" }}>{c.personal}</h2><p>Personal</p></div>
              <div className="stat-card"><h2 style={{ color:"#2196F3" }}>{c.vehicle}</h2><p>Vehicle</p></div>
              <div className="stat-card"><h2 style={{ color:"#009962" }}>{c.home}</h2><p>Home</p></div>
              <div className="stat-card"><h2 style={{ color:"#7c3aed" }}>{c.business}</h2><p>Business</p></div>
              <div className="stat-card"><h2 style={{ color:"#00B87A" }}>{c.Approved}</h2><p>Approved</p></div>
              <div className="stat-card"><h2 style={{ color:"#f59e0b" }}>{c.Pending}</h2><p>Pending</p></div>
            </div>

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onChange={(k,v) => setFilters(f=>({...f,[k]:v}))}
              onClear={() => setFilters(EMPTY_FILTERS)}
              totalShown={filtered.length}
              totalAll={sidebarFiltered.length}
            />

            {/* Table */}
            {filtered.length===0 ? (
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
                      <th>Applicant</th>
                      <th>Mobile</th>
                      <th>Reg. Email</th>
                      <th>Loan Amount</th>
                      <th>Type</th>
                      <th>Employment</th>
                      <th>Status</th>
                      <th>Applied On</th>
                      <th>Docs</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((app,idx) => {
                      const lt       = app._loanType;
                      const loanLabel= lt==="vehicle" ? (app.vehicle_type||"Vehicle Loan") : lt==="home" ? (app.loan_type||"Home Loan") : lt==="business" ? (app.loan_type||"Business Loan") : (app.loan_purpose||app.loan_product||"Personal Loan");
                      const amount   = app.loan_amount||app.required_amount||0;
                      const docCount = app.document_count??"—";
                      return (
                        <tr key={app.application_id}>
                          <td style={{ color:"#8fa3bc", fontWeight:600, fontSize:11 }}>{idx+1}</td>
                          <td><span className="app-id-chip">{app.application_id}</span></td>
                          <td>
                            <div style={{ fontWeight:700, fontSize:13.5 }}>{app.full_name}</div>
                            {app.user_email && <div style={{ fontSize:11.5, color:"#8fa3bc", marginTop:2 }}>{app.user_email}</div>}
                          </td>
                          <td style={{ fontSize:13 }}>{app.phone||app.mobile}</td>
                          <td style={{ fontSize:12.5, color: app.user_email?"#2196F3":"#cbd5e1" }}>
                            {app.user_email||"—"}
                          </td>
                          <td style={{ fontWeight:800, color:"#0f2444", fontSize:13.5 }}>{fmtMoney(amount)}</td>
                          <td>
                            <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:LOAN_BG[lt]||"#f4f7fb", color:LOAN_COLORS[lt]||"#4a5f7a", borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>
                              {LOAN_ICONS[lt]} {loanLabel}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize:12, color:"#4a5f7a", background:"#f4f7fb", borderRadius:6, padding:"3px 8px", whiteSpace:"nowrap" }}>
                              {app.employment_type||"—"}
                            </span>
                          </td>
                          <td><StatusBadge status={app.status} /></td>
                          <td style={{ whiteSpace:"nowrap", fontSize:12.5, color:"#8fa3bc" }}>
                            {new Date(app.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                          </td>
                          <td>
                            <span style={{ background:docCount>0?"#e6f9f2":"#f4f7fb", color:docCount>0?"#009962":"#8fa3bc", borderRadius:8, padding:"3px 10px", fontSize:12.5, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4 }}>
                              📄 {docCount}
                            </span>
                          </td>
                          <td>
                            <button className="admin-action-btn"
                              onClick={()=>{ setSelectedApp(app); setSelectedType(app._loanType); }}>
                              View →
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
          onClose={()=>{ setSelectedApp(null); setSelectedType(null); }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

export default AdminDashboard;