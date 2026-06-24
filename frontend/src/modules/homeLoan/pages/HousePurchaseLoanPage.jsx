// frontend/src/modules/homeLoan/pages/HomeLoanDetail.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HomeLoanEmiWidget from '../components/HomeLoanEmiWidget';
import { LOAN_TYPES } from './HomeLoan';
import '../homeLoan.css';

const PROPERTY_DOCS = [
  { name: 'Sale Deed', note: 'Registered copy', icon: '📜' },
  { name: 'Khata Certificate & Extract', note: 'From local urban body', icon: '📑' },
  { name: 'Tax Paid Receipts', note: 'Latest property tax receipts', icon: '🧾' },
  { name: 'Approved Building Plan', note: 'Municipality-sanctioned plan', icon: '📐' },
  { name: 'Encumbrance Certificate (EC)', note: 'Minimum 15 years EC', icon: '🔒' },
  { name: 'Occupancy Certificate', note: 'If applicable — for ready properties', icon: '🏡' },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Apply Online', desc: 'Fill out the application form in minutes.' },
  { step: '02', title: 'Document Upload', desc: 'Upload KYC, income, and property documents digitally.' },
  { step: '03', title: 'In-Principle Approval', desc: 'Get approval within 24 working hours.' },
  { step: '04', title: 'Property Verification', desc: 'Our team verifies the property and legal docs.' },
  { step: '05', title: 'Sanction & Disbursement', desc: 'Loan sanctioned and disbursed within 7 days.' },
];

const HousePurchaseLoanPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const loan = {
  slug: 'new-house-purchase',
  name: 'New House Purchase Loan',
  icon: '🏠',
  description:
    'Turn your dream home into reality with affordable financing, attractive interest rates, and flexible repayment options.',
  rate: '8.35',
  maxAmount: '₹10 Crore',
  tenure: 'Up to 30 years',
  processing: '0.5% of loan amount',
  eligibility: [
    'Age 21–65 years',
    'Stable income source',
    'Good credit score',
    'Salaried and self-employed applicants eligible',
  ],
};

