// ============================================================
//  VehicleLoanAdminNew.jsx — Admin Panel
//  Route: /admin/vehicle-loans
//  FIXED: skeleton loader, pagination, toast (no alert),
//         CSV export with all fields, sort by column
// ============================================================
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getVehicleLoanApplications, updateVehicleLoanStatus } from "../../../api/vehicleLoanApi.js";
import "../vehicleLoan.css";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  "Pending","Under Review","Document Verification","Approved","Rejected","Disbursed",
];

const STATUS_STYLE = {
  "Pending":               { bg:"#fef3c7", color:"#92400e" },
  "Under Review":          { bg:"#dbeafe", color:"#1e40af" },
  "Document Verification": { bg:"#ede9fe", color:"#5b21b6" },
  "Approved":              { bg:"#d1fae5", color:"#065f46" },
  "Rejected":              { bg:"#fee2e2", color:"#991b1b" },
  "Disbursed":             { bg:"#d1fae5", color:"#064e3b" },
};

const fmt = v => v ? "₹" + Number(v).toLocaleString("en-IN") : "—";

// ── Toast notification ───────────────────────────────────────
function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const bg = type === "success" ? "#d1fae5" : "#fee2e2";
  const color = type === "success" ? "#065f46" : "#991b1b";
  const icon  = type === "success" ? "✓" : "⚠";
  return (
    <div className="vl-toast" style={{ background: bg, color }} role="alert">
      <span>{icon} {msg}</span>
      <button onClick={onClose} aria-label="Dismiss" className="vl-toast-close">✕</button>
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────
function Badge({ status }) {
  const s = STATUS_STYLE[status] || { bg:"#f3f4f6", color:"#374151" };
  return (
    <span className="vl-admin-badge" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

// ── Skeleton row ─────────────────────────────────────────────
function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="vl-skeleton-row">
      {Array.from({ length: 7 }).map((_, j) => (
        <td key={j}><div className="vl-skeleton-cell" /></td>
      ))}
    </tr>
  ));
}

