// ============================================================
//  SalariedPersonalLoan.jsx
//  Route: /personal-loan/salaried
// ============================================================
import { useState } from "react";
import { Link } from "react-router-dom";
import EmiCalculatorWidget from "../components/EmiCalculatorWidget";
import "../personalLoan.css";

const tabs = ["Overview", "Eligibility", "Documents", "EMI Calculator", "FAQs"];

const eligibilityRows = [
  { label: "Employment", value: "Salaried in Private / Government / PSU" },
  { label: "Age", value: "21 – 60 years" },
  { label: "Min. Monthly Income", value: "₹25,000 per month" },
  { label: "Work Experience", value: "At least 1 year, current job 6 months" },
  { label: "CIBIL Score", value: "700 or above preferred" },
  { label: "Loan Amount", value: "₹50,000 – ₹40 Lakhs" },
];

const documents = [
  { name: "Aadhaar Card", desc: "Government-issued identity proof" },
  { name: "PAN Card", desc: "Mandatory for all loan applications" },
  { name: "Salary Slips", desc: "Latest 3 months' salary slips" },
  { name: "Bank Statement", desc: "6 months savings account statement" },
  { name: "Form 16 / IT Returns", desc: "Last 2 years income tax documents" },
  { name: "Employee ID Card", desc: "Current employer ID proof" },
  { name: "Passport Photo", desc: "Recent passport-size photograph" },
];

const faqs = [
  { q: "What is the minimum salary for a salaried personal loan?", a: "You need a minimum monthly salary of ₹25,000 to be eligible for a salaried personal loan with LoanEase." },
  { q: "How soon will I get the money after approval?", a: "After approval and document verification, funds are typically disbursed within 24 hours to your bank account." },
  { q: "Can I apply if I recently changed jobs?", a: "Yes, but you must have at least 6 months of experience in your current organization and 1 year of total work experience." },
  { q: "What purposes can I use the personal loan for?", a: "You can use it for medical emergencies, travel, education, home renovation, marriage, or any personal expense." },
];

