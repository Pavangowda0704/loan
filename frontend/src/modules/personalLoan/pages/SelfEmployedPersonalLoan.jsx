// ============================================================
//  SelfEmployedPersonalLoan.jsx
//  Route: /personal-loan/self-employed
// ============================================================
import { useState } from "react";
import { Link } from "react-router-dom";
import EmiCalculatorWidget from "../components/EmiCalculatorWidget";
import "../personalLoan.css";

const tabs = ["Overview", "Eligibility", "Documents", "EMI Calculator", "FAQs"];

const eligibilityRows = [
  { label: "Employment", value: "Self-Employed / Business Owner / Freelancer" },
  { label: "Age", value: "25 – 65 years" },
  { label: "Min. Monthly Income", value: "₹30,000 net monthly income" },
  { label: "Business Vintage", value: "Business operational for at least 2 years" },
  { label: "CIBIL Score", value: "700 or above preferred" },
  { label: "Loan Amount", value: "₹1 Lakh – ₹30 Lakhs" },
];

const documents = [
  { name: "Aadhaar Card", desc: "Government-issued identity proof" },
  { name: "PAN Card", desc: "Mandatory for all loan applications" },
  { name: "GST Registration", desc: "GST certificate if applicable" },
  { name: "Business Proof", desc: "Trade license / Shops & Est. certificate" },
  { name: "IT Returns", desc: "Last 2–3 years income tax returns" },
  { name: "Bank Statement", desc: "Business account — 12 months statement" },
  { name: "Company Registration", desc: "Incorporation cert / Partnership deed" },
  { name: "Passport Photo", desc: "Recent passport-size photograph" },
];

const faqs = [
  { q: "How many years of business experience do I need?", a: "Your business should be operational for at least 2 years with stable income proof through ITR filings." },
  { q: "Can I apply without ITR?", a: "ITR filing is mandatory for self-employed applicants. At least 2 years of filed ITRs are required for loan approval." },
  { q: "Is GST registration mandatory?", a: "GST registration is preferred but not always mandatory. However, it strengthens your application significantly." },
  { q: "What's the maximum loan I can get as self-employed?", a: "Self-employed individuals can get up to ₹30 Lakhs based on their income, CIBIL score, and business stability." },
];

