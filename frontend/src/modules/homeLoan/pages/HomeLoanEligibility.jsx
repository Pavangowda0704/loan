// frontend/src/modules/homeLoan/pages/HomeLoanEligibility.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LOAN_TYPES } from './HomeLoan';
import '../homeLoan.css';

const formatINR = (val) =>
  '₹' + Number(Math.round(val)).toLocaleString('en-IN');

const validate = (form) => {
  const errs = {};
  if (!form.loanType) errs.loanType = 'Please select a loan type';
  if (!form.employmentType) errs.employmentType = 'Please select employment type';
  if (!form.monthlyIncome || Number(form.monthlyIncome) < 10000)
    errs.monthlyIncome = 'Monthly income must be at least ₹10,000';
  if (!form.loanAmount || Number(form.loanAmount) < 100000)
    errs.loanAmount = 'Loan amount must be at least ₹1,00,000';
  if (!form.propertyValue || Number(form.propertyValue) < 200000)
    errs.propertyValue = 'Property value must be at least ₹2,00,000';
  if (form.existingEMI === '') errs.existingEMI = 'Enter existing EMIs (0 if none)';
  return errs;
};

const checkEligibility = (form) => {
  const income = Number(form.monthlyIncome);
  const loanAmt = Number(form.loanAmount);
  const propVal = Number(form.propertyValue);
  const existEMI = Number(form.existingEMI) || 0;

  // Max eligible loan: 80% of property value
  const maxByProperty = propVal * 0.80;

  // FOIR (Fixed Obligation to Income Ratio) — max 55%
  const maxTotalEMI = income * 0.55;
  const availableForEMI = maxTotalEMI - existEMI;

  // EMI for requested loan at 8.5% for 20 yrs
  const r = 8.5 / 12 / 100;
  const n = 20 * 12;
  const requiredEMI = (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  // Recommended amount based on available EMI capacity
  const recommendedAmount = Math.min(
    (availableForEMI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)),
    maxByProperty
  );

  const eligible = availableForEMI > 0 && requiredEMI <= availableForEMI && loanAmt <= maxByProperty;
  const conditional = !eligible && recommendedAmount >= 500000;

  return {
    eligible,
    conditional,
    requiredEMI: Math.round(requiredEMI),
    recommendedAmount: Math.round(Math.max(0, recommendedAmount)),
    maxByProperty: Math.round(maxByProperty),
    availableEMI: Math.round(availableForEMI),
    foir: Math.round(((existEMI + requiredEMI) / income) * 100),
  };
};

