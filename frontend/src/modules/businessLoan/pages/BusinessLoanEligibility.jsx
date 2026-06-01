// ============================================================
//  BusinessLoanEligibility.jsx
//  Mirrors PersonalEligibility.jsx structure exactly
// ============================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../businessLoan.css";

const LOAN_TYPES  = ["Secured Business Loan", "Unsecured Business Loan", "Working Capital Loan", "Business Expansion Loan"];
const BIZ_TYPES   = ["Proprietorship", "Partnership", "Private Limited", "LLP", "Others"];
const PURPOSES    = ["Working Capital", "Business Expansion", "Equipment Purchase", "Inventory Financing", "Debt Consolidation", "New Branch Setup", "Marketing & Advertising", "Others"];

const SLUG_MAP = {
  "Secured Business Loan":   "secured-business-loan",
  "Unsecured Business Loan": "unsecured-business-loan",
  "Working Capital Loan":    "working-capital-loan",
  "Business Expansion Loan": "business-expansion-loan",
};

function checkEligibility(form) {
  const years    = parseFloat(form.yearsInBusiness) || 0;
  const turnover = parseFloat(form.annualTurnover)  || 0;
  const profit   = parseFloat(form.monthlyProfit)   || 0;
  const existing = parseFloat(form.existingLoans)   || 0;
  const required = parseFloat(form.requiredAmount)  || 0;

  const issues = [];
  if (years < 2)            issues.push("Business must be operational for at least 2 years.");
  if (turnover < 2500000)   issues.push("Annual turnover should be at least ₹25 Lakhs.");
  if (profit <= 0)          issues.push("Monthly profit must be positive.");
  if (existing > turnover * 0.5) issues.push("Existing loan obligations are high relative to turnover.");

  const eligible = issues.length === 0;
  const recommended = eligible
    ? Math.min(turnover * 0.8, 50000000, required * 1.1)
    : 0;

  return { eligible, issues, recommended };
}

const fmtAmt = v => {
  if (!v) return "—";
  const n = Math.round(v);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Crore`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} Lakh`;
  return "₹" + n.toLocaleString("en-IN");
};