export default function SelfEmployedPersonalLoan() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="pl-new-page">
      {/* Breadcrumb */}
      <div className="pl-breadcrumb">
        <Link to="/">Home</Link> <span>›</span>
        <Link to="/personal-loan">Personal Loan</Link> <span>›</span>
        <span>Self-Employed Personal Loan</span>
      </div>

      {/* Hero */}
      <section className="pl-sub-hero pl-sub-hero--green">
        <div className="pl-sub-hero-text">
          <h1>Self-Employed<br/>Personal Loan</h1>
          <p>Tailored for self-employed professionals and business owners.</p>
          <div className="pl-sub-hero-highlights">
            <div className="pl-sub-hl"><div className="pl-sub-hl-val">Up to<br/><strong>₹30 Lakhs</strong></div><div className="pl-sub-hl-lab">Loan Amount</div></div>
            <div className="pl-sub-hl-div"/>
            <div className="pl-sub-hl"><div className="pl-sub-hl-val"><strong>12.49%*</strong><br/>Onwards</div><div className="pl-sub-hl-lab">Interest Rate</div></div>
            <div className="pl-sub-hl-div"/>
            <div className="pl-sub-hl"><div className="pl-sub-hl-val">Up to<br/><strong>60 Months</strong></div><div className="pl-sub-hl-lab">Tenure</div></div>
            <div className="pl-sub-hl-div"/>
            <div className="pl-sub-hl"><div className="pl-sub-hl-val"><strong>Quick</strong><br/>Approval</div><div className="pl-sub-hl-lab">24–72 Hours</div></div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="pl-tabs-bar">
        {tabs.map(t => (
          <button key={t} className={`pl-tab${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pl-tab-content">
        {activeTab === "Overview" && (
          <div className="pl-tab-layout">
            <div className="pl-tab-main">
              <h3>Why Choose Self-Employed Personal Loan?</h3>
              <div className="pl-overview-grid">
                {[
                  { icon: "📊", t: "Business-Friendly", d: "Loan solutions for your growing business needs" },
                  { icon: "📄", t: "Minimal Documentation", d: "Simple process, minimal paperwork required" },
                  { icon: "🔄", t: "Flexible Repayment", d: "Tenure up to 60 months to suit your cash flow" },
                  { icon: "🔓", t: "No Collateral", d: "Unsecured loan, no collateral required" },
                ].map(b => (
                  <div key={b.t} className="pl-overview-card">
                    <span className="pl-overview-icon">{b.icon}</span>
                    <div>
                      <h5>{b.t}</h5>
                      <p>{b.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <h3 style={{marginTop:28}}>Why Choose Self-Employed Personal Loan?</h3>
              <div className="pl-why-grid">
                {["Higher Loan Flexibility", "Support for Your Business", "Quick & Easy Approval", "100% Online Process"].map(w => (
                  <div key={w} className="pl-why-card pl-why-card--green">
                    <span>⭐</span><p>{w}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="pl-tab-side">
              <EmiCalculatorWidget defaultRate={12.49} maxAmount={3000000} minRate={12.49} />
              <div className="pl-side-cta">
                <Link to="/personal-loan/self-employed/apply" className="pl-primary-btn pl-primary-btn--green" style={{width:"100%",marginBottom:10}}>Apply Now</Link>
                <Link to="/personal-loan/eligibility?type=self-employed" className="pl-secondary-btn" style={{width:"100%"}}>Check Eligibility</Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Eligibility" && (
          <div className="pl-tab-layout">
            <div className="pl-tab-main">
              <h3>Eligibility Criteria</h3>
              <div className="pl-elig-table">
                {eligibilityRows.map(r => (
                  <div key={r.label} className="pl-elig-row">
                    <span className="pl-elig-label">{r.label}</span>
                    <span className="pl-elig-val">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="pl-elig-note">
                <span>ℹ️</span>
                <p>Business vintage and income stability are key factors. A well-maintained business bank account significantly improves your approval chances.</p>
              </div>
              <div style={{marginTop:24}}>
                <Link to="/personal-loan/eligibility?type=self-employed" className="pl-primary-btn pl-primary-btn--green">Check My Eligibility →</Link>
              </div>
            </div>
            <div className="pl-tab-side">
              <EmiCalculatorWidget defaultRate={12.49} maxAmount={3000000} minRate={12.49} />
              <div className="pl-side-cta">
                <Link to="/personal-loan/self-employed/apply" className="pl-primary-btn pl-primary-btn--green" style={{width:"100%"}}>Apply Now</Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Documents" && (
          <div className="pl-tab-layout">
            <div className="pl-tab-main">
              <h3>Required Documents</h3>
              <p style={{color:"#66738d",marginBottom:20}}>Keep these documents ready for a smooth application process.</p>
              <div className="pl-docs-grid">
                {documents.map(d => (
                  <div key={d.name} className="pl-doc-item">
                    <span className="pl-doc-check pl-doc-check--green">✓</span>
                    <div>
                      <h5>{d.name}</h5>
                      <p>{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pl-tab-side">
              <EmiCalculatorWidget defaultRate={12.49} maxAmount={3000000} minRate={12.49} />
              <div className="pl-side-cta">
                <Link to="/personal-loan/self-employed/apply" className="pl-primary-btn pl-primary-btn--green" style={{width:"100%"}}>Apply Now</Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === "EMI Calculator" && (
          <div className="pl-emi-full">
            <EmiCalculatorWidget defaultRate={12.49} maxAmount={3000000} minRate={12.49} />
            <div style={{textAlign:"center",marginTop:24}}>
              <Link to="/personal-loan/self-employed/apply" className="pl-primary-btn pl-primary-btn--green">Apply Now →</Link>
            </div>
          </div>
        )}

        {activeTab === "FAQs" && (
          <div className="pl-tab-single">
            <h3>Frequently Asked Questions</h3>
            <div className="pl-faq-list">
              {faqs.map((f, i) => {
                const [open, setOpen] = useState(false);
                return (
                  <div key={i} className={`pl-faq-item${open ? " open" : ""}`}>
                    <button className="pl-faq-q" onClick={() => setOpen(!open)}>
                      <span>{f.q}</span>
                      <span className="pl-faq-arrow">{open ? "▲" : "▼"}</span>
                    </button>
                    {open && <div className="pl-faq-a">{f.a}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="pl-cta-section pl-cta-section--green">
        <h2>Apply for Self-Employed Personal Loan Today</h2>
        <p>Business-focused solutions · Flexible tenure · Quick approval</p>
        <div className="pl-actions" style={{justifyContent:"center",marginTop:24}}>
          <Link to="/personal-loan/self-employed/apply" className="pl-primary-btn">Apply Now →</Link>
          <Link to="/personal-loan/eligibility?type=self-employed" className="pl-primary-btn pl-primary-btn--white">Check Eligibility</Link>
        </div>
      </section>
    </div>
  );
}