// ============================================================
//  BusinessLoanDetail.jsx — Individual Loan Type Detail Page
//  Mirrors SalariedPersonalLoan.jsx / NewCarLoan.jsx pattern
// ============================================================
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../businessLoan.css";

const LOAN_DATA = {
  "secured-business-loan": {
    icon: "🏛️",
    name: "Secured Business Loan",
    tagline: "Unlock higher capital with collateral-backed financing",
    amountRange: "₹10 Lakh – ₹5 Crore",
    rateRange: "10% – 16% p.a.",
    tenure: "1 – 7 Years",
    processingFee: "1% – 2%",
    approvalTime: "3 – 5 days",
    defaultRate: 10,
    about: "A Secured Business Loan lets you pledge property, machinery, or fixed deposits as collateral to access large capital at the lowest interest rates. Ideal for established businesses planning major expansions, infrastructure, or equipment purchases.",
    features: [
      { icon: "🏠", title: "Collateral-Backed",      desc: "Pledge property, machinery, or FDs for higher amounts." },
      { icon: "📉", title: "Lowest Interest Rates",   desc: "Starting from 10% p.a. — best rates in the market." },
      { icon: "💵", title: "Highest Loan Amounts",    desc: "Access up to ₹5 Crore for large business needs." },
      { icon: "📅", title: "Long Tenure",             desc: "Repay over 7 years with manageable EMIs." },
      { icon: "📊", title: "Flexible Usage",           desc: "Expansion, machinery, working capital — any purpose." },
      { icon: "✅", title: "Easier Approval",          desc: "Collateral improves approval chances even at 650 CIBIL." },
    ],
    eligibility: [
      "Business operational for minimum 3 years",
      "Annual turnover ≥ ₹50 Lakhs",
      "CIBIL score ≥ 650",
      "Valid collateral with clear title",
      "Property valuation from approved valuator",
      "No active NPA or loan default",
    ],
    docs: [
      "Aadhaar & PAN Card", "Business ownership proof", "GST certificate",
      "Bank statements (12 months)", "IT returns (2 years)", "Audited balance sheet",
      "Property documents / Sale deed", "Valuation report", "Encumbrance certificate",
    ],
  },
  "unsecured-business-loan": {
    icon: "⚡",
    name: "Unsecured Business Loan",
    tagline: "No collateral. No delay. Just capital when you need it.",
    amountRange: "₹1 Lakh – ₹75 Lakhs",
    rateRange: "12% – 22% p.a.",
    tenure: "1 – 5 Years",
    processingFee: "1.5% – 2.5%",
    approvalTime: "24 – 48 hours",
    defaultRate: 14,
    about: "Our Unsecured Business Loan gives fast access to capital without pledging any assets. With minimal documentation and 48-hour approval, it's perfect for businesses needing quick funds for operations, marketing, inventory, or any short-term need.",
    features: [
      { icon: "🔓", title: "No Collateral",         desc: "Zero assets pledged — your business performance is enough." },
      { icon: "⚡", title: "48-Hour Approval",       desc: "Automated underwriting gives you a decision in hours." },
      { icon: "📄", title: "Minimal Documents",      desc: "Basic KYC + 6-month bank statement often sufficient." },
      { icon: "🎯", title: "Any Purpose",            desc: "Marketing, inventory, staffing — unrestricted usage." },
      { icon: "💳", title: "Flexi Credit Option",    desc: "Pay interest only on the amount you actually use." },
      { icon: "🔄", title: "Easy Renewal",           desc: "Top-up or renewal after 12 months of good repayment." },
    ],
    eligibility: [
      "Business operational for minimum 2 years",
      "Annual turnover ≥ ₹30 Lakhs",
      "CIBIL score ≥ 700 preferred",
      "Positive monthly cash flow",
      "No NPA or defaults in last 3 years",
      "GST-registered entity",
    ],
    docs: [
      "Aadhaar & PAN Card", "Business ownership proof", "GST certificate",
      "Bank statements (6 months)", "IT returns (2 years)", "P&L statement",
    ],
  },
  "working-capital-loan": {
    icon: "🔄",
    name: "Working Capital Loan",
    tagline: "Keep your business running smoothly, every single day.",
    amountRange: "₹1 Lakh – ₹1 Crore",
    rateRange: "11% – 18% p.a.",
    tenure: "3 Months – 3 Years",
    processingFee: "1% – 2%",
    approvalTime: "24 – 72 hours",
    defaultRate: 13,
    about: "A Working Capital Loan bridges short-term cash flow gaps and funds day-to-day business operations — payroll, rent, inventory restocking, and vendor payments. Revolving credit options let you draw and repay as needed.",
    features: [
      { icon: "🏪", title: "Day-to-Day Ops",          desc: "Cover salaries, rent, utilities without cash crunches." },
      { icon: "📦", title: "Inventory Financing",      desc: "Stock up before peak season with revolving credit." },
      { icon: "⏱️", title: "Short Tenure",             desc: "Repay in 3 months to 3 years — pay as you earn." },
      { icon: "🔁", title: "Revolving Credit",         desc: "Draw, repay, and re-draw per your business cycle." },
      { icon: "📈", title: "Seasonal Support",         desc: "Ideal for businesses with seasonal revenue patterns." },
      { icon: "🏃", title: "Fast Disbursement",        desc: "Draw funds within 24 hours post-approval." },
    ],
    eligibility: [
      "Business operational for minimum 2 years",
      "Annual turnover ≥ ₹25 Lakhs",
      "CIBIL score ≥ 650",
      "Active current account (6+ months)",
      "Regular monthly cash flow",
      "GST registration preferred",
    ],
    docs: [
      "Aadhaar & PAN Card", "Business registration proof", "GST certificate",
      "Bank statements (6 months)", "IT returns (last year)", "Stock / debtor statement",
    ],
  },
  "business-expansion-loan": {
    icon: "📈",
    name: "Business Expansion Loan",
    tagline: "Finance your next big growth milestone.",
    amountRange: "₹10 Lakh – ₹5 Crore",
    rateRange: "10.5% – 18% p.a.",
    tenure: "1 – 7 Years",
    processingFee: "1% – 2%",
    approvalTime: "3 – 7 days",
    defaultRate: 11,
    about: "The Business Expansion Loan is built for growing businesses that are ready to scale — opening new branches, purchasing equipment, entering new markets, or building infrastructure. Phased disbursal aligns with your project milestones.",
    features: [
      { icon: "🏢", title: "New Branch Setup",          desc: "Fund offices, stores, or service centers across India." },
      { icon: "🏭", title: "Machinery & Equipment",     desc: "Acquire production machinery and IT infrastructure." },
      { icon: "🌍", title: "Market Expansion",          desc: "Enter new geographies or customer segments." },
      { icon: "💰", title: "High Capital Access",       desc: "Up to ₹5 Crore at competitive rates." },
      { icon: "📅", title: "Long Tenure",               desc: "Up to 7 years to protect your cash flow." },
      { icon: "🎯", title: "Phased Disbursal",          desc: "Funds released aligned to your project milestones." },
    ],
    eligibility: [
      "Business operational for minimum 3 years",
      "Annual turnover ≥ ₹50 Lakhs",
      "CIBIL score ≥ 680",
      "Documented expansion / business plan",
      "Net profit for 2 consecutive years",
      "No active NPA",
    ],
    docs: [
      "Aadhaar & PAN Card", "Business registration", "GST certificate",
      "Bank statements (12 months)", "IT returns (2 years)", "Audited balance sheet",
      "Business expansion plan", "Quotations / project estimates",
    ],
  },
};

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