const HomeLoanEligibility = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    loanType: '',
    employmentType: '',
    monthlyIncome: '',
    loanAmount: '',
    propertyValue: '',
    existingEMI: '',
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setResult(checkEligibility(form));
  };

  const getResultType = () => {
    if (!result) return null;
    if (result.eligible) return 'eligible';
    if (result.conditional) return 'conditional';
    return 'ineligible';
  };

  const resultType = getResultType();

  const RESULT_CONFIG = {
    eligible: {
      emoji: '✅',
      title: 'Congratulations! You Are Eligible',
      color: 'var(--c-success)',
      desc: 'Based on your inputs, you qualify for the requested loan amount. Proceed to apply and get approval in 24 hours.',
    },
    conditional: {
      emoji: '⚠️',
      title: 'Conditionally Eligible',
      color: 'var(--c-warn)',
      desc: `You may not qualify for the full requested amount, but you're eligible for a lower loan amount. Consider adjusting your loan requirement.`,
    },
    ineligible: {
      emoji: '❌',
      title: 'Not Currently Eligible',
      color: 'var(--c-error)',
      desc: 'Based on current inputs, you do not meet eligibility criteria. Try reducing existing EMIs or increasing income. You can re-apply after improving your financial profile.',
    },
  };

  return (
    <div className="hl-module hl-eligibility-page">
      {/* NAV */}
      <nav className="hl-nav">
        <Link to="/home-loan" className="hl-nav__logo">Loan<span>Ease</span></Link>
        <ul className="hl-nav__links">
          <li><Link to="/home-loan">Home Loans</Link></li>
          <li><Link to="/home-loan/eligibility" style={{ color: 'var(--c-orange)' }}>Eligibility</Link></li>
          <li><Link to="/home-loan/apply">Apply</Link></li>
        </ul>
        <div className="hl-nav__cta">
          <Link to="/home-loan/apply" className="hl-btn hl-btn--primary hl-btn--sm">Apply Now</Link>
        </div>
        <button className="hl-nav__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={`hl-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/home-loan" onClick={() => setMenuOpen(false)}>← Home Loans</Link>
        <Link to="/home-loan/apply" className="hl-btn hl-btn--primary" onClick={() => setMenuOpen(false)}>Apply Now</Link>
      </div>

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, var(--c-navy) 0%, var(--c-navy-m) 100%)',
        padding: '48px 24px',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div className="hl-breadcrumb" style={{ justifyContent: 'center', marginBottom: '16px' }}>
          <Link to="/home-loan" style={{ color: '#94a3b8' }}>Home Loans</Link>
          <span className="hl-breadcrumb__sep">›</span>
          <span style={{ color: '#fff' }}>Eligibility Check</span>
        </div>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, marginBottom: '10px' }}>
          Check Your Loan Eligibility
        </h1>
        <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
          Find out how much home loan you qualify for based on your income and financial obligations.
        </p>
      </div>

      {/* FORM */}
      <section className="hl-section">
        <div className="hl-container">
          <div className="hl-elig-form-wrap">
            <div className="hl-form-card">
              <div className="hl-form-card__header">
                <h2>Eligibility Check Form</h2>
                <p>Takes less than 2 minutes. No credit score impact.</p>
              </div>
              <div className="hl-form-card__body">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="hl-form-grid" style={{ marginBottom: '20px' }}>
                    {/* Loan Type */}
                    <div className="hl-form-field">
                      <label className="hl-field-label">Loan Type <span className="req">*</span></label>
                      <select
                        name="loanType"
                        className={`hl-field-select ${errors.loanType ? 'error' : ''}`}
                        value={form.loanType}
                        onChange={handleChange}
                      >
                        <option value="">Select loan type</option>
                        {LOAN_TYPES.map((l) => (
                          <option key={l.slug} value={l.slug}>{l.name}</option>
                        ))}
                      </select>
                      {errors.loanType && <span className="hl-field-error">{errors.loanType}</span>}
                    </div>

                    {/* Employment Type */}
                    <div className="hl-form-field">
                      <label className="hl-field-label">Employment Type <span className="req">*</span></label>
                      <select
                        name="employmentType"
                        className={`hl-field-select ${errors.employmentType ? 'error' : ''}`}
                        value={form.employmentType}
                        onChange={handleChange}
                      >
                        <option value="">Select employment type</option>
                        <option value="salaried">Salaried</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="business">Business Owner</option>
                        <option value="nri">NRI</option>
                      </select>
                      {errors.employmentType && <span className="hl-field-error">{errors.employmentType}</span>}
                    </div>

                    {/* Monthly Income */}
                    <div className="hl-form-field">
                      <label className="hl-field-label">Net Monthly Income (₹) <span className="req">*</span></label>
                      <input
                        type="number"
                        name="monthlyIncome"
                        className={`hl-field-input ${errors.monthlyIncome ? 'error' : ''}`}
                        placeholder="e.g. 75000"
                        value={form.monthlyIncome}
                        onChange={handleChange}
                        min={0}
                      />
                      {errors.monthlyIncome && <span className="hl-field-error">{errors.monthlyIncome}</span>}
                    </div>

                    {/* Existing EMI */}
                    <div className="hl-form-field">
                      <label className="hl-field-label">Existing Monthly EMIs (₹) <span className="req">*</span></label>
                      <input
                        type="number"
                        name="existingEMI"
                        className={`hl-field-input ${errors.existingEMI ? 'error' : ''}`}
                        placeholder="0 if none"
                        value={form.existingEMI}
                        onChange={handleChange}
                        min={0}
                      />
                      {errors.existingEMI && <span className="hl-field-error">{errors.existingEMI}</span>}
                    </div>

                    {/* Loan Amount */}
                    <div className="hl-form-field">
                      <label className="hl-field-label">Loan Amount Needed (₹) <span className="req">*</span></label>
                      <input
                        type="number"
                        name="loanAmount"
                        className={`hl-field-input ${errors.loanAmount ? 'error' : ''}`}
                        placeholder="e.g. 5000000"
                        value={form.loanAmount}
                        onChange={handleChange}
                        min={0}
                      />
                      {errors.loanAmount && <span className="hl-field-error">{errors.loanAmount}</span>}
                    </div>

                    {/* Property Value */}
                    <div className="hl-form-field">
                      <label className="hl-field-label">Approximate Property Value (₹) <span className="req">*</span></label>
                      <input
                        type="number"
                        name="propertyValue"
                        className={`hl-field-input ${errors.propertyValue ? 'error' : ''}`}
                        placeholder="e.g. 7000000"
                        value={form.propertyValue}
                        onChange={handleChange}
                        min={0}
                      />
                      {errors.propertyValue && <span className="hl-field-error">{errors.propertyValue}</span>}
                    </div>
                  </div>

                  <button type="submit" className="hl-btn hl-btn--primary hl-btn--lg" style={{ width: '100%' }}>
                    Check My Eligibility →
                  </button>
                </form>

                {/* RESULT */}
                {result && resultType && (
                  <div className={`hl-elig-result hl-elig-result--${resultType}`}>
                    <div className="hl-elig-result__title" style={{ color: RESULT_CONFIG[resultType].color }}>
                      {RESULT_CONFIG[resultType].emoji} {RESULT_CONFIG[resultType].title}
                    </div>
                    <div className="hl-elig-result__desc">{RESULT_CONFIG[resultType].desc}</div>

                    {resultType !== 'ineligible' && (
                      <div className="hl-elig-result__metrics">
                        <div className="hl-elig-metric">
                          <div className="hl-elig-metric__label">
                            {resultType === 'eligible' ? 'Approved Loan Amount' : 'Recommended Amount'}
                          </div>
                          <div className="hl-elig-metric__value" style={{ color: 'var(--c-orange)', fontSize: '20px' }}>
                            {formatINR(resultType === 'eligible' ? Number(form.loanAmount) : result.recommendedAmount)}
                          </div>
                        </div>
                        <div className="hl-elig-metric">
                          <div className="hl-elig-metric__label">Estimated Monthly EMI</div>
                          <div className="hl-elig-metric__value" style={{ fontSize: '20px' }}>
                            {formatINR(result.requiredEMI)}
                          </div>
                        </div>
                        <div className="hl-elig-metric">
                          <div className="hl-elig-metric__label">Max Loan (80% of property)</div>
                          <div className="hl-elig-metric__value">{formatINR(result.maxByProperty)}</div>
                        </div>
                        <div className="hl-elig-metric">
                          <div className="hl-elig-metric__label">Your FOIR</div>
                          <div className="hl-elig-metric__value">{result.foir}%</div>
                        </div>
                      </div>
                    )}

                    <div className="hl-form-actions" style={{ borderTop: 'none', marginTop: '0', paddingTop: '0' }}>
                      {resultType !== 'ineligible' && (
                        <button
                          className="hl-btn hl-btn--primary hl-btn--lg"
                          onClick={() => navigate(`/home-loan/apply?type=${form.loanType}`)}
                        >
                          Proceed to Apply →
                        </button>
                      )}
                      <button
                        className="hl-btn hl-btn--ghost"
                        onClick={() => { setResult(null); setForm({ loanType: '', employmentType: '', monthlyIncome: '', loanAmount: '', propertyValue: '', existingEMI: '' }); }}
                      >
                        Check Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
              {[
                { icon: '📊', title: 'No Credit Check', desc: 'This eligibility check does not affect your CIBIL score.' },
                { icon: '🔒', title: '100% Secure', desc: 'Your data is encrypted and never shared with third parties.' },
                { icon: '⚡', title: 'Instant Result', desc: 'Get your eligibility status immediately, no waiting.' },
                { icon: '📞', title: 'Expert Help', desc: 'Call us at 1800-123-4567 if you need guidance.' },
              ].map((c) => (
                <div key={c.title} className="hl-feature-card" style={{ padding: '18px' }}>
                  <div className="hl-feature-card__icon" style={{ fontSize: '22px', marginBottom: '8px' }}>{c.icon}</div>
                  <div className="hl-feature-card__title" style={{ fontSize: '14px', marginBottom: '4px' }}>{c.title}</div>
                  <div className="hl-feature-card__desc" style={{ fontSize: '12px' }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="hl-footer">
        <p>© 2025 LoanEase · <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a></p>
        <p style={{ marginTop: '8px', fontSize: '12px', opacity: .6 }}>
          Eligibility calculation is indicative only. Final approval is at lender's discretion.
        </p>
      </footer>
    </div>
  );
};

export default HomeLoanEligibility;
