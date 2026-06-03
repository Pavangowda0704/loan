// ============================================================
//  BusinessLoanTrack.jsx
//  Mirrors TrackApplication.jsx structure exactly
// ============================================================
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBusinessLoanById } from '../../../api/businessLoanApi.js'
import "../businessLoan.css";

const MOCK_STAGES = [
  { key: "received",    label: "Application Received",  icon: "📨", done: true,  active: false },
  { key: "documents",   label: "Document Verification", icon: "🔍", done: true,  active: false },
  { key: "assessment",  label: "Credit Assessment",     icon: "📊", done: false, active: true  },
  { key: "approval",    label: "In-Principle Approval", icon: "✅", done: false, active: false },
  { key: "disbursal",   label: "Loan Disbursal",        icon: "💰", done: false, active: false },
];

const MOCK_DATA = (id) => ({
  application_id: id,
  status: "credit_assessment",
  status_label: "Credit Assessment",
  loan_type: "Business Loan",
  loan_amount: 2500000,
  applicant_name: "Sample Applicant",
  business_name: "Sample Business Pvt. Ltd.",
  applied_on: new Date(Date.now() - 86400000 * 2).toISOString(),
  last_updated: new Date(Date.now() - 3600000).toISOString(),
  stages: MOCK_STAGES,
  assigned_rm: { name: "Priya Sharma", phone: "9876543210", email: "priya.sharma@plumzo.in" },
  remarks: "Your application is progressing well. Our team will contact you within 24 hours.",
});

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? "s" : ""} ago`;
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtAmt(v) {
  if (!v) return "—";
  const n = Number(v);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Crore`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} Lakh`;
  return "₹" + n.toLocaleString("en-IN");
}

export default function BusinessLoanTrack() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [inputId, setInputId]           = useState(applicationId || "");
  const [data, setData]                 = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchData = async (id) => {
    if (!id) return;
    setLoading(true); setError("");
    try {
      const res = await getBusinessLoanById(id);
      setData(res.data);
    } catch (err) {
      if (err.code === "ERR_NETWORK" || err.response?.status >= 500) {
        setData(MOCK_DATA(id)); // use mock in demo mode
      } else {
        setError("Application not found. Please check your Application ID.");
        setData(null);
      }
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => { if (applicationId) fetchData(applicationId); }, [applicationId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputId.trim()) return alert("Please enter your Application ID.");
    navigate(`/business-loan/track/${inputId.trim().toUpperCase()}`);
    fetchData(inputId.trim().toUpperCase());
  };

  const lastAppId = localStorage.getItem("bl_last_app_id");

  return (
    <div>

      {/* ── Hero ── */}
      <section style={{ background: "linear-gradient(135deg, var(--color-navy) 0%, #1a2a5e 100%)", padding: "56px 20px", textAlign: "center" }}>
        <div className="container">
          <span className="section-label">Application Tracker</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.7rem,3.5vw,2.4rem)", fontWeight: 800, color: "#fff", marginBottom: 10 }}>
            Track Your <span style={{ color: "#00C853" }}>Business Loan</span>
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", maxWidth: 440, margin: "0 auto" }}>
            Get real-time updates from submission to disbursal.
          </p>
        </div>
      </section>

      {/* ── Search ── */}
      <section style={{ background: "var(--color-bg)", padding: "0 20px" }}>
        <div className="container">
          <form onSubmit={handleSearch} style={{ maxWidth: 520, margin: "0 auto", padding: "40px 0 0" }}>
            <div className="card" style={{ padding: "32px 28px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-navy)", marginBottom: 18, fontSize: "1rem" }}>
                🔍 Enter Application ID
              </h3>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  placeholder="e.g. BLN1748521234567"
                  value={inputId}
                  onChange={e => setInputId(e.target.value)}
                  style={{ flex: 1, padding: "11px 14px", border: "1.5px solid var(--color-border)", borderRadius: 8, fontSize: "0.92rem", fontFamily: "var(--font-body)", outline: "none", letterSpacing: "0.03em" }}
                />
                <button type="submit" className="bla-btn-primary" style={{ whiteSpace: "nowrap" }}>
                  Track →
                </button>
              </div>
              {lastAppId && !applicationId && (
                <div style={{ marginTop: 14, fontSize: "0.8rem", color: "var(--color-muted)" }}>
                  Last application:{" "}
                  <button
                    type="button"
                    style={{ color: "#00C853", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.8rem" }}
                    onClick={() => { setInputId(lastAppId); navigate(`/business-loan/track/${lastAppId}`); fetchData(lastAppId); }}
                  >
                    {lastAppId}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div className="bla-spinner" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>Fetching application status...</p>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div style={{ maxWidth: 500, margin: "32px auto", padding: "0 20px" }}>
          <div style={{ background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: 12, padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: 10 }}>❌</div>
            <p style={{ color: "#991b1b", fontWeight: 600, marginBottom: 14 }}>{error}</p>
            <button className="bla-btn-outline" onClick={() => { setError(""); setData(null); navigate("/business-loan/track"); }}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* ── Result ── */}
      {!loading && data && (
        <section className="bl-section">
          <div className="container">

            {/* Header card */}
            <div className="card" style={{ padding: "24px 28px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-muted)", marginBottom: 6 }}>Application ID</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "#00C853", letterSpacing: "0.04em", marginBottom: 10 }}>
                  {data.application_id}
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: "#d1fae5", border: "1px solid #6ee7b7", fontSize: "0.78rem", fontWeight: 700, color: "#065f46" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00C853", display: "inline-block" }} />
                  {data.status_label || data.status}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.78rem", color: "var(--color-muted)", marginBottom: 4 }}>Applied: {fmtDate(data.applied_on)}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--color-muted)", marginBottom: 14 }}>Updated: {timeAgo(data.last_updated)}</div>
                <button className="bla-btn-outline" style={{ padding: "7px 14px", fontSize: "0.8rem" }} onClick={() => fetchData(data.application_id)}>
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Summary strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
              {[
                ["Applicant", data.applicant_name],
                ["Business",  data.business_name],
                ["Loan Type", data.loan_type],
                ["Amount",    fmtAmt(data.loan_amount)],
              ].map(([l, v]) => (
                <div key={l} style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{l}</div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--color-navy)" }}>{v || "—"}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

              {/* Timeline */}
              <div className="card" style={{ padding: "28px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-navy)", fontSize: "1rem", marginBottom: 24 }}>
                  Application Progress
                </h3>
                <div className="bla-timeline">
                  {(data.stages || []).map((stage, i) => (
                    <div key={stage.key || i} className="bla-timeline-item">
                      <div className="bla-timeline-dot" style={{
                        background: stage.done ? "#d1fae5" : stage.active ? "#e8faf0" : "var(--color-bg)",
                        borderColor: stage.done ? "#00C853" : stage.active ? "#00C853" : "var(--color-border)",
                      }}>
                        {stage.done ? "✓" : stage.icon || (i + 1)}
                      </div>
                      <div className="bla-timeline-content">
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                          <h4 style={{ color: stage.done ? "#065f46" : stage.active ? "var(--color-navy)" : "var(--color-muted)" }}>
                            {stage.label}
                          </h4>
                          {stage.active && (
                            <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "2px 7px", background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 20, color: "#92400e" }}>
                              IN PROGRESS
                            </span>
                          )}
                          {stage.done && (
                            <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "2px 7px", background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 20, color: "#065f46" }}>
                              DONE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right col */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Remarks */}
                {data.remarks && (
                  <div style={{ background: "#fefce8", border: "1.5px solid #fde68a", borderRadius: 10, padding: "16px" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#92400e", marginBottom: 8 }}>📋 Remarks</div>
                    <p style={{ fontSize: "0.83rem", color: "#78350f", lineHeight: 1.6 }}>{data.remarks}</p>
                  </div>
                )}

                {/* RM */}
                {data.assigned_rm && (
                  <div className="card" style={{ padding: "18px" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#00C853", marginBottom: 12 }}>
                      Your Relationship Manager
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, color: "#00C853", fontSize: "1rem", flexShrink: 0 }}>
                        {data.assigned_rm.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-navy)", fontSize: "0.9rem" }}>{data.assigned_rm.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>Relationship Manager</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <a href={`tel:${data.assigned_rm.phone}`} style={{ fontSize: "0.82rem", color: "var(--color-body)", textDecoration: "none", display: "flex", gap: 6 }}>
                        <span>📞</span>{data.assigned_rm.phone}
                      </a>
                      <a href={`mailto:${data.assigned_rm.email}`} style={{ fontSize: "0.82rem", color: "var(--color-body)", textDecoration: "none", display: "flex", gap: 6 }}>
                        <span>✉️</span>{data.assigned_rm.email}
                      </a>
                    </div>
                  </div>
                )}

                {lastRefreshed && (
                  <div style={{ fontSize: "0.7rem", color: "var(--color-muted)", textAlign: "center" }}>
                    Last refreshed: {lastRefreshed.toLocaleTimeString("en-IN")}
                  </div>
                )}

                <button className="bla-btn-primary" style={{ width: "100%", textAlign: "center" }} onClick={() => navigate("/business-loan/apply")}>
                  Apply for Another Loan
                </button>
                <button className="bla-btn-outline" style={{ width: "100%", textAlign: "center" }} onClick={() => navigate("/business-loan")}>
                  ← Business Loans Home
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
