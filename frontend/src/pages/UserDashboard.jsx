// frontend/src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyApps } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./UserDashboard.css";

const STATUS_STEPS = [
  "Pending",
  "Under Review",
  "Document Verification",
  "Approved",
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

const LOAN_ICONS = {
  personal: "💰",
  vehicle:  "🚗",
  home:     "🏠",
  business: "💼",
};

const LOAN_LABELS = {
  personal: "Personal Loan",
  vehicle:  "Vehicle Loan",
  home:     "Home Loan",
  business: "Business Loan",
};

const APPLY_LINKS = {
  personal: "/personal-loan/apply",
  vehicle:  "/vehicle-loan/apply",
  home:     "/home-loan/apply",
  business: "/business-loan/apply",
};

function fmtMoney(v) {
  if (!v) return "—";
  return "₹" + Number(v).toLocaleString("en-IN");
}

function fmtDate(v) {
  if (!v) return "—";
  return new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusProgress({ status }) {
  if (status === "Rejected") {
    return (
      <div className="ud-progress-rejected">
        <span>❌</span> Application Rejected
      </div>
    );
  }
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="ud-progress">
      {STATUS_STEPS.map((s, i) => {
        const done   = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s} className="ud-progress-step">
            <div className={`ud-progress-dot ${done ? "done" : active ? "active" : ""}`}>
              {done ? "✓" : i + 1}
            </div>
            <span className={`ud-progress-label ${active ? "active" : done ? "done" : ""}`}>
              {s}
            </span>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`ud-progress-line ${done ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function LoanCard({ app }) {
  const style = STATUS_COLORS[app.status] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <div className="ud-loan-card">
      <div className="ud-loan-card-header">
        <div className="ud-loan-type">
          <span className="ud-loan-icon">{LOAN_ICONS[app.loan_type] || "📋"}</span>
          <div>
            <div className="ud-loan-type-label">{LOAN_LABELS[app.loan_type] || app.loan_type}</div>
            <div className="ud-loan-sublabel">{app.label || "—"}</div>
          </div>
        </div>
        <span
          className="ud-status-badge"
          style={{ background: style.bg, color: style.color }}
        >
          {app.status}
        </span>
      </div>

      <div className="ud-loan-meta">
        <div className="ud-meta-item">
          <span className="ud-meta-label">Application ID</span>
          <span className="ud-meta-val ud-app-id">{app.application_id}</span>
        </div>
        <div className="ud-meta-item">
          <span className="ud-meta-label">Loan Amount</span>
          <span className="ud-meta-val">{fmtMoney(app.loan_amount)}</span>
        </div>
        <div className="ud-meta-item">
          <span className="ud-meta-label">Applied On</span>
          <span className="ud-meta-val">{fmtDate(app.created_at)}</span>
        </div>
      </div>

      <StatusProgress status={app.status} />

      {app.remarks && (
        <div className="ud-remarks">
          <span>💬</span> <span>{app.remarks}</span>
        </div>
      )}
    </div>
  );
}

export default function UserDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("All");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login", { replace: true }); return; }

    getMyApps()
      .then(res => setApps(res.data.applications || []))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const FILTERS = ["All", "Personal Loan", "Vehicle Loan", "Home Loan", "Business Loan",
                   "Pending", "Under Review", "Approved", "Rejected", "Disbursed"];

  const filtered = apps.filter(a => {
    if (filter === "All") return true;
    const label = LOAN_LABELS[a.loan_type] || "";
    if (label === filter) return true;
    return a.status === filter;
  });

  if (authLoading || loading) {
    return (
      <div className="ud-page">
        <div className="ud-loading">Loading your applications…</div>
      </div>
    );
  }

  return (
    <div className="ud-page">
      <div className="ud-container">

        {/* Header */}
        <div className="ud-header">
          <div>
            <div className="ud-greeting">👋 Welcome back, {user?.name?.split(" ")[0] || "User"}</div>
            <h1 className="ud-title">My Loan Applications</h1>
            <p className="ud-sub">{user?.email || user?.phone}</p>
          </div>
          <button className="ud-logout-btn" onClick={() => { logout(); navigate("/"); }}>
            Sign Out
          </button>
        </div>

        {/* Summary stats */}
        <div className="ud-stats">
          {[
            { label: "Total Applied",  value: apps.length },
            { label: "Under Review",   value: apps.filter(a => a.status === "Under Review").length },
            { label: "Approved",       value: apps.filter(a => a.status === "Approved").length },
            { label: "Pending",        value: apps.filter(a => a.status === "Pending").length },
          ].map(s => (
            <div key={s.label} className="ud-stat-card">
              <div className="ud-stat-num">{s.value}</div>
              <div className="ud-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Apply new loan CTA */}
        <div className="ud-apply-bar">
          <span>Want to apply for a new loan?</span>
          <div className="ud-apply-links">
            {Object.entries(APPLY_LINKS).map(([type, url]) => (
              <Link key={type} to={url} className="ud-apply-link">
                {LOAN_ICONS[type]} {LOAN_LABELS[type]}
              </Link>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="ud-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`ud-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Loan cards */}
        {filtered.length === 0 ? (
          <div className="ud-empty">
            <div className="ud-empty-icon">📭</div>
            <h3>No applications found</h3>
            <p>
              {apps.length === 0
                ? "You haven't applied for any loans yet."
                : "No applications match this filter."}
            </p>
            {apps.length === 0 && (
              <Link to="/personal-loan/apply" className="ud-apply-cta">
                Apply for a Loan →
              </Link>
            )}
          </div>
        ) : (
          <div className="ud-cards-grid">
            {filtered.map(app => (
              <LoanCard key={app.application_id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}