export default function BusinessLoanEligibility() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    loanType: "", businessType: "", yearsInBusiness: "",
    annualTurnover: "", monthlyProfit: "", existingLoans: "",
    requiredAmount: "", purpose: "",
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  const set = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setResult(null); };

  const validate = () => {
    if (!form.loanType)         return alert("Please select a loan type."), false;
    if (!form.businessType)     return alert("Please select your business type."), false;
    if (!form.yearsInBusiness)  return alert("Please enter years in business."), false;
    if (!form.annualTurnover)   return alert("Please enter annual turnover."), false;
    if (!form.monthlyProfit)    return alert("Please enter monthly profit."), false;
    if (form.existingLoans === "") return alert("Please enter existing EMI (0 if none)."), false;
    if (!form.requiredAmount)   return alert("Please enter required loan amount."), false;
    if (!form.purpose)          return alert("Please select loan purpose."), false;
    return true;
  };

  const handleCheck = e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(checkEligibility(form));
      setLoading(false);
    }, 1200);
  };

  const slug = SLUG_MAP[form.loanType] || "";

  return (
    <div>

      {/* ── Hero ── */}
      <section className="bl-hero">
        <div className="container">
          <span className="section-label">Free Eligibility Check</span>
          <h1>Check Your <span>Business Loan</span> Eligibility</h1>
          <p>Answer a few questions and find out your eligible loan amount — instantly, for free.</p>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="bl-section">
        <div className="container">
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="card" style={{ padding: "40px" }}>

              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: 6 }}>
                Eligibility Checker
              </h2>
              <p style={{ fontSize: "0.87rem", color: "var(--color-muted)", marginBottom: 28 }}>
                Fill in your business details to see how much you can borrow.
              </p>

              <form onSubmit={handleCheck} noValidate>

                {/* Row 1 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                  <div className="bla-field">
                    <label>Loan Type <span className="req">*</span></label>
                    <select name="loanType" className="bla-field select" value={form.loanType} onChange={set}
                      style={{ padding: "10px 13px", border: "1.5px solid var(--color-border)", borderRadius: 8, fontSize: "0.9rem", fontFamily: "var(--font-body)", outline: "none", background: "#fff" }}>
                      <option value="">Select loan type</option>
                      {LOAN_TYPES.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="bla-field">
                    <label>Business Type <span className="req">*</span></label>
                    <select name="businessType" value={form.businessType} onChange={set}
                      style={{ padding: "10px 13px", border: "1.5px solid var(--color-border)", borderRadius: 8, fontSize: "0.9rem", fontFamily: "var(--font-body)", outline: "none", background: "#fff" }}>
                      <option value="">Select business type</option>
                      {BIZ_TYPES.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 2 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 18 }}>
                  {[
                    { name: "yearsInBusiness", label: "Years in Business", placeholder: "e.g. 4", type: "number" },
                    { name: "annualTurnover",  label: "Annual Turnover (₹)", placeholder: "e.g. 5000000", type: "number" },
                    { name: "monthlyProfit",   label: "Monthly Profit (₹)", placeholder: "e.g. 80000", type: "number" },
                  ].map(f => (
                    <div key={f.name} className="bla-field">
                      <label>{f.label} <span className="req">*</span></label>
                      <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={set}
                        style={{ padding: "10px 13px", border: "1.5px solid var(--color-border)", borderRadius: 8, fontSize: "0.9rem", fontFamily: "var(--font-body)", outline: "none" }} />
                    </div>
                  ))}
                </div>

                {/* Row 3 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                  {[
                    { name: "existingLoans",  label: "Existing Loan EMIs/Month (₹)", placeholder: "0 if none", type: "number" },
                    { name: "requiredAmount", label: "Required Loan Amount (₹)",     placeholder: "e.g. 2000000", type: "number" },
                  ].map(f => (
                    <div key={f.name} className="bla-field">
                      <label>{f.label} <span className="req">*</span></label>
                      <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={set}
                        style={{ padding: "10px 13px", border: "1.5px solid var(--color-border)", borderRadius: 8, fontSize: "0.9rem", fontFamily: "var(--font-body)", outline: "none" }} />
                    </div>
                  ))}
                </div>

                {/* Row 4 */}
                <div style={{ marginBottom: 28 }}>
                  <div className="bla-field">
                    <label>Purpose of Loan <span className="req">*</span></label>
                    <select name="purpose" value={form.purpose} onChange={set}
                      style={{ padding: "10px 13px", border: "1.5px solid var(--color-border)", borderRadius: 8, fontSize: "0.9rem", fontFamily: "var(--font-body)", outline: "none", background: "#fff" }}>
                      <option value="">Select purpose</option>
                      {PURPOSES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" className="bla-btn-primary" style={{ width: "100%", padding: 14 }} disabled={loading}>
                  {loading ? "⏳ Checking Eligibility..." : "Check My Eligibility →"}
                </button>
              </form>

              {/* ── Result ── */}
              {result && (
                <div style={{ marginTop: 28 }}>
                  {result.eligible ? (
                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #6ee7b7" }}>
                      <div style={{ background: "#d1fae5", padding: "20px 24px", display: "flex", gap: 14, alignItems: "center" }}>
                        <span style={{ fontSize: "1.8rem" }}>✅</span>
                        <div>
                          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "#065f46", marginBottom: 3 }}>
                            Congratulations! You're Eligible.
                          </div>
                          <div style={{ fontSize: "0.84rem", color: "#047857" }}>
                            Based on the information provided, you qualify for a business loan.
                          </div>
                        </div>
                      </div>
                      <div style={{ background: "var(--color-bg)", padding: "24px", borderTop: "1px solid #6ee7b7" }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#00C853", marginBottom: 4 }}>
                          {fmtAmt(result.recommended)}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginBottom: 20 }}>
                          Recommended loan amount based on your financials
                        </div>
                        <button
                          className="bla-btn-primary"
                          onClick={() => navigate(`/business-loan/apply?type=${slug}&amount=${Math.round(result.recommended)}`)}
                        >
                          Proceed to Apply →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #fca5a5" }}>
                      <div style={{ background: "#fee2e2", padding: "20px 24px", display: "flex", gap: 14, alignItems: "center" }}>
                        <span style={{ fontSize: "1.8rem" }}>❌</span>
                        <div>
                          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "#991b1b", marginBottom: 3 }}>
                            Not Eligible Right Now
                          </div>
                          <div style={{ fontSize: "0.84rem", color: "#b91c1c" }}>
                            Here's what needs to improve before you can apply.
                          </div>
                        </div>
                      </div>
                      <div style={{ background: "var(--color-bg)", padding: "20px 24px", borderTop: "1px solid #fca5a5" }}>
                        <ul className="bl-checklist">
                          {result.issues.map((issue, i) => (
                            <li key={i} style={{ borderColor: "#fca5a5" }}>
                              <span style={{ color: "#dc2626" }}>⚠</span>{issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
