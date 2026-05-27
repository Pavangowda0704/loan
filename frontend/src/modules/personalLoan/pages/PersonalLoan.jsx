// ============================================================
//  PersonalLoan.jsx — Personal Loan Main Page
//  Route: /personal-loan
// ============================================================
import { useState } from "react";
import { Link } from "react-router-dom";
import "../personalLoan.css";

const benefits = [
  { icon: "⚡", title: "Quick Approval", desc: "Get approval within 24–48 hours of application" },
  { icon: "📄", title: "Minimal Documents", desc: "Simple paperwork — Aadhaar, PAN & income proof" },
  { icon: "📅", title: "Flexible Tenure", desc: "Repayment tenure from 12 to 60 months" },
  { icon: "🔓", title: "No Collateral", desc: "100% unsecured loan — no property pledge needed" },
  { icon: "💻", title: "100% Digital", desc: "Apply online from the comfort of your home" },
  { icon: "🎯", title: "Competitive Rates", desc: "Interest rates starting from 11.49% p.a." },
];

const faqs = [
  { q: "What is the maximum loan amount I can get?", a: "Salaried individuals can get up to ₹40 Lakhs and self-employed up to ₹30 Lakhs, subject to eligibility." },
  { q: "How long does approval take?", a: "Most applications are approved within 24–48 hours after document verification is complete." },
  { q: "Is there any processing fee?", a: "A minimal processing fee of 1–2% of the loan amount is applicable at the time of disbursement." },
  { q: "Can I prepay or foreclose my loan?", a: "Yes, you can foreclose after 6 months. A nominal foreclosure charge may apply depending on your loan tenure." },
  { q: "What credit score do I need?", a: "A CIBIL score of 700 or above is generally preferred for quick approval and better interest rates." },
];

const stats = [
  { value: "10 Lakh+", label: "Customers Served" },
  { value: "₹15,000 Cr+", label: "Loans Disbursed" },
  { value: "24–48 Hrs", label: "Quick Approval" },
  { value: "4.8/5", label: "Customer Rating" },
];

