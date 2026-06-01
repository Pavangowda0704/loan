// frontend/src/modules/homeLoan/pages/HomeLoan.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HomeLoanCard from '../components/HomeLoanCard';
import HomeLoanEmiWidget from '../components/HomeLoanEmiWidget';
import '../homeLoan.css';

export const LOAN_TYPES = [
  {
    slug: 'home-loan',
    name: 'Home Loan',
    icon: '🏠',
    description: 'Purchase your dream home with competitive interest rates and flexible tenure up to 30 years.',
    rate: '8.40',
    eligibility: ['Indian resident, age 21–65', 'Minimum income ₹25,000/month', 'Good credit score (700+)', 'Clear property title'],
    maxAmount: '₹5 Crore',
    tenure: 'Up to 30 years',
    processing: '0.5–1% of loan amount',
  },
  {
    slug: 'lap',
    name: 'Loan Against Property',
    icon: '🏢',
    description: 'Unlock the equity in your existing property to meet business or personal financial needs.',
    rate: '9.00',
    eligibility: ['Age 21–65 years', 'Clear property ownership', 'Monthly income ≥ ₹30,000', 'Good repayment history'],
    maxAmount: '₹10 Crore',
    tenure: 'Up to 20 years',
    processing: '1% of loan amount',
  },
  {
    slug: 'mortgage-loan',
    name: 'Mortgage Loan',
    icon: '🏦',
    description: 'Secure funding by mortgaging residential or commercial property at attractive rates.',
    rate: '9.25',
    eligibility: ['Age 23–70 years', 'Stable income source', 'Property valuation required', 'No overdue loans'],
    maxAmount: '₹15 Crore',
    tenure: 'Up to 25 years',
    processing: '0.75% of loan amount',
  },
  {
    slug: 'site-purchase',
    name: 'Site Purchase Loan',
    icon: '🌍',
    description: 'Finance the purchase of a residential plot or site for future construction.',
    rate: '8.75',
    eligibility: ['Age 21–60 years', 'Site in approved layout', 'Minimum income ₹20,000/month', 'Valid sale agreement'],
    maxAmount: '₹2 Crore',
    tenure: 'Up to 15 years',
    processing: '0.5% of loan amount',
  },
  {
    slug: 'balance-transfer',
    name: 'Balance Transfer & Top-Up',
    icon: '🔄',
    description: 'Transfer your existing home loan to us at a lower rate and get additional top-up funds.',
    rate: '8.35',
    eligibility: ['Existing home loan holder', 'Minimum 12 EMIs paid', 'No defaults in last 12 months', 'Current lender NOC'],
    maxAmount: 'Existing outstanding + top-up',
    tenure: 'Remaining tenure',
    processing: '0.5% of outstanding',
  },
  {
    slug: 'refinance',
    name: 'New House Refinance',
    icon: '🔑',
    description: 'Refinance your newly purchased home and get better terms with LoanEase.',
    rate: '8.50',
    eligibility: ['Property purchase within 6 months', 'Clean credit record', 'Income proof required', 'Property insured'],
    maxAmount: '₹3 Crore',
    tenure: 'Up to 30 years',
    processing: '0.5% of loan amount',
  },
  {
    slug: 'house-purchase',
    name: 'House Purchase Loan',
    icon: '🛒',
    description: 'Buy a ready-to-move-in house or apartment with quick disbursal and minimal paperwork.',
    rate: '8.45',
    eligibility: ['Age 21–65 years', 'Salaried or self-employed', 'Minimum CIBIL score 700', 'Valid sale deed'],
    maxAmount: '₹7 Crore',
    tenure: 'Up to 30 years',
    processing: '0.5% of loan amount',
  },
  {
    slug: 'construction',
    name: 'Construction Loan',
    icon: '🏗️',
    description: 'Finance the construction of your home on a plot you own, with stage-wise disbursement.',
    rate: '8.60',
    eligibility: ['Plot ownership required', 'Approved building plan', 'Age 21–60 years', 'Income proof mandatory'],
    maxAmount: '₹5 Crore',
    tenure: 'Up to 30 years',
    processing: '0.75% of loan amount',
  },
  {
    slug: 'mixed-usage',
    name: 'Mixed Usage Property Loan',
    icon: '🏘️',
    description: 'Fund properties used for both residential and commercial purposes with flexible repayment.',
    rate: '9.50',
    eligibility: ['Property with dual usage', 'Business registration proof', 'Age 23–65 years', 'GST registration preferred'],
    maxAmount: '₹8 Crore',
    tenure: 'Up to 20 years',
    processing: '1% of loan amount',
  },
];