export default function BusinessLoanDetail() {
  const { loanType } = useParams();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const loan = LOAN_DATA[loanType];
  if (!loan) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h2 style={{ color: "#0F1C3F", marginBottom: 16 }}>Loan type not found</h2>
      <button className="btn btn-primary" onClick={() => navigate("/business-loan")}>
        ← Back to Business Loans
      </button>
    </div>
  );

  const [emiAmount, setEmiAmount] = useState(2500000);
  const [emiTenure, setEmiTenure] = useState(36);
  const emi           = calcEMI(emiAmount, loan.defaultRate, emiTenure);
  const totalPayable  = emi * emiTenure;
  const totalInterest = totalPayable - emiAmount;

  const faqs = [
    { q: `What is the maximum amount for ${loan.name}?`,    a: `You can borrow ${loan.amountRange} based on your financials and eligibility.` },
    { q: "How quickly will I get the funds?",               a: `Approval time is typically ${loan.approvalTime}. Disbursement follows within 48–72 hours after final verification.` },
    { q: "Can I foreclose the loan early?",                 a: "Yes. Nil charges after 12 months. A 2% pre-closure fee applies within the first 12 months." },
    { q: "What if my CIBIL score is below the threshold?",  a: "Strong business financials, a co-applicant, or collateral (for secured loans) can compensate for a lower score." },
  ];

  return (
    <div>

      {/* ── Hero ── */}
      <section className="bl-hero">
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: "0.82rem" }}>
            <Link to="/business-loan" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Business Loans</Link>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{loan.name}</span>
          </div>
          <div style={{ fontSize: "2.2rem", marginBottom: 12 }}>{loan.icon}</div>
          <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#fff", marginBottom: 10 }}>
            {loan.name}
          </h1>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.68)", maxWidth: 500, margin: "0 auto 32px" }}>
            {loan.tagline}
          </p>
          <div className="bl-hero-stats">
            {[
              { val: loan.amountRange, label: "Loan Amount"      },
              { val: loan.rateRange,   label: "Interest Rate"    },
              { val: loan.tenure,      label: "Tenure"           },
              { val: loan.approvalTime,label: "Approval Time"    },
            ].map(s => (
              <div key={s.label} className="bl-hero-stat">
                <span className="bl-hero-stat-val" style={{ fontSize: "1.1rem" }}>{s.val}</span>
                <span className="bl-hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="bl-hero-actions" style={{ marginTop: 32 }}>
            <button className="btn btn-primary" onClick={() => navigate(`/business-loan/apply?type=${loanType}`)}>
              Apply Now →
            </button>
            <button
              className="btn"
              style={{ border: "2px solid rgba(255,255,255,0.35)", color: "#fff", background: "transparent" }}
              onClick={() => navigate("/business-loan/eligibility")}
            >
              Check Eligibility
            </button>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="bl-section">
        <div className="container">
          <span className="section-label">Overview</span>
          <h2 className="section-title">About {loan.name}</h2>
          <p style={{ fontSize: "1rem", color: "#374151", lineHeight: 1.8, maxWidth: 760, marginBottom: 40 }}>
            {loan.about}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            {[
              { icon: "💰", label: "Loan Amount",    val: loan.amountRange     },
              { icon: "📊", label: "Interest Rate",  val: loan.rateRange       },
              { icon: "📅", label: "Tenure",         val: loan.tenure          },
              { icon: "🧾", label: "Processing Fee", val: loan.processingFee   },
            ].map(m => (
              <div key={m.label} style={{
                background: "#F9FAFB", border: "1px solid #E5E7EB", borderLeft: "4px solid #00C853",
                borderRadius: 12, padding: "18px 20px", display: "flex", gap: 12, alignItems: "center",
              }}>
                <span style={{ fontSize: "1.5rem" }}>{m.icon}</span>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{m.label}</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0F1C3F" }}>{m.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bl-section-alt">
        <div className="container">
          <div className="bl-section-head center">
            <span className="section-label">Features</span>
            <h2 className="section-title">Key Features &amp; Benefits</h2>
          </div>
          <div className="bl-features-grid">
            {loan.features.map(f => (
              <div key={f.title} className="bl-feature-item">
                <div className="bl-feature-icon">{f.icon}</div>
                <div className="bl-feature-text"><h4>{f.title}</h4><p>{f.desc}</p></div>
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
            <h2 className="section-title">Estimate Your Monthly EMI</h2>
          </div>
          <div className="bl-emi-wrap">
            <div className="bl-emi-inputs">
              <div className="bl-emi-title">📊 {loan.name} EMI Calculator</div>
              <div className="bl-emi-field">
                <label>Loan Amount <span>{fmtAmt(emiAmount)}</span></label>
                <input type="range" className="bl-emi-slider" min={100000} max={50000000} step={100000}
                  value={emiAmount} onChange={e => setEmiAmount(Number(e.target.value))} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#6B7280", marginTop: 4 }}>
                  <span>₹1 L</span><span>₹5 Cr</span>
                </div>
              </div>
              <div className="bl-emi-field">
                <label>Tenure <span>{emiTenure} Months</span></label>
                <input type="range" className="bl-emi-slider" min={12} max={84} step={6}
                  value={emiTenure} onChange={e => setEmiTenure(Number(e.target.value))} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#6B7280", marginTop: 4 }}>
                  <span>12 Mo</span><span>84 Mo</span>
                </div>
              </div>
              <div className="bl-emi-field">
                <label>Interest Rate (p.a.) <span>{loan.defaultRate}%</span></label>
                <div style={{ height: 6, borderRadius: 3, background: "#00C853", opacity: 0.4, marginBottom: 4 }} />
                <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>
                  Fixed at {loan.defaultRate}% for {loan.name}
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
                    <span className="lbl">{l}</span><span className="val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Eligibility & Docs ── */}
      <section className="bl-section-alt">
        <div className="container">
          <div className="bl-two-col">
            <div>
              <span className="section-label">Eligibility</span>
              <h2 className="section-title" style={{ marginBottom: 24 }}>Eligibility Criteria</h2>
              <ul className="bl-checklist">
                {loan.eligibility.map(e => (
                  <li key={e}><span className="check">✓</span>{e}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="section-label">Documents</span>
              <h2 className="section-title" style={{ marginBottom: 24 }}>Required Documents</h2>
              <ul className="bl-checklist">
                {loan.docs.map(d => (
                  <li key={d}><span className="check">📄</span>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bl-section">
        <div className="container">
          <div className="bl-section-head center">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Common Questions</h2>
          </div>
          <div className="bl-faq">
            {faqs.map((faq, i) => (
              <div key={i} className={`bl-faq-item${openFaq === i ? " open" : ""}`}>
                <button className="bl-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}<span className="bl-faq-icon">+</span>
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
          <h2>Apply for {loan.name} Today</h2>
          <p>Quick approval, competitive rates, and funds in your account within 48 hours.</p>
          <div className="bl-cta-banner-btns">
            <button className="btn btn-white" style={{ color: "#00A040" }}
              onClick={() => navigate(`/business-loan/apply?type=${loanType}`)}>
              Apply Now →
            </button>
            <button
              className="btn"
              style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.5)", color: "#fff" }}
              onClick={() => navigate("/business-loan")}
            >
              View All Loans
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