export default function SalariedPersonalLoan() {
  const [activeTab, setActiveTab] = useState("Overview");
const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="pl-new-page">
      {/* Breadcrumb */}
      <div className="pl-breadcrumb">
        <Link to="/">Home</Link> <span>›</span>
        <Link to="/personal-loan">Personal Loan</Link> <span>›</span>
        <span>Salaried Personal Loan</span>
      </div>

      {/* Hero */}
      <section className="pl-sub-hero">
        <div className="pl-sub-hero-text">
          <h1>Salaried Personal Loan</h1>
          <p>Designed for salaried individuals with a regular source of income.</p>
          <div className="pl-sub-hero-highlights">
            <div className="pl-sub-hl"><div className="pl-sub-hl-val">Up to<br/><strong>₹40 Lakhs</strong></div><div className="pl-sub-hl-lab">Loan Amount</div></div>
            <div className="pl-sub-hl-div"/>
            <div className="pl-sub-hl"><div className="pl-sub-hl-val"><strong>11.49%*</strong><br/>Onwards</div><div className="pl-sub-hl-lab">Interest Rate</div></div>
            <div className="pl-sub-hl-div"/>
            <div className="pl-sub-hl"><div className="pl-sub-hl-val">Up to<br/><strong>60 Months</strong></div><div className="pl-sub-hl-lab">Tenure</div></div>
            <div className="pl-sub-hl-div"/>
            <div className="pl-sub-hl"><div className="pl-sub-hl-val"><strong>Quick</strong><br/>Approval</div><div className="pl-sub-hl-lab">24–48 Hours</div></div>
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
        {/* Overview */}
        {activeTab === "Overview" && (
          <div className="pl-tab-layout">
            <div className="pl-tab-main">
              <section className="pl-info-section">
  <h3>Salaried Personal Loan Overview</h3>

  <div className="pl-benefits-grid">

    <div className="pl-benefit-card">
      <h4>✔ High Loan Amount</h4>
      <p>
        Avail personal loans ranging from ₹50,000 up to ₹40 Lakhs
        based on your income, employment profile, and credit history.
      </p>
    </div>

    <div className="pl-benefit-card">
      <h4>✔ Quick Approval & Disbursal</h4>
      <p>
        Complete your application online and receive approval with
        fast disbursal, often within 24–48 hours of verification.
      </p>
    </div>

    <div className="pl-benefit-card">
      <h4>✔ No Collateral Required</h4>
      <p>
        Enjoy completely unsecured financing without pledging
        property, gold, fixed deposits, or any other assets.
      </p>
    </div>

   

  </div>
</section>
              <h3>Why Choose Salaried Personal Loan?</h3>
              <div className="pl-overview-grid">
                {[
                  { icon: "⚡", t: "Minimal Documentation", d: "Hassle-free process with minimal paperwork" },
                  { icon: "🏦", t: "Quick Approval", d: "Get funds in your account within 24–48 hours" },
                  { icon: "📅", t: "Flexible Tenure", d: "Choose repayment tenure up to 60 months" },
                  { icon: "🔓", t: "No Collateral", d: "100% unsecured loan, no collateral required" },
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
              
              <h3 style={{marginTop:28}}>Why Choose Salaried Personal Loan?</h3>
              <div className="pl-why-grid">
                {["Competitive Interest Rates", "Low Processing Fees", "Transparent Process", "Trusted by Thousands"].map(w => (
                  <div key={w} className="pl-why-card">
                    <span>⭐</span><p>{w}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="pl-tab-side">
              <EmiCalculatorWidget defaultRate={11.49} maxAmount={4000000} minRate={11.49} />
              <div className="pl-side-cta">
                <Link to="/personal-loan/salaried/apply" className="pl-primary-btn" style={{width:"100%",marginBottom:10}}>Apply Now</Link>
                <Link to="/personal-loan/eligibility?type=salaried" className="pl-secondary-btn" style={{width:"100%"}}>Check Eligibility</Link>
              </div>
            </div>
          </div>
        )}

        {/* Eligibility */}
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
                <p>Eligibility is subject to credit assessment, income verification, and LoanEase's internal policies. Final approval may vary.</p>
              </div>
              <div style={{marginTop:24}}>
                <Link to="/personal-loan/eligibility?type=salaried" className="pl-primary-btn">Check My Eligibility →</Link>
              </div>
            </div>
            <div className="pl-tab-side">
              <EmiCalculatorWidget defaultRate={11.49} maxAmount={4000000} minRate={11.49} />
              <div className="pl-side-cta">
                <Link to="/personal-loan/salaried/apply" className="pl-primary-btn" style={{width:"100%"}}>Apply Now</Link>
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        {activeTab === "Documents" && (
          <div className="pl-tab-layout">
            <div className="pl-tab-main">
              <h3>Required Documents</h3>
              <p style={{color:"#66738d",marginBottom:20}}>Keep these documents ready for a smooth application process.</p>
              <div className="pl-docs-grid">
                {documents.map(d => (
                  <div key={d.name} className="pl-doc-item">
                    <span className="pl-doc-check">✓</span>
                    <div>
                      <h5>{d.name}</h5>
                      <p>{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pl-elig-note" style={{marginTop:20}}>
                <span>💡</span>
                <p>All documents should be clear, readable scans or photos. Password-protected files may not be accepted.</p>
              </div>
            </div>
            <div className="pl-tab-side">
              <EmiCalculatorWidget defaultRate={11.49} maxAmount={4000000} minRate={11.49} />
              <div className="pl-side-cta">
                <Link to="/personal-loan/salaried/apply" className="pl-primary-btn" style={{width:"100%"}}>Apply Now</Link>
              </div>
            </div>
          </div>
        )}

        {/* EMI Calculator */}
        {activeTab === "EMI Calculator" && (
          <div className="pl-emi-full">
            <EmiCalculatorWidget defaultRate={11.49} maxAmount={4000000} minRate={11.49} />
            <div style={{textAlign:"center",marginTop:24}}>
              <Link to="/personal-loan/salaried/apply" className="pl-primary-btn">Apply Now →</Link>
            </div>
          </div>
        )}

        {/* FAQs */}
        {activeTab === "FAQs" && (
  <div className="pl-tab-single">
    <h3>Frequently Asked Questions</h3>

    <div className="pl-faq-list">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`pl-faq-item ${
            openFaq === index ? "open" : ""
          }`}
        >
          <button
            className="pl-faq-q"
            onClick={() =>
              setOpenFaq(
                openFaq === index ? null : index
              )
            }
          >
            <span>{faq.q}</span>

            <span className="pl-faq-arrow">
              {openFaq === index ? "−" : "+"}
            </span>
          </button>

          {openFaq === index && (
            <div className="pl-faq-a">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}
        
      </div>

      {/* Bottom CTA */}
      <section className="pl-cta-section">
        <h2>Apply for Salaried Personal Loan Today</h2>
        <p>Quick process · Minimal documents · Fast disbursal</p>
        <div className="pl-actions" style={{justifyContent:"center",marginTop:24}}>
          <Link to="/personal-loan/salaried/apply" className="pl-primary-btn">Apply Now →</Link>
          <Link to="/personal-loan/eligibility?type=salaried" className="pl-primary-btn pl-primary-btn--white">Check Eligibility</Link>
        </div>
      </section>
    </div>
  );
}