//   if (!loan) {
//     return (
//       <div className="hl-module" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
//         <div style={{ fontSize: '48px' }}>🔍</div>
//         <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Loan Type Not Found</h2>
//         <p style={{ color: 'var(--c-slate)' }}>The loan type you're looking for doesn't exist.</p>
//         <Link to="/home-loan" className="hl-btn hl-btn--primary">Browse All Loan Types</Link>
//       </div>
//     );
//   }

  return (
    <div className="hl-module">
      
      {/* <nav className="hl-nav">
        <Link to="/home-loan" className="hl-nav__logo">Loan<span>Ease</span></Link>
        <ul className="hl-nav__links">
          <li><Link to="/home-loan">Home Loans</Link></li>
          <li><Link to="/home-loan/eligibility">Eligibility</Link></li>
          <li><a href="#emi">EMI Calculator</a></li>
        </ul>
        <div className="hl-nav__cta">
          <Link to="/home-loan/eligibility" className="hl-btn hl-btn--ghost hl-btn--sm">Check Eligibility</Link>
          <Link to={`/home-loan/apply?type=${loan.slug}`} className="hl-btn hl-btn--primary hl-btn--sm">Apply Now</Link>
        </div>
        <button className="hl-nav__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={`hl-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/home-loan" onClick={() => setMenuOpen(false)}>← All Loan Types</Link>
        <Link to="/home-loan/eligibility" onClick={() => setMenuOpen(false)}>Eligibility Check</Link>
        <Link to={`/home-loan/apply?type=${loan.slug}`} className="hl-btn hl-btn--primary" onClick={() => setMenuOpen(false)}>
          Apply Now
        </Link>
      </div> */}

      {/* DETAIL HERO */}
      <section className="hl-detail-hero">
        <div className="hl-detail-hero__inner">
            <div className="hl-bubble1"></div>
<div className="hl-bubble2"></div>
<div className="hl-bubble3"></div>
          <div className="hl-breadcrumb" style={{ marginBottom: '20px' }}>
            
            <Link to="/home-loan">Home Loans</Link>
            <span className="hl-breadcrumb__sep">›</span>
            <span>{loan.name}</span>
          </div>
          <div className="hl-detail-hero__icon">{loan.icon}</div>
          <h1>{loan.name}</h1>
          <p>{loan.description}</p>
          
          <div className="hl-detail-meta">
            <div className="hl-detail-meta__item">
              <span>Interest Rate</span>
              <span>From {loan.rate}%</span>
            </div>
            <div className="hl-detail-meta__item">
              <span>Max Loan Amount</span>
              <span>{loan.maxAmount}</span>
            </div>
            <div className="hl-detail-meta__item">
              <span>Tenure</span>
              <span>{loan.tenure}</span>
            </div>
            <div className="hl-detail-meta__item">
              <span>Processing Fee</span>
              <span>{loan.processing}</span>
            </div>
          </div>
          <div style={{ marginTop: '28px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="hl-btn hl-btn--primary hl-btn--lg"
              onClick={() => navigate(`/home-loan/apply?type=${loan.slug}`)}
            >
              Apply for {loan.name} →
            </button>
            <button
              className="hl-btn hl-btn--outline hl-btn--lg"
              style={{ borderColor: 'rgba(255,255,255,.5)', color: '#fff' }}
              onClick={() => navigate('/home-loan/eligibility')}
            >
              Check Eligibility
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="hl-section">
        <div className="hl-container">
          <div className="hl-detail-layout">
            {/* LEFT MAIN */}
            <div><div style={{ marginBottom: '40px' }}>
  <div className="hl-section-label">NEW HOUSE PURCHASE LOAN</div>

<h2
  className="hl-section-title"
  style={{ fontSize: '26px', marginBottom: '20px' }}
>
  About New House Purchase Loan
</h2>

<ul className="hl-checklist">
  <li>
    <div className="hl-checklist__icon">✓</div>
    Finance the purchase of a new residential property with competitive interest rates.
  </li>

  <li>
    <div className="hl-checklist__icon">✓</div>
    Loan amount up to 80%–90% of the property value, based on eligibility.
  </li>

  <li>
    <div className="hl-checklist__icon">✓</div>
    Suitable for apartments, villas, row houses, and independent homes.
  </li>

  <li>
    <div className="hl-checklist__icon">✓</div>
    Flexible repayment tenure of up to 30 years.
  </li>

  <li>
    <div className="hl-checklist__icon">✓</div>
    Available for salaried employees, self-employed professionals, and business owners.
  </li>

  <li>
    <div className="hl-checklist__icon">✓</div>
    Quick approval process with minimal documentation.
  </li>

  <li>
    <div className="hl-checklist__icon">✓</div>
    Tax benefits available on principal and interest payments as per applicable laws.
  </li>

  <li>
    <div className="hl-checklist__icon">✓</div>
    Dedicated support throughout your home-buying journey.
  </li>
</ul>
</div>
              {/* Eligibility */}
              <div style={{ marginBottom: '40px' }}>
                <div className="hl-section-label">Eligibility Criteria</div>
                <h2 className="hl-section-title" style={{ fontSize: '26px', marginBottom: '20px' }}>
                  Who Can Apply?
                </h2>
                <ul className="hl-checklist">
                  {loan.eligibility.map((e, i) => (
                    <li key={i}>
                      <div className="hl-checklist__icon">✓</div>
                      {e}
                    </li>
                  ))}
                  <li>
                    <div className="hl-checklist__icon">✓</div>
                    Stable employment or business history (min. 2 years)
                  </li>
                  <li>
                    <div className="hl-checklist__icon">✓</div>
                    Indian citizen or NRI with valid documentation
                  </li>
                  <li>
                    <div className="hl-checklist__icon">✓</div>
                    Property must be within LoanEase approved locations
                  </li>
                </ul>
              </div>

              {/* Property Documents */}
              <div style={{ marginBottom: '40px' }}>
                <div className="hl-section-label">Documents Required</div>
                <h2 className="hl-section-title" style={{ fontSize: '26px', marginBottom: '20px' }}>
                  Property Documents
                </h2>
                <div className="hl-docs-grid">
                  {PROPERTY_DOCS.map((doc) => (
                    <div key={doc.name} className="hl-doc-item">
                      <div className="hl-doc-item__icon">{doc.icon}</div>
                      <div>
                        <div className="hl-doc-item__name">{doc.name}</div>
                        <div className="hl-doc-item__note">{doc.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  background: 'rgba(249,115,22,.06)',
                  border: '1px solid rgba(249,115,22,.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 18px',
                  marginTop: '16px',
                  fontSize: '13px',
                  color: 'var(--c-navy-l)',
                  lineHeight: '1.6'
                }}>
                  <strong>📌 Note:</strong> Additional documents may be required based on property type, 
                  location, and applicant profile. Our team will guide you through the complete list.
                </div>
              </div>

              {/* Process */}
              <div style={{ marginBottom: '40px' }}>
                <div className="hl-section-label">How It Works</div>
                <h2 className="hl-section-title" style={{ fontSize: '26px', marginBottom: '24px' }}>
                  Simple 5-Step Process
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {PROCESS_STEPS.map((s) => (
                    <div key={s.step} style={{
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'flex-start',
                      padding: '20px',
                      background: 'var(--c-bg-2)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--c-border)',
                    }}>
                      <div style={{
                        width: '44px', height: '44px',
                        background: 'var(--c-orange)',
                        color: '#fff',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '700', fontSize: '14px',
                        flexShrink: 0
                      }}>{s.step}</div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{s.title}</div>
                        <div style={{ fontSize: '13px', color: 'var(--c-slate)' }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EMI */}
              <div id="emi">
                <div className="hl-section-label">EMI Calculator</div>
                <h2 className="hl-section-title" style={{ fontSize: '26px', marginBottom: '20px' }}>
                  Estimate Your EMI
                </h2>
                <HomeLoanEmiWidget defaultRate={parseFloat(loan.rate)} />
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="hl-detail-sidebar">
              <div className="hl-sidebar-card">
                <h3>Apply for {loan.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--c-slate)', marginBottom: '16px', lineHeight: '1.5' }}>
                  Fast approval. Low rates. Dedicated support.
                </p>
                <button
                  className="hl-btn hl-btn--primary"
                  style={{ width: '100%', marginBottom: '10px' }}
                  onClick={() => navigate(`/home-loan/apply?type=${loan.slug}`)}
                >
                  Apply Now →
                </button>
                <button
                  className="hl-btn hl-btn--outline"
                  style={{ width: '100%' }}
                  onClick={() => navigate('/home-loan/eligibility')}
                >
                  Check Eligibility
                </button>
              </div>

              <div className="hl-sidebar-card">
                <h3>Key Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Interest Rate', val: `From ${loan.rate}% p.a.` },
                    { label: 'Loan Amount', val: `Up to ${loan.maxAmount}` },
                    { label: 'Tenure', val: loan.tenure },
                    { label: 'Processing Fee', val: loan.processing },
                    { label: 'Approval Time', val: '24–72 hours' },
                    { label: 'Prepayment', val: 'Zero charges (floating)' },
                  ].map((r) => (
                    <div key={r.label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      paddingBottom: '10px', borderBottom: '1px solid var(--c-border)',
                      fontSize: '13px'
                    }}>
                      <span style={{ color: 'var(--c-slate)' }}>{r.label}</span>
                      <span style={{ fontWeight: '600', color: 'var(--c-navy)' }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hl-sidebar-card">
                <h3>Other Loan Types</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {LOAN_TYPES.filter((l) => l.slug !== loan.slug).slice(0, 5).map((l) => (
                    <Link
                      key={l.slug}
                      to={`/home-loan/${l.slug}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px', borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none', color: 'var(--c-navy)',
                        fontSize: '13px', fontWeight: '500',
                        background: 'var(--c-bg-2)',
                        border: '1px solid var(--c-border)',
                        transition: 'border-color var(--transition)',
                      }}
                    >
                      <span>{l.icon}</span>
                      <span>{l.name}</span>
                      <span style={{ marginLeft: 'auto', color: 'var(--c-orange)', fontSize: '12px' }}>{l.rate}%</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY */}
      <div className="hl-sticky-apply">
        <button
          className="hl-btn hl-btn--primary"
          onClick={() => navigate(`/home-loan/apply?type=${loan.slug}`)}
        >
          Apply for {loan.name} →
        </button>
      </div>

      <footer className="hl-footer">
        <p>© 2025 LoanEase · <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a></p>
      </footer>
    </div>
  );
};

export default HousePurchaseLoanPage;