export default function PersonalLoan() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="pl-new-page">
      {/* Hero */}
      <section className="pl-hero-new">
        <div className="pl-hero-content">
          <span className="pl-tag">PERSONAL LOAN</span>
          <h1>Funds for Every Plan,<br /><span>Support for Every Step</span></h1>
          <p>Quick approval, minimal paperwork and flexible repayment options tailored to your needs.</p>
          <div className="pl-hero-badges">
            {["✓ Quick Approval", "✓ Minimal Documents", "✓ Flexible Tenure", "✓ No Collateral"].map(b => (
              <span key={b} className="pl-hero-badge">{b}</span>
            ))}
          </div>
          <div className="pl-actions">
            <Link to="/personal-loan/salaried" className="pl-primary-btn">Salaried Loan →</Link>
            <Link to="/personal-loan/self-employed" className="pl-secondary-btn">Self-Employed Loan</Link>
          </div>
        </div>
        <div className="pl-hero-visual">
          <div className="pl-hero-card-float">
            <div className="pl-hero-stat-row">
              <div className="pl-hero-stat"><div className="pl-hero-stat-val">₹40L</div><div className="pl-hero-stat-lab">Max Loan</div></div>
              <div className="pl-hero-stat"><div className="pl-hero-stat-val">11.49%</div><div className="pl-hero-stat-lab">Starting Rate</div></div>
              <div className="pl-hero-stat"><div className="pl-hero-stat-val">60 Mo</div><div className="pl-hero-stat-lab">Max Tenure</div></div>
            </div>
            <div className="pl-hero-divider" />
            <p style={{color:"#66738d",fontSize:13,textAlign:"center"}}>No collateral required · 100% online process</p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="pl-stats-bar">
        <div className="pl-stats-inner">
          {stats.map(s => (
            <div key={s.label} className="pl-stat-item">
              <div className="pl-stat-val">{s.value}</div>
              <div className="pl-stat-lab">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Loan Type Cards */}
      <section className="pl-section-wrapper">
        <div className="pl-section-head">
          <span className="pl-tag">CHOOSE YOUR TYPE</span>
          <h2>Choose the Personal Loan that Suits You</h2>
          <p>Tailored solutions for salaried and self-employed professionals</p>
        </div>
        <div className="pl-type-cards">
          {/* Salaried */}
          <div className="pl-type-card pl-type-card--blue">
            <div className="pl-type-icon">💼</div>
            <h3>Salaried Personal Loan</h3>
            <p>Designed for salaried individuals with a regular source of income from private or government employment.</p>
            <ul className="pl-type-features">
              <li>✓ Up to ₹40 Lakhs</li>
              <li>✓ Interest rate starting 11.49%*</li>
              <li>✓ Tenure up to 60 months</li>
              <li>✓ Approval in 24–48 hours</li>
            </ul>
            <div className="pl-type-actions">
              <Link to="/personal-loan/salaried" className="pl-primary-btn">View Details</Link>
              <Link to="/personal-loan/salaried/apply" className="pl-ghost-btn">Apply Now</Link>
            </div>
          </div>
          {/* Self Employed */}
          <div className="pl-type-card pl-type-card--green">
            <div className="pl-type-icon">🏢</div>
            <h3>Self-Employed Personal Loan</h3>
            <p>Tailored for self-employed professionals and business owners with variable income streams.</p>
            <ul className="pl-type-features">
              <li>✓ Up to ₹30 Lakhs</li>
              <li>✓ Interest rate starting 12.49%*</li>
              <li>✓ Tenure up to 60 months</li>
              <li>✓ Approval in 24–72 hours</li>
            </ul>
            <div className="pl-type-actions">
              <Link to="/personal-loan/self-employed" className="pl-primary-btn pl-primary-btn--green">View Details</Link>
              <Link to="/personal-loan/self-employed/apply" className="pl-ghost-btn">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="pl-section-wrapper pl-benefits-section">
        <div className="pl-section-head">
          <span className="pl-tag">WHY CHOOSE US</span>
          <h2>Benefits of LoanEase Personal Loan</h2>
          <p>Everything designed to make your borrowing experience seamless</p>
        </div>
        <div className="pl-benefits-grid">
          {benefits.map(b => (
            <div key={b.title} className="pl-benefit-card">
              <div className="pl-benefit-icon">{b.icon}</div>
              <h4>{b.title}</h4>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="pl-section-wrapper pl-hiw-section">
        <div className="pl-section-head">
          <span className="pl-tag">PROCESS</span>
          <h2>Simple 5-Step Application Process</h2>
        </div>
        <div className="pl-steps-row">
          {[
            { n: "1", t: "Check Eligibility", d: "Fill basic details and check your eligibility instantly" },
            { n: "2", t: "Apply Online", d: "Fill application form in simple guided steps" },
            { n: "3", t: "Upload Documents", d: "Upload required documents securely online" },
            { n: "4", t: "Application Submitted", d: "Your application is successfully submitted" },
            { n: "5", t: "Track Application", d: "Track your application status in real-time" },
          ].map((s, i) => (
            <div key={s.n} className="pl-step">
              <div className="pl-step-num">{s.n}</div>
              {i < 4 && <div className="pl-step-line" />}
              <h5>{s.t}</h5>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="pl-section-wrapper">
        <div className="pl-section-head">
          <span className="pl-tag">FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="pl-faq-list">
          {faqs.map((f, i) => (
            <div key={i} className={`pl-faq-item${openFaq === i ? " open" : ""}`}>
              <button className="pl-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <span className="pl-faq-arrow">{openFaq === i ? "▲" : "▼"}</span>
              </button>
              {openFaq === i && <div className="pl-faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pl-cta-section">
        <h2>Ready to Apply for Your Personal Loan?</h2>
        <p>Get quick approval with minimal documentation. Apply online today!</p>
        <div className="pl-actions" style={{justifyContent:"center",marginTop:28}}>
          <Link to="/personal-loan/salaried/apply" className="pl-primary-btn">Apply as Salaried</Link>
          <Link to="/personal-loan/self-employed/apply" className="pl-primary-btn pl-primary-btn--white">Apply as Self-Employed</Link>
        </div>
        <p style={{marginTop:16,fontSize:13,opacity:0.7}}>*Interest rates are indicative. Final rates subject to credit assessment.</p>
      </section>
    </div>
  );
}