const FEATURES = [
  { icon: '⚡', title: 'Fast Approval', desc: 'Get in-principle approval within 24 hours and final sanction in 72 hours.' },
  { icon: '💰', title: 'Low Interest Rates', desc: 'Starting from 8.35% p.a. with competitive rates for salaried and self-employed.' },
  { icon: '📅', title: 'Flexible Tenure', desc: 'Choose repayment tenure from 5 to 30 years to fit your budget.' },
  { icon: '📱', title: '100% Digital Process', desc: 'Apply online, upload documents digitally, and track status on your phone.' },
  { icon: '🤝', title: 'Dedicated Manager', desc: 'A dedicated relationship manager guides you through every step.' },
  { icon: '🔓', title: 'No Hidden Charges', desc: 'Transparent fee structure with no surprises. What we quote is what you pay.' },
  { icon: '🛡️', title: 'Property Insurance', desc: 'Complimentary property insurance options to protect your investment.' },
  { icon: '📊', title: 'Smart EMI Options', desc: 'Step-up, step-down, and bullet repayment options to suit your cash flow.' },
];

const ALL_DOCUMENTS = [
  { name: 'Aadhaar Card', note: 'Self-attested copy', icon: '🪪' },
  { name: 'PAN Card', note: 'Mandatory for all applicants', icon: '💳' },
  { name: 'Income Proof', note: 'Last 3 months salary slips / ITR', icon: '📋' },
  { name: 'Bank Statement', note: '6 months of primary account', icon: '🏦' },
  { name: 'Photograph', note: 'Recent passport size', icon: '📷' },
  { name: 'Sale Deed', note: 'Registered copy of property', icon: '📜' },
  { name: 'Khata Certificate & Extract', note: 'From local authority', icon: '📑' },
  { name: 'Tax Paid Receipts', note: 'Latest property tax receipts', icon: '🧾' },
  { name: 'Approved Building Plan', note: 'Municipal approved copy', icon: '📐' },
  { name: 'Encumbrance Certificate', note: 'EC for minimum 15 years', icon: '🔒' },
  { name: 'Occupancy Certificate', note: 'If applicable for ready properties', icon: '🏡' },
  { name: 'Form 16 / IT Returns', note: 'Last 2 financial years', icon: '📊' },
];

const FAQS = [
  {
    q: 'What is the minimum CIBIL score required for a home loan?',
    a: 'A CIBIL score of 700 or above is generally required. Higher scores (750+) qualify for better interest rates and faster approvals.',
  },
  {
    q: 'How much loan amount can I get?',
    a: 'You can typically get up to 80–85% of the property value (LTV ratio). The exact amount depends on your income, existing obligations, credit score, and property valuation.',
  },
  {
    q: 'What documents are needed for a home loan?',
    a: 'You need KYC documents (Aadhaar, PAN), income proof (salary slips/ITR), bank statements (6 months), and property documents (Sale Deed, Khata, EC, Tax Receipts, Building Plan).',
  },
  {
    q: 'How long does loan processing take?',
    a: 'In-principle approval is given within 24 hours. Final sanction takes 3–7 working days after complete document submission and property verification.',
  },
  {
    q: 'Can I repay the loan early (prepayment)?',
    a: 'Yes. Floating rate home loans have zero prepayment penalty as per RBI guidelines. Fixed rate loans may have a nominal prepayment charge.',
  },
  {
    q: 'Can I apply jointly with my spouse?',
    a: 'Yes, joint applications are encouraged. They improve eligibility, allow higher loan amounts, and both applicants can claim tax benefits under Section 80C and 24(b).',
  },
  {
    q: 'What is a Balance Transfer and should I opt for it?',
    a: 'Balance Transfer lets you move your existing home loan to LoanEase at a lower interest rate, reducing your EMI or loan tenure. It is beneficial when the rate difference is at least 0.5% and significant tenure remains.',
  },
];

const FaqItem = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`hl-faq-item ${open ? 'open' : ''}`}>
      <button className="hl-faq-q" onClick={() => setOpen(!open)}>
        {faq.q}
        <div className="hl-faq-q__icon">+</div>
      </button>
      {open && <div className="hl-faq-a">{faq.a}</div>}
    </div>
  );
};

const HomeLoan = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="hl-module">
      {/* NAV */}
      <nav className="hl-nav">
        <Link to="/home-loan" className="hl-nav__logo">
          Loan<span>Ease</span>
        </Link>
        <ul className="hl-nav__links">
          <li><Link to="/home-loan">Home Loans</Link></li>
          <li><Link to="/home-loan/eligibility">Eligibility</Link></li>
          <li><a href="#emi-calc">EMI Calculator</a></li>
          <li><a href="#documents">Documents</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div className="hl-nav__cta">
          <Link to="/home-loan/eligibility" className="hl-btn hl-btn--ghost hl-btn--sm">
            Check Eligibility
          </Link>
          <Link to="/home-loan/apply" className="hl-btn hl-btn--primary hl-btn--sm">
            Apply Now
          </Link>
        </div>
        <button className="hl-nav__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`hl-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/home-loan" onClick={() => setMenuOpen(false)}>Home Loans</Link>
        <Link to="/home-loan/eligibility" onClick={() => setMenuOpen(false)}>Eligibility Check</Link>
        <a href="#emi-calc" onClick={() => setMenuOpen(false)}>EMI Calculator</a>
        <a href="#documents" onClick={() => setMenuOpen(false)}>Documents</a>
        <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
        <Link to="/home-loan/apply" className="hl-btn hl-btn--primary" onClick={() => setMenuOpen(false)}>
          Apply Now
        </Link>
      </div>

      {/* HERO */}
      <section className="hl-hero">
        <div className="hl-hero__inner">
          <div>
            <div className="hl-hero__badge">🏆 India's Trusted Home Loan Partner</div>
            <h1 className="hl-hero__title">
              Your <em>Dream Home</em><br />
              Starts Here
            </h1>
            <p className="hl-hero__sub">
              Affordable home loans starting at 8.35% p.a. with lightning-fast approvals, 
              minimal paperwork, and a dedicated manager by your side throughout.
            </p>
            <div className="hl-hero__actions">
              <button className="hl-btn hl-btn--primary hl-btn--lg" onClick={() => navigate('/home-loan/apply')}>
                Apply Now →
              </button>
              <button className="hl-btn hl-btn--outline hl-btn--lg" onClick={() => navigate('/home-loan/eligibility')}>
                Check Eligibility
              </button>
            </div>
            <div className="hl-hero__stats">
              <div>
                <div className="hl-hero__stat-val">₹50Cr+</div>
                <div className="hl-hero__stat-lbl">Loans Disbursed</div>
              </div>
              <div>
                <div className="hl-hero__stat-val">10K+</div>
                <div className="hl-hero__stat-lbl">Happy Customers</div>
              </div>
              <div>
                <div className="hl-hero__stat-val">24hr</div>
                <div className="hl-hero__stat-lbl">Approval Time</div>
              </div>
            </div>
          </div>
          <div className="hl-hero__visual">
            <div className="hl-hero__visual-title">Current Interest Rates</div>
            {[
              { name: 'Home Loan', val: '8.40%' },
              { name: 'Balance Transfer', val: '8.35%' },
              { name: 'LAP', val: '9.00%' },
              { name: 'Construction Loan', val: '8.60%' },
              { name: 'Mortgage Loan', val: '9.25%' },
            ].map((r) => (
              <div key={r.name} className="hl-hero__rate-row">
                <span className="hl-hero__rate-name">{r.name}</span>
                <span className="hl-hero__rate-val">{r.val} p.a.</span>
              </div>
            ))}
            <div style={{ marginTop: '20px' }}>
              <button
                className="hl-btn hl-btn--primary"
                style={{ width: '100%' }}
                onClick={() => navigate('/home-loan/apply')}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LOAN TYPES */}
      <section className="hl-section">
        <div className="hl-container">
          <div className="hl-section-head hl-section-head--center">
            <div className="hl-section-label">Loan Products</div>
            <h2 className="hl-section-title">Choose the Right Loan for You</h2>
            <p className="hl-section-sub">We offer 9 specialised home loan products to match every property and financial need.</p>
          </div>
          <div className="hl-cards-grid">
            {LOAN_TYPES.map((loan) => (
              <HomeLoanCard key={loan.slug} loan={loan} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="hl-section hl-section--gray">
        <div className="hl-container">
          <div className="hl-section-head hl-section-head--center">
            <div className="hl-section-label">Why LoanEase</div>
            <h2 className="hl-section-title">Features & Benefits</h2>
            <p className="hl-section-sub">We've reimagined the home loan process from the ground up.</p>
          </div>
          <div className="hl-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="hl-feature-card">
                <div className="hl-feature-card__icon">{f.icon}</div>
                <div className="hl-feature-card__title">{f.title}</div>
                <div className="hl-feature-card__desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI CALCULATOR */}
      <section className="hl-section" id="emi-calc">
        <div className="hl-container">
          <div className="hl-section-head hl-section-head--center">
            <div className="hl-section-label">EMI Calculator</div>
            <h2 className="hl-section-title">Plan Your Finances</h2>
            <p className="hl-section-sub">Estimate your monthly EMI instantly. Adjust loan amount, tenure, and interest rate.</p>
          </div>
          <HomeLoanEmiWidget />
          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <button className="hl-btn hl-btn--primary hl-btn--lg" onClick={() => navigate('/home-loan/apply')}>
              Apply for This Loan →
            </button>
          </div>
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="hl-section hl-section--gray" id="documents">
        <div className="hl-container">
          <div className="hl-section-head">
            <div className="hl-section-label">Documents Required</div>
            <h2 className="hl-section-title">What You Need to Apply</h2>
            <p className="hl-section-sub">Keep these documents ready before starting your application. All uploads are 100% secure.</p>
          </div>
          <div className="hl-docs-grid">
            {ALL_DOCUMENTS.map((doc) => (
              <div key={doc.name} className="hl-doc-item">
                <div className="hl-doc-item__icon">{doc.icon}</div>
                <div>
                  <div className="hl-doc-item__name">{doc.name}</div>
                  <div className="hl-doc-item__note">{doc.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="hl-section" id="faq">
        <div className="hl-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
            <div>
              <div className="hl-section-label">FAQ</div>
              <h2 className="hl-section-title">Frequently Asked Questions</h2>
              <p className="hl-section-sub">Everything you need to know about home loans at LoanEase.</p>
              <div style={{ marginTop: '28px' }}>
                <button className="hl-btn hl-btn--primary" onClick={() => navigate('/home-loan/eligibility')}>
                  Check My Eligibility
                </button>
              </div>
            </div>
            <div className="hl-faq-list">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} faq={faq} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hl-cta-section">
        <h2>Ready to Own Your Dream Home?</h2>
        <p>Join 10,000+ happy homeowners who chose LoanEase for a seamless experience.</p>
        <div className="hl-cta-btns">
          <button
            className="hl-btn hl-btn--primary hl-btn--lg"
            style={{ background: '#fff', color: 'var(--c-orange)' }}
            onClick={() => navigate('/home-loan/apply')}
          >
            Apply Now — It's Free
          </button>
          <button
            className="hl-btn hl-btn--outline hl-btn--lg"
            onClick={() => navigate('/home-loan/eligibility')}
          >
            Check Eligibility First
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="hl-footer">
        <p>© 2025 LoanEase. NBFC registered with RBI. · <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a></p>
        <p style={{ marginTop: '8px', fontSize: '12px', opacity: .6 }}>
          Interest rates are indicative and subject to change. Loan approval is at the lender's discretion.
        </p>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="hl-sticky-apply">
        <button className="hl-btn hl-btn--primary" onClick={() => navigate('/home-loan/apply')}>
          Apply for Home Loan →
        </button>
      </div>
    </div>
  );
};

export default HomeLoan;