// ── Detail & Update Modal ────────────────────────────────────
function DetailModal({ app, onClose, onSave }) {
  const [status,  setStatus]  = useState(app.status);
  const [remarks, setRemarks] = useState(app.remarks || "");
  const [saving,  setSaving]  = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onSave(app.application_id, { status, remarks });
      onClose();
    } catch {
      onClose("error");
    } finally { setSaving(false); }
  };

  const rows = [
    ["Application ID", app.application_id],
    ["Full Name",      app.full_name],
    ["Phone",          app.phone],
    ["Email",          app.email || "—"],
    ["City",           app.city || "—"],
    ["Vehicle Type",   app.vehicle_type || "—"],
    ["Condition",      app.vehicle_condition || "—"],
    ["Vehicle Price",  fmt(app.vehicle_price)],
    ["Down Payment",   fmt(app.down_payment)],
    ["Loan Amount",    fmt(app.loan_amount)],
    ["Monthly Income", fmt(app.monthly_income)],
    ["Employment",     app.employment_type || "—"],
    ["Company",        app.company_name || "—"],
    ["Tenure",         app.tenure ? `${app.tenure} months` : "—"],
    ["Interest Rate",  app.interest_rate ? `${app.interest_rate}%` : "—"],
    ["PAN",            app.pan_number || "—"],
    ["Applied On",     app.created_at ? new Date(app.created_at).toLocaleDateString("en-IN") : "—"],
  ];

  return (
    <div className="vl-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="vl-modal">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h3 style={{ margin:0 }}>Application Details</h3>
          <button onClick={onClose} className="vl-modal-close" aria-label="Close">✕</button>
        </div>

        <div className="vl-modal-rows">
          {rows.map(([l, v]) => (
            <div key={l} className="vl-modal-row">
              <span>{l}</span><strong>{v}</strong>
            </div>
          ))}
        </div>

        {/* Current status */}
        <div style={{ marginBottom:12 }}>
          <span style={{ fontSize:12, color:"#6b7280" }}>Current Status: </span>
          <Badge status={app.status} />
        </div>

        <div className="vl-modal-field">
          <label>Update Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="vl-modal-field">
          <label>Remarks (optional)</label>
          <textarea value={remarks} onChange={e => setRemarks(e.target.value)}
            placeholder="Add any remarks or notes…" />
        </div>
        <div className="vl-modal-actions">
          <button className="vl-btn-outline" onClick={onClose}>Cancel</button>
          <button className="vl-btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ──────────────────────────────────────────
export default function VehicleLoanAdminNew() {
  const [apps,         setApps]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType,   setFilterType]   = useState("All");
  const [selected,     setSelected]     = useState(null);
  const [page,         setPage]         = useState(1);
  const [sortKey,      setSortKey]      = useState("created_at");
  const [sortDir,      setSortDir]      = useState("desc");
  const [toast,        setToast]        = useState({ msg:"", type:"" });

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"" }), 4000);
  }, []);

  useEffect(() => {
    getVehicleLoanApplications()
      .then(r => setApps(r.data || []))
      .catch(() => setError("Failed to load applications. Please refresh the page."))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id, data) => {
    await updateVehicleLoanStatus(id, data);
    setApps(prev => prev.map(a => a.application_id === id ? { ...a, ...data } : a));
    showToast(`Application ${id} updated to "${data.status}"`, "success");
  };

  const handleModalClose = (err) => {
    setSelected(null);
    if (err === "error") showToast("Failed to update. Please try again.", "error");
  };

  // Sort handler
  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };
  const SortIcon = ({ k }) => sortKey !== k ? " ⇅" : sortDir === "asc" ? " ↑" : " ↓";

  const vehicleTypes = ["All", ...new Set(apps.map(a => a.vehicle_type).filter(Boolean))];

  // Filter
  const filtered = apps.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !search
      || a.full_name?.toLowerCase().includes(q)
      || a.application_id?.toLowerCase().includes(q)
      || a.phone?.includes(q)
      || a.email?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    const matchType   = filterType   === "All" || a.vehicle_type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortKey] ?? "", vb = b[sortKey] ?? "";
    if (sortKey === "loan_amount" || sortKey === "monthly_income") {
      va = Number(va); vb = Number(vb);
    } else if (sortKey === "created_at") {
      va = new Date(va); vb = new Date(vb);
    }
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Stats
  const stats = {
    total:    apps.length,
    pending:  apps.filter(a => a.status === "Pending").length,
    approved: apps.filter(a => a.status === "Approved").length,
    rejected: apps.filter(a => a.status === "Rejected").length,
    disbursed:apps.filter(a => a.status === "Disbursed").length,
  };

  // CSV export
  const exportCSV = () => {
    const header = "ID,Name,Phone,Email,Vehicle Type,Loan Amount,Income,Employment,Status,Applied On";
    const rows = apps.map(a => [
      a.application_id, a.full_name, a.phone, a.email || "",
      a.vehicle_type || "", a.loan_amount || "", a.monthly_income || "",
      a.employment_type || "", a.status,
      a.created_at ? new Date(a.created_at).toLocaleDateString("en-IN") : "",
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([header + "\n" + rows], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `vehicle_loans_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported successfully", "success");
  };

  return (
    <div className="vl-page">
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg:"", type:"" })} />

      <div className="vl-breadcrumb">
        <Link to="/admin">Admin</Link><span>›</span>
        <span>Vehicle Loan Applications</span>
      </div>

      <div className="vl-admin-page">
        {/* Header */}
        <div className="vl-admin-header">
          <div>
            <h1>Vehicle Loan Applications</h1>
            <p style={{ color:"#6b7280", fontSize:14, marginTop:4 }}>
              Manage, filter and update all vehicle loan applications
            </p>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <Link to="/admin" className="vl-btn-outline" style={{ fontSize:13, padding:"8px 16px" }}>
              ← Admin Home
            </Link>
            <button className="vl-btn-blue" style={{ fontSize:13, padding:"8px 16px" }} onClick={exportCSV}>
              ⬇ Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="vl-admin-stats-grid">
          {[
            { label:"Total",    val:stats.total,    color:"#1A56DB", icon:"📋" },
            { label:"Pending",  val:stats.pending,  color:"#f59e0b", icon:"⏳" },
            { label:"Approved", val:stats.approved, color:"#10b981", icon:"✅" },
            { label:"Rejected", val:stats.rejected, color:"#ef4444", icon:"❌" },
            { label:"Disbursed",val:stats.disbursed,color:"#8b5cf6", icon:"💳" },
          ].map(s => (
            <div key={s.label} className="vl-admin-stat-card">
              <div className="vl-admin-stat-icon">{s.icon}</div>
              <div className="vl-admin-stat-val" style={{ color:s.color }}>{s.val}</div>
              <div className="vl-admin-stat-lab">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="vl-admin-toolbar">
          <input placeholder="Search by name, ID, phone, or email…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ minWidth:260 }} />
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
            {vehicleTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          {(search || filterStatus !== "All" || filterType !== "All") && (
            <button className="vl-btn-outline" style={{ fontSize:12, padding:"8px 12px" }}
              onClick={() => { setSearch(""); setFilterStatus("All"); setFilterType("All"); setPage(1); }}>
              Clear Filters
            </button>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="vl-admin-error">
            <span>⚠ {error}</span>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {/* Table */}
        {!error && (
          <>
            <div style={{ fontSize:13, color:"#6b7280", marginBottom:10, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
              <span>Showing {paginated.length} of {filtered.length} applications (Page {page}/{totalPages})</span>
              {filtered.length !== apps.length && (
                <span style={{ color:"#f97316", fontWeight:600 }}>
                  {apps.length - filtered.length} filtered out
                </span>
              )}
            </div>

            <div className="vl-admin-table-wrap">
              <table className="vl-admin-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("application_id")} className="vl-sortable">
                      ID<SortIcon k="application_id"/>
                    </th>
                    <th onClick={() => handleSort("full_name")} className="vl-sortable">
                      Applicant<SortIcon k="full_name"/>
                    </th>
                    <th>Contact</th>
                    <th onClick={() => handleSort("vehicle_type")} className="vl-sortable">
                      Vehicle Type<SortIcon k="vehicle_type"/>
                    </th>
                    <th onClick={() => handleSort("loan_amount")} className="vl-sortable">
                      Loan Amount<SortIcon k="loan_amount"/>
                    </th>
                    <th onClick={() => handleSort("status")} className="vl-sortable">
                      Status<SortIcon k="status"/>
                    </th>
                    <th onClick={() => handleSort("created_at")} className="vl-sortable">
                      Applied<SortIcon k="created_at"/>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <SkeletonRows />}
                  {!loading && paginated.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign:"center", padding:"48px 0", color:"#6b7280" }}>
                        <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
                        No applications found for the selected filters.
                      </td>
                    </tr>
                  )}
                  {!loading && paginated.map(a => (
                    <tr key={a.application_id}>
                      <td style={{ fontWeight:700, color:"#1A56DB", fontSize:12 }}>
                        {a.application_id}
                      </td>
                      <td>
                        <div style={{ fontWeight:700, color:"#0F1C3F" }}>{a.full_name}</div>
                        <div style={{ fontSize:11, color:"#6b7280" }}>{a.city || "—"}</div>
                      </td>
                      <td>
                        <div style={{ fontSize:12 }}>{a.phone}</div>
                        <div style={{ fontSize:11, color:"#6b7280" }}>{a.email || "—"}</div>
                      </td>
                      <td>
                        <div style={{ fontSize:13 }}>{a.vehicle_type || "—"}</div>
                        <div style={{ fontSize:11, color:"#6b7280" }}>{a.vehicle_condition || ""}</div>
                      </td>
                      <td style={{ fontWeight:700, color:"#0F1C3F" }}>
                        {fmt(a.loan_amount)}
                        <div style={{ fontSize:11, color:"#6b7280" }}>Income: {fmt(a.monthly_income)}</div>
                      </td>
                      <td><Badge status={a.status} /></td>
                      <td style={{ fontSize:12, color:"#6b7280" }}>
                        {a.created_at ? new Date(a.created_at).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td>
                        <button className="vl-admin-action-btn vl-admin-action-btn--view"
                          onClick={() => setSelected(a)}>View</button>
                        <button className="vl-admin-action-btn vl-admin-action-btn--edit"
                          onClick={() => setSelected(a)}>Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="vl-admin-pagination">
                <button className="vl-page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
                <button className="vl-page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && arr[idx-1] !== p - 1) acc.push("...");
                    acc.push(p); return acc;
                  }, [])
                  .map((p, i) => p === "..." ? (
                    <span key={`e${i}`} className="vl-page-ellipsis">…</span>
                  ) : (
                    <button key={p} className={`vl-page-btn${page === p ? " active" : ""}`}
                      onClick={() => setPage(p)}>{p}</button>
                  ))
                }
                <button className="vl-page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>›</button>
                <button className="vl-page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
                <span style={{ fontSize:12, color:"#6b7280", marginLeft:8 }}>
                  {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <DetailModal app={selected} onClose={handleModalClose} onSave={handleStatusUpdate} />
      )}
    </div>
  );
}
