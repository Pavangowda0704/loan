// ============================================================
//  VehicleLoanAdminNew.jsx — Admin view for vehicle loans
//  Route: /admin/vehicle-loans
// ============================================================
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVehicleLoanApplications, updateVehicleLoanStatus } from "../../../api/vehicleLoanApi.js";
import "../vehicleLoan.css";

const STATUS_OPTIONS = ["Pending","Under Review","Document Verification","Approved","Rejected","Disbursed"];

const STATUS_STYLE = {
  "Pending":               {bg:"#fef3c7",color:"#92400e"},
  "Under Review":          {bg:"#dbeafe",color:"#1e40af"},
  "Document Verification": {bg:"#ede9fe",color:"#5b21b6"},
  "Approved":              {bg:"#d1fae5",color:"#065f46"},
  "Rejected":              {bg:"#fee2e2",color:"#991b1b"},
  "Disbursed":             {bg:"#d1fae5",color:"#064e3b"},
};

function Badge({status}) {
  const s = STATUS_STYLE[status]||{bg:"#f3f4f6",color:"#374151"};
  return <span className="vl-admin-badge" style={{background:s.bg,color:s.color}}>{status}</span>;
}

function DetailModal({app, onClose, onSave}) {
  const [status,  setStatus]  = useState(app.status);
  const [remarks, setRemarks] = useState(app.remarks||"");
  const [saving,  setSaving]  = useState(false);

  const save = async () => {
    setSaving(true);
    try { await onSave(app.application_id,{status,remarks}); onClose(); }
    catch { alert("Failed to update."); }
    finally { setSaving(false); }
  };

  const rows = [
    ["Application ID", app.application_id],
    ["Full Name",      app.full_name],
    ["Phone",          app.phone],
    ["Email",          app.email||"—"],
    ["City",           app.city||"—"],
    ["Vehicle Type",   app.vehicle_type||"—"],
    ["Condition",      app.vehicle_condition||"—"],
    ["Vehicle Price",  app.vehicle_price ? `₹${Number(app.vehicle_price).toLocaleString("en-IN")}` : "—"],
    ["Down Payment",   app.down_payment  ? `₹${Number(app.down_payment).toLocaleString("en-IN")}`  : "—"],
    ["Loan Amount",    app.loan_amount   ? `₹${Number(app.loan_amount).toLocaleString("en-IN")}`   : "—"],
    ["Monthly Income", app.monthly_income? `₹${Number(app.monthly_income).toLocaleString("en-IN")}`: "—"],
    ["Employment",     app.employment_type||"—"],
    ["Tenure",         app.tenure ? `${app.tenure} months` : "—"],
    ["Applied On",     new Date(app.created_at).toLocaleDateString("en-IN")],
  ];

  return (
    <div className="vl-modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="vl-modal">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h3 style={{margin:0}}>Application Details</h3>
          <button onClick={onClose} style={{fontSize:20,cursor:"pointer",color:"#6b7280",border:"none",background:"none"}}>✕</button>
        </div>
        <div className="vl-modal-rows">
          {rows.map(([l,v])=>(
            <div key={l} className="vl-modal-row"><span>{l}</span><strong>{v}</strong></div>
          ))}
        </div>
        <div className="vl-modal-field">
          <label>Update Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="vl-modal-field">
          <label>Remarks (optional)</label>
          <textarea value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder="Add any remarks or notes…"/>
        </div>
        <div className="vl-modal-actions">
          <button className="vl-btn-outline" onClick={onClose}>Cancel</button>
          <button className="vl-btn-primary" onClick={save} disabled={saving}>
            {saving?"Saving…":"Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VehicleLoanAdminNew() {
  const [apps,      setApps]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [search,    setSearch]    = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType,   setFilterType]   = useState("All");
  const [selected,  setSelected]  = useState(null);

  useEffect(() => {
    getVehicleLoanApplications()
      .then(r => setApps(r.data||[]))
      .catch(() => setError("Failed to load applications."))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id, data) => {
    await updateVehicleLoanStatus(id, data);
    setApps(apps.map(a => a.application_id===id ? {...a,...data} : a));
  };

  const vehicleTypes = ["All", ...new Set(apps.map(a=>a.vehicle_type).filter(Boolean))];

  const filtered = apps.filter(a => {
    const matchSearch = !search ||
      a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.application_id?.toLowerCase().includes(search.toLowerCase()) ||
      a.phone?.includes(search);
    const matchStatus = filterStatus==="All" || a.status===filterStatus;
    const matchType   = filterType==="All"   || a.vehicle_type===filterType;
    return matchSearch && matchStatus && matchType;
  });

  const stats = {
    total:    apps.length,
    pending:  apps.filter(a=>a.status==="Pending").length,
    approved: apps.filter(a=>a.status==="Approved").length,
    rejected: apps.filter(a=>a.status==="Rejected").length,
  };

  return (
    <div className="vl-page">
      <div className="vl-breadcrumb">
        <Link to="/admin">Admin</Link><span>›</span>
        <span>Vehicle Loan Applications</span>
      </div>

      <div className="vl-admin-page">
        <div className="vl-admin-header">
          <div>
            <h1>Vehicle Loan Applications</h1>
            <p style={{color:"#6b7280",fontSize:14,marginTop:4}}>Manage and update all vehicle loan applications</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Link to="/admin" className="vl-btn-outline" style={{fontSize:13,padding:"8px 16px"}}>← Admin Home</Link>
            <button className="vl-btn-blue" style={{fontSize:13,padding:"8px 16px"}}
              onClick={()=>{const c=apps.map(a=>[a.application_id,a.full_name,a.vehicle_type,a.loan_amount,a.status].join(",")).join("\n"); const b=new Blob(["ID,Name,Type,Amount,Status\n"+c],{type:"text/csv"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download="vehicle_loans.csv"; a.click();}}>
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
          {[
            {label:"Total Applications",val:stats.total,  color:"#1A56DB"},
            {label:"Pending",           val:stats.pending, color:"#f59e0b"},
            {label:"Approved",          val:stats.approved,color:"#10b981"},
            {label:"Rejected",          val:stats.rejected,color:"#ef4444"},
          ].map(s=>(
            <div key={s.label} style={{background:"#fff",border:"1px solid #e6edff",borderRadius:14,padding:"18px 20px",boxShadow:"0 2px 10px rgba(15,28,63,.05)"}}>
              <div style={{fontSize:26,fontWeight:800,color:s.color}}>{s.val}</div>
              <div style={{fontSize:13,color:"#6b7280",marginTop:3}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="vl-admin-toolbar">
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={filterType} onChange={e=>setFilterType(e.target.value)}>
            {vehicleTypes.map(t=><option key={t}>{t}</option>)}
          </select>
          <input placeholder="Search by name, ID, or phone…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{minWidth:260}}/>
        </div>

        {loading && <p style={{color:"#6b7280",padding:"32px 0"}}>Loading applications…</p>}
        {error   && <p style={{color:"#ef4444",padding:"32px 0"}}>{error}</p>}

        {!loading && !error && (
          <>
            <div style={{fontSize:13,color:"#6b7280",marginBottom:12}}>
              Showing {filtered.length} of {apps.length} applications
            </div>
            <div className="vl-admin-table-wrap">
              <table className="vl-admin-table">
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Applicant Name</th>
                    <th>Vehicle Type</th>
                    <th>Loan Amount</th>
                    <th>Status</th>
                    <th>Submitted On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length===0 && (
                    <tr><td colSpan={7} style={{textAlign:"center",padding:"32px",color:"#6b7280"}}>No applications found.</td></tr>
                  )}
                  {filtered.map(a=>(
                    <tr key={a.application_id}>
                      <td style={{fontWeight:700,color:"#1A56DB"}}>{a.application_id}</td>
                      <td>{a.full_name}</td>
                      <td>{a.vehicle_type||"—"}</td>
                      <td>{a.loan_amount ? `₹${Number(a.loan_amount).toLocaleString("en-IN")}` : "—"}</td>
                      <td><Badge status={a.status}/></td>
                      <td>{new Date(a.created_at).toLocaleDateString("en-IN")}</td>
                      <td>
                        <button className="vl-admin-action-btn vl-admin-action-btn--view" onClick={()=>setSelected(a)}>View</button>
                        <button className="vl-admin-action-btn vl-admin-action-btn--edit" onClick={()=>setSelected(a)}>Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selected && (
        <DetailModal app={selected} onClose={()=>setSelected(null)} onSave={handleStatusUpdate}/>
      )}
    </div>
  );
}