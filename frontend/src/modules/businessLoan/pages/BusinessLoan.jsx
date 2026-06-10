// ============================================================
//  BusinessLoan.jsx — Business Loan Landing Page
//  Mirrors PersonalLoan.jsx / VehicleLoanHome.jsx structure
// ============================================================
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../businessLoan.css";

const LOAN_TYPES = [
  {
    id: "secured-business-loan",
    icon: "🏛️",
    name: "Secured Business Loan",
    desc: "Collateral-backed loans for large capital requirements at the lowest rates.",
    features: ["Up to ₹5 Crore", "From 10% p.a.", "Tenure up to 7 years", "Lower EMI burden"],
    rate: "10%",
  },
  {
    id: "unsecured-business-loan",
    icon: "⚡",
    name: "Unsecured Business Loan",
    desc: "No collateral needed. Get quick approval and funds for any business need.",
    features: ["Up to ₹75 Lakhs", "From 12% p.a.", "Approval in 48 hours", "No asset pledge"],
    rate: "12%",
  },
  {
    id: "working-capital-loan",
    icon: "🔄",
    name: "Working Capital Loan",
    desc: "Short-term financing to manage daily operations and bridge cash flow gaps.",
    features: ["Up to ₹1 Crore", "From 11% p.a.", "Revolving credit option", "Flexible tenure"],
    rate: "11%",
  },
  {
    id: "business-expansion-loan",
    icon: "📈",
    name: "Business Expansion Loan",
    desc: "Scale your business — new branches, equipment, markets, and more.",
    features: ["Up to ₹5 Crore", "From 10.5% p.a.", "Project-linked disbursal", "Up to 7 years"],
    rate: "10.5%",
  },
];

const WHY_US = [
  { icon: "⚡", title: "Fast Disbursal",       desc: "Funds in your account within 48–72 hours of approval." },
  { icon: "📄", title: "Minimal Docs",          desc: "Streamlined digital process with fewer paper requirements." },
  { icon: "🔒", title: "100% Secure",           desc: "Bank-level encryption for all your data and documents." },
  { icon: "💰", title: "Competitive Rates",     desc: "Interest rates starting from 10% p.a. — among India's lowest." },
  { icon: "🧮", title: "Flexible Repayment",    desc: "Tenure from 1 to 7 years with EMI suited to your cash flow." },
  { icon: "🤝", title: "Dedicated Support",     desc: "Relationship manager assigned throughout your loan journey." },
];

const ELIGIBILITY = [
  "Indian resident / business registered in India",
  "Business operational for at least 2 years",
  "Annual business turnover ≥ ₹25 Lakhs",
  "CIBIL score ≥ 650",
  "Applicant age between 21 and 65 years",
  "No active NPA or loan default on record",
  "Valid GST registration (above threshold)",
  "Positive net cash flow for last 2 financial years",
];

const DOC_GROUPS = [
  { title: "KYC Documents",         docs: ["Aadhaar Card", "PAN Card (Personal)", "Passport Size Photo"] },
  { title: "Business Documents",    docs: ["GST Registration Certificate", "Business Ownership Proof", "IT Returns – Last 2 Years", "Business Bank Statement – 6 Months"] },
  { title: "Financial Documents",   docs: ["Audited Balance Sheet", "Profit & Loss Statement"] },
  { title: "Collateral (Secured)",  docs: ["Property Documents / Sale Deed", "Property Valuation Report", "Encumbrance Certificate"] },
];

const PROCESS = [
  { title: "Check Eligibility",      desc: "Use our free checker to know your eligible loan amount instantly." },
  { title: "Submit Application",     desc: "Fill our simple 6-step online form with personal & business details." },
  { title: "Upload Documents",       desc: "Upload all KYC, business, and financial documents digitally." },
  { title: "Verification & Approval",desc: "Our team verifies your application within 24 hours." },
  { title: "Loan Disbursal",         desc: "Approved funds are credited to your business account within 48–72 hours." },
];

const FAQS = [
  { q: "What is the maximum loan amount?",              a: "You can borrow up to ₹5 Crore depending on loan type, turnover, and creditworthiness." },
  { q: "Do I need collateral?",                         a: "Only for Secured Business Loans. Unsecured, Working Capital, and Expansion loans do not require collateral." },
  { q: "How quickly will I receive the funds?",         a: "Post-approval, funds are typically disbursed within 48–72 business hours." },
  { q: "What is the minimum CIBIL score required?",     a: "A score of 650+ is preferred. Strong business financials can compensate for a lower score." },
  { q: "Can startups apply?",                           a: "Our loans require at least 2 years of business operation. Startups may apply with a co-applicant." },
  { q: "Are there prepayment charges?",                 a: "Nil prepayment charges after 12 months of loan servicing. 2% fee applies within the first 12 months." },
];

const calcEMI = (p, r, n) => {
  if (!p || !r || !n) return 0;
  const rm = r / 12 / 100;
  return Math.round(p * rm * Math.pow(1 + rm, n) / (Math.pow(1 + rm, n) - 1));
};
const fmtINR = v => "₹" + Math.round(v).toLocaleString("en-IN");
const fmtAmt = v => {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(2)} L`;
  return "₹" + v.toLocaleString("en-IN");
};

export default function BusinessLoan() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  // EMI Calculator state
  const [emiAmount,  setEmiAmount]  = useState(2500000);
  const [emiTenure,  setEmiTenure]  = useState(36);
  const [emiRate,    setEmiRate]    = useState(12);
  const emi          = calcEMI(emiAmount, emiRate, emiTenure);
  const totalPayable = emi * emiTenure;
  const totalInterest = totalPayable - emiAmount;

  return (
    <div>

      {/* ── Hero ── */}
      <section className="bl-hero">
        <div className="container">
          <span className="section-label">Business Loan Solutions</span>
          <h1>Fuel Your <span>Business Growth</span><br />With Smart Financing</h1>
          <p>
            Access working capital, expansion funds, and business credit with quick
            approval, competitive rates, and minimal documentation.
          </p>
          <div className="bl-hero-actions">
            <button className="btn btn-primary" onClick={() => navigate("/business-loan/apply")}>
              Apply Now →
            </button>
            <button
              className="btn btn-white"
              style={{ border: "2px solid rgba(255,255,255,0.35)", color: "#fff", background: "transparent" }}
              onClick={() => navigate("/business-loan/eligibility")}
            >
              Check Eligibility
            </button>
            <button
              className="btn btn-white"
              style={{ border: "2px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.8)", background: "transparent" }}
              onClick={() => navigate("/business-loan/compare")}
            >
              Compare Loans
            </button>
          </div>
          <div className="bl-hero-stats">
            {[
              { val: "₹5 Cr",  label: "Max Loan"          },
              { val: "10%",    label: "From p.a."          },
              { val: "48 hrs", label: "Disbursal"          },
              { val: "50K+",   label: "Businesses Funded"  },
            ].map(s => (
              <div key={s.label} className="bl-hero-stat">
                <span className="bl-hero-stat-val">{s.val}</span>
                <span className="bl-hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Loan Types ── */}
      <section className="bl-section">
        <div className="container">
          <div className="bl-section-head center">
            <span className="section-label">Loan Products</span>
            <h2 className="section-title">Business Loan Solutions</h2>
            <p className="section-subtitle">
              Choose the right loan type tailored to your business needs and financial profile.
            </p>
          </div>
          <div className="bl-cards-grid">
            {LOAN_TYPES.map(lt => (
              <div key={lt.id} className="bl-loan-card" onClick={() => navigate(`/business-loan/${lt.id}`)}>
                <div className="bl-loan-card-icon">{lt.icon}</div>
                <div className="bl-loan-card-name">{lt.name}</div>
                <p className="bl-loan-card-desc">{lt.desc}</p>
                <ul className="bl-loan-card-features">
                  {lt.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <div className="bl-loan-card-footer">
                  <span className="bl-loan-card-rate">From <strong>{lt.rate}</strong> p.a.</span>
                  <button
                    className="btn btn-primary"
                    style={{ padding: "8px 16px", fontSize: "0.82rem" }}
                    onClick={e => { e.stopPropagation(); navigate(`/business-loan/apply?type=${lt.id}`); }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bl-section-alt">
        <div className="container">
          <div className="bl-section-head center">
            <span className="section-label">Why Plumzo</span>
            <h2 className="section-title">The Smartest Way to Finance Your Business</h2>
            <p className="section-subtitle">
              Speed, simplicity, and transparency — the Plumzo difference.
            </p>
          </div>
          <div className="bl-features-grid">
            {WHY_US.map(f => (
              <div key={f.title} className="bl-feature-item">
                <div className="bl-feature-icon">{f.icon}</div>
                <div className="bl-feature-text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMI Calculator ── */}
      <section className="bl-section">
        <div className="container">
          <div className="bl-section-head center">
            <span className="section-label">EMI Calculator</span>
            <h2 className="section-title">Plan Your Repayments</h2>
            <p className="section-subtitle">
              Estimate your monthly EMI before you apply.
            </p>
          </div>
          <div className="bl-emi-wrap">
            <div className="bl-emi-inputs">
              <div className="bl-emi-title">📊 Business Loan EMI Calculator</div>
              <div className="bl-emi-field">
                <label>Loan Amount <span>{fmtAmt(emiAmount)}</span></label>
                <input type="range" className="bl-emi-slider"
                  min={100000} max={50000000} step={100000}
                  value={emiAmount} onChange={e => setEmiAmount(Number(e.target.value))} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#6B7280", marginTop: 4 }}>
                  <span>₹1 L</span><span>₹5 Cr</span>
                </div>
              </div>
              <div className="bl-emi-field">
                <label>Tenure <span>{emiTenure} Months</span></label>
                <input type="range" className="bl-emi-slider"
                  min={12} max={84} step={6}
                  value={emiTenure} onChange={e => setEmiTenure(Number(e.target.value))} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#6B7280", marginTop: 4 }}>
                  <span>12 Mo</span><span>84 Mo</span>
                </div>
              </div>
              <div className="bl-emi-field">
                <label>Interest Rate (p.a.) <span>{emiRate}%</span></label>
                <input type="range" className="bl-emi-slider"
                  min={8} max={24} step={0.5}
                  value={emiRate} onChange={e => setEmiRate(Number(e.target.value))} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#6B7280", marginTop: 4 }}>
                  <span>8%</span><span>24%</span>
                </div>
              </div>
            </div>
            <div className="bl-emi-results">
              <div className="bl-emi-result-label">Monthly EMI</div>
              <div className="bl-emi-result-main">{fmtINR(emi)}</div>
              <div className="bl-emi-result-sub">Per month for {emiTenure} months</div>
              <div className="bl-emi-breakdown">
                {[
                  ["Principal Amount", fmtAmt(emiAmount)],
                  ["Total Interest",   fmtINR(totalInterest)],
                  ["Total Payable",    fmtINR(totalPayable)],
                ].map(([l, v]) => (
                  <div key={l} className="bl-emi-breakdown-item">
                    <span className="lbl">{l}</span>
                    <span className="val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Eligibility & Documents ── */}
      <section className="bl-section-alt">
        <div className="container">
          <div className="bl-two-col">
            <div>
              <span className="section-label">Eligibility</span>
              <h2 className="section-title" style={{ marginBottom: 24 }}>Who Can Apply?</h2>
              <ul className="bl-checklist">
                {ELIGIBILITY.map(e => (
                  <li key={e}><span className="check">✓</span>{e}</li>
                ))}
              </ul>
              <button className="btn btn-primary" style={{ marginTop: 24 }}
                onClick={() => navigate("/business-loan/eligibility")}>
                Check My Eligibility →
              </button>

              {/* ── Quick eligibility summary cards ── */}
              <div style={{ marginTop: 32 }}>
                <div style={{
                  fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.08em", color: "var(--color-primary)",
                  marginBottom: 14, paddingBottom: 6,
                  borderBottom: "1px solid var(--color-border)",
                }}>
                  Minimum Requirements at a Glance
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { icon: "📅", label: "Business Age",    value: "Min. 2 years operational"   },
                    { icon: "💰", label: "Annual Turnover", value: "Min. ₹25 Lakhs"              },
                    { icon: "📊", label: "CIBIL Score",     value: "Min. 650"                    },
                    { icon: "🎂", label: "Applicant Age",   value: "21 – 65 years"               },
                    { icon: "📋", label: "GST Filing",      value: "Active registration required" },
                  ].map(item => (
                    <div key={item.label} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px",
                      background: "var(--color-white)",
                      border: "1px solid var(--color-border)",
                      borderLeft: "3px solid #00C853",
                      borderRadius: 8,
                    }}>
                      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <div style={{
                          fontSize: "0.7rem", fontWeight: 700,
                          color: "var(--color-muted)",
                          textTransform: "uppercase", letterSpacing: "0.05em",
                          marginBottom: 2,
                        }}>
                          {item.label}
                        </div>
                        <div style={{
                          fontSize: "0.85rem", fontWeight: 600,
                          color: "var(--color-navy)",
                        }}>
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Quick loan comparison strip ── */}
              <div style={{ marginTop: 24 }}>
                <div style={{
                  fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.08em", color: "var(--color-primary)",
                  marginBottom: 14, paddingBottom: 6,
                  borderBottom: "1px solid var(--color-border)",
                }}>
                  Interest Rates by Loan Type
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { name: "Secured Business Loan",   rate: "10% – 16%", icon: "🏛️" },
                    { name: "Unsecured Business Loan",  rate: "12% – 22%", icon: "⚡" },
                    { name: "Working Capital Loan",     rate: "11% – 18%", icon: "🔄" },
                    { name: "Business Expansion Loan",  rate: "10.5% – 18%", icon: "📈" },
                  ].map(lt => (
                    <div key={lt.name} style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "var(--color-white)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "border-color 0.18s",
                    }}
                      onClick={() => navigate(`/business-loan/compare`)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "1rem" }}>{lt.icon}</span>
                        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-navy)" }}>
                          {lt.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: "0.82rem", fontWeight: 700,
                        color: "#00C853", whiteSpace: "nowrap",
                      }}>
                        {lt.rate} p.a.
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-outline"
                  style={{ marginTop: 14, width: "100%", justifyContent: "center", fontSize: "0.85rem" }}
                  onClick={() => navigate("/business-loan/compare")}
                >
                  Compare All Loan Types →
                </button>
              </div>

            </div>
            <div>
              <span className="section-label">Documents</span>
              <h2 className="section-title" style={{ marginBottom: 24 }}>Required Documents</h2>
              {DOC_GROUPS.map(g => (
                <div key={g.title} style={{ marginBottom: 20 }}>
                  <div className="bl-doc-group-label">{g.title}</div>
                  <ul className="bl-checklist">
                    {g.docs.map(d => (
                      <li key={d}><span className="check">📄</span>{d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Process Steps ── */}
      <section className="bl-section">
        <div className="container">
          <div className="bl-section-head center">
            <span className="section-label">How It Works</span>
            <h2 className="section-title">5 Simple Steps to Your Business Loan</h2>
            <p className="section-subtitle">
              From application to disbursal — fast, digital, and transparent.
            </p>
          </div>
          <div className="bl-steps">
            {PROCESS.map((s, i) => (
              <div key={i} className="bl-step">
                <div className="bl-step-left">
                  <div className="bl-step-num">{i + 1}</div>
                  <div className="bl-step-line" />
                </div>
                <div className="bl-step-content">
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bl-section-alt">
        <div className="container">
          <div className="bl-section-head center">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="bl-faq">
            {FAQS.map((faq, i) => (
              <div key={i} className={`bl-faq-item${openFaq === i ? " open" : ""}`}>
                <button className="bl-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span className="bl-faq-icon">+</span>
                </button>
                <div className={`bl-faq-answer${openFaq === i ? " open" : ""}`}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bl-cta-banner">
        <div className="container">
          <h2>Ready to Grow Your Business?</h2>
          <p>Apply for a Business Loan today and get funds within 48 hours.</p>
          <div className="bl-cta-banner-btns">
            <button className="btn btn-white" style={{ color: "#00A040" }}
              onClick={() => navigate("/business-loan/apply")}>
              Apply Now →
            </button>
            <button
              className="btn"
              style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.5)", color: "#fff" }}
              onClick={() => navigate("/business-loan/eligibility")}
            >
              Check Eligibility
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}