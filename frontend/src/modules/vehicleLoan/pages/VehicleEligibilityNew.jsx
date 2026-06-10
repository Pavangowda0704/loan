// ============================================================
//  VehicleEligibilityNew.jsx — Eligibility Checker
//  Route: /vehicle-loan/eligibility
//  FIXED: all 6 loan types, real FOIR logic, CIBIL + LTV
//  checks, inline errors, no alert(), correct apply slugs
// ============================================================
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../vehicleLoan.css";

// ── All 6 loan types with full config ───────────────────────
const LOAN_CONFIGS = {
  "New Car Loan": {
    slug: "new-car", minIncome: 20000, minAge: 21, maxAge: 60,
    minCibil: 700, maxLtv: 100, maxAmt: 5000000,
    multiplier: 18, icon: "🚗",
    incomeLabel: "Monthly Salary / Net Income",
  },
  "Used Car Loan": {
    slug: "used-car", minIncome: 20000, minAge: 21, maxAge: 65,
    minCibil: 700, maxLtv: 90, maxAmt: 3000000,
    multiplier: 15, icon: "🚙",
    incomeLabel: "Monthly Salary / Net Income",
  },
  "Two-Wheeler Loan": {
    slug: "two-wheeler", minIncome: 10000, minAge: 18, maxAge: 65,
    minCibil: 650, maxLtv: 95, maxAmt: 500000,
    multiplier: 12, icon: "🏍️",
    incomeLabel: "Monthly Salary / Net Income",
  },
  "Used Bike Loan": {
    slug: "used-bike", minIncome: 10000, minAge: 18, maxAge: 65,
    minCibil: 650, maxLtv: 90, maxAmt: 300000,
    multiplier: 10, icon: "🛵",
    incomeLabel: "Monthly Salary / Net Income",
  },
  "Commercial Vehicle Loan": {
    slug: "commercial", minIncome: 0, minAge: 21, maxAge: 65,
    minCibil: 700, maxLtv: 90, maxAmt: 15000000,
    multiplier: 0, icon: "🚚",
    incomeLabel: "Monthly Business Income / Turnover ÷ 12",
  },
  "Agriculture Equipment Loan": {
    slug: "agriculture-equipment", minIncome: 0, minAge: 21, maxAge: 65,
    minCibil: 650, maxLtv: 90, maxAmt: 2500000,
    multiplier: 0, icon: "🚜",
    incomeLabel: "Monthly Agricultural Income",
  },
};

const TYPE_SLUG_MAP = {
  "new-car": "New Car Loan",
  "used-car": "Used Car Loan",
  "two-wheeler": "Two-Wheeler Loan",
  "used-bike": "Used Bike Loan",
  "commercial": "Commercial Vehicle Loan",
  "agriculture-equipment": "Agriculture Equipment Loan",
};

const fmt = v => "₹" + Number(v).toLocaleString("en-IN");

// ── Eligibility engine ───────────────────────────────────────
function calculateEligibility({ vehicle_type, monthly_income, age, cibil, loan_amount, vehicle_price, existing_emi, employment_type }) {
  const cfg = LOAN_CONFIGS[vehicle_type];
  const income     = Number(monthly_income) || 0;
  const loanAmt    = Number(loan_amount)    || 0;
  const vehPrice   = Number(vehicle_price)  || 0;
  const existEmi   = Number(existing_emi)   || 0;
  const ageNum     = Number(age)            || 0;
  const cibilNum   = Number(cibil)          || 0;

  const issues = [];

  // Age check
  if (ageNum < cfg.minAge || ageNum > cfg.maxAge)
    issues.push(`Age must be between ${cfg.minAge} and ${cfg.maxAge} years`);

  // Income check (commercial/agri have no hard floor but still need income)
  if (cfg.minIncome > 0 && income < cfg.minIncome)
    issues.push(`Minimum monthly income required: ${fmt(cfg.minIncome)}`);

  // CIBIL check
  if (cibilNum > 0 && cibilNum < cfg.minCibil)
    issues.push(`CIBIL score below minimum (${cfg.minCibil} required)`);

  // FOIR — max 50% of income can go to EMIs (rough check)
  const estimatedEmi = loanAmt > 0
    ? Math.round(loanAmt * (9 / 12 / 100) * Math.pow(1 + 9 / 12 / 100, 60) / (Math.pow(1 + 9 / 12 / 100, 60) - 1))
    : 0;
  const totalObligations = existEmi + estimatedEmi;
  if (income > 0 && totalObligations > income * 0.55)
    issues.push("Total EMI obligations exceed 55% of income (FOIR limit)");

  // LTV check
  if (vehPrice > 0 && loanAmt > 0) {
    const ltv = (loanAmt / vehPrice) * 100;
    if (ltv > cfg.maxLtv)
      issues.push(`Loan-to-value ratio ${ltv.toFixed(0)}% exceeds max ${cfg.maxLtv}% for this loan type`);
  }

  // Max loan cap
  if (loanAmt > cfg.maxAmt)
    issues.push(`Loan amount exceeds max ${fmt(cfg.maxAmt)} for this loan type`);

  // Compute max eligible
  let maxLoan = 0;
  if (cfg.multiplier > 0) {
    maxLoan = Math.min(income * cfg.multiplier, cfg.maxAmt);
  } else {
    // commercial / agri — based on LTV of vehicle price
    maxLoan = vehPrice > 0
      ? Math.min(Math.round(vehPrice * cfg.maxLtv / 100), cfg.maxAmt)
      : cfg.maxAmt;
  }
  // Reduce by FOIR headroom
  if (income > 0) {
    const foirHeadroom = income * 0.55 - existEmi;
    const foirBasedLoan = foirHeadroom > 0
      ? Math.round(foirHeadroom * 60 * 100 / (9 / 100 * Math.pow(1 + 9 / 1200, 60) / (Math.pow(1 + 9 / 1200, 60) - 1) * 100))
      : 0;
    if (foirBasedLoan > 0) maxLoan = Math.min(maxLoan, foirBasedLoan);
  }
  if (loanAmt > 0) maxLoan = Math.min(maxLoan, loanAmt);

  const eligible = issues.length === 0 && maxLoan > 0;
  const score = eligible
    ? (cibilNum >= 750 ? "Excellent" : cibilNum >= 700 ? "Good" : "Fair")
    : "Ineligible";

  return { eligible, issues, maxLoan: Math.max(0, maxLoan), score, cfg };
}

// ── Inline Toast ─────────────────────────────────────────────
function InlineError({ msg }) {
  if (!msg) return null;
  return (
    <div className="vl-inline-error" role="alert">
      <span>⚠</span> {msg}
    </div>
  );
}

export default function VehicleEligibilityNew() {
  const [params] = useSearchParams();
  const initType = TYPE_SLUG_MAP[params.get("type")] || "New Car Loan";

  const [form, setForm] = useState({
    full_name: "", phone: "", monthly_income: "", city: "",
    age: "", cibil: "", existing_emi: "",
    vehicle_type: initType,
    vehicle_condition: "New", vehicle_price: "", loan_amount: "",
    employment_type: "Salaried",
  });
  const [errors, setErrors]   = useState({});
  const [result, setResult]   = useState(null);
  const [checked, setChecked] = useState(false);

  const cfg = LOAN_CONFIGS[form.vehicle_type];

  const set = e => {
    const { name, value } = e.target;
    let val = value;
    if (name === "phone")   val = value.replace(/\D/g, "").slice(0, 10);
    if (name === "cibil")   val = value.replace(/\D/g, "").slice(0, 3);
    if (name === "age")     val = value.replace(/\D/g, "").slice(0, 2);
    setForm(f => ({ ...f, [name]: val }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim())    e.full_name    = "Full name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone     = "Enter a valid 10-digit mobile number";
    if (!form.monthly_income)      e.monthly_income = "Monthly income is required";
    if (!form.city.trim())         e.city         = "City is required";
    if (!form.loan_amount)         e.loan_amount  = "Required loan amount is required";
    if (!form.age)                 e.age          = "Age is required";
    else if (+form.age < 18 || +form.age > 70) e.age = "Age must be between 18 and 70";
    return e;
  };

  const checkEligibility = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const res = calculateEligibility(form);
    setResult(res);
    setChecked(true);
  };

  const reset = () => { setResult(null); setChecked(false); setErrors({}); };

  const applySlug  = cfg.slug;
  const applyQuery = `?name=${encodeURIComponent(form.full_name)}&phone=${encodeURIComponent(form.phone)}&income=${form.monthly_income}&city=${encodeURIComponent(form.city)}`;

  return (
    <div className="vl-page">
      <div className="vl-breadcrumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to="/vehicle-loan">Vehicle Loan</Link><span>›</span>
        <span>Check Eligibility</span>
      </div>

      {/* Hero */}
      <div className="vl-elig-hero">
        <div className="vl-chip vl-chip--blue">ELIGIBILITY CHECK</div>
        <h1>Check Your Vehicle Loan Eligibility</h1>
        <p>Instant result · No credit score impact · 100% free</p>
        <div className="vl-elig-hero-badges">
          {["✓ All 6 Loan Types","✓ Instant Result","✓ Real Eligibility Logic","✓ No CIBIL Impact"].map(b=>(
            <span key={b} className="vl-hero-badge">{b}</span>
          ))}
        </div>
      </div>

      <div className="vl-eligibility-page">
        <div className="vl-elig-layout">

          {/* ── Form ── */}
          <form className="vl-elig-form-card" onSubmit={checkEligibility} noValidate>
            <h2>Your Details</h2>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>
              Fields marked <strong>*</strong> are required
            </p>

            {/* Loan Type selector at top */}
            <div className="vl-elig-type-grid">
              {Object.entries(LOAN_CONFIGS).map(([name, c]) => (
                <button key={name} type="button"
                  className={`vl-elig-type-btn${form.vehicle_type === name ? " active" : ""}`}
                  onClick={() => { setForm(f => ({ ...f, vehicle_type: name })); setResult(null); }}>
                  <span>{c.icon}</span>
                  <span>{name.replace(" Loan", "")}</span>
                </button>
              ))}
            </div>

            <div className="vl-elig-form-grid">
              {/* Personal */}
              <div className="vl-elig-section-label">👤 Personal Details</div>

              <div className="vl-elig-field">
                <label>Full Name *</label>
                <input name="full_name" placeholder="Rahul Sharma"
                  value={form.full_name} onChange={set}
                  className={errors.full_name ? "vl-input-err" : ""} />
                <InlineError msg={errors.full_name} />
              </div>

              <div className="vl-elig-field">
                <label>Mobile Number *</label>
                <input name="phone" placeholder="98765 43210" inputMode="numeric"
                  value={form.phone} onChange={set}
                  className={errors.phone ? "vl-input-err" : ""} />
                <InlineError msg={errors.phone} />
              </div>

              <div className="vl-elig-field">
                <label>Age (years) *</label>
                <input name="age" placeholder="32" inputMode="numeric"
                  value={form.age} onChange={set}
                  className={errors.age ? "vl-input-err" : ""} />
                <InlineError msg={errors.age} />
              </div>

              <div className="vl-elig-field">
                <label>City *</label>
                <input name="city" placeholder="Mumbai"
                  value={form.city} onChange={set}
                  className={errors.city ? "vl-input-err" : ""} />
                <InlineError msg={errors.city} />
              </div>

              {/* Employment */}
              <div className="vl-elig-section-label" style={{ gridColumn: "1/-1" }}>💼 Employment & Income</div>

              <div className="vl-elig-field">
                <label>Employment Type</label>
                <select name="employment_type" value={form.employment_type} onChange={set}>
                  <option>Salaried</option>
                  <option>Self-Employed</option>
                  <option>Business Owner</option>
                  <option>Farmer</option>
                  <option>Freelancer</option>
                </select>
              </div>

              <div className="vl-elig-field">
                <label>{cfg.incomeLabel} *</label>
                <input name="monthly_income" placeholder="₹ 75,000" inputMode="numeric" type="number"
                  value={form.monthly_income} onChange={set}
                  className={errors.monthly_income ? "vl-input-err" : ""} />
                <InlineError msg={errors.monthly_income} />
              </div>

              <div className="vl-elig-field">
                <label>Existing Monthly EMI (if any)</label>
                <input name="existing_emi" placeholder="₹ 0" inputMode="numeric" type="number"
                  value={form.existing_emi} onChange={set} />
                <span className="vl-elig-hint">Include all current loan EMIs</span>
              </div>

              <div className="vl-elig-field">
                <label>CIBIL Score (optional)</label>
                <input name="cibil" placeholder="750" inputMode="numeric"
                  value={form.cibil} onChange={set} />
                <span className="vl-elig-hint">Leave blank if unknown — min {cfg.minCibil} required</span>
              </div>

              {/* Vehicle */}
              <div className="vl-elig-section-label" style={{ gridColumn: "1/-1" }}>🚗 Vehicle Details</div>

              <div className="vl-elig-field">
                <label>Vehicle Condition</label>
                <select name="vehicle_condition" value={form.vehicle_condition} onChange={set}>
                  <option value="New">New Vehicle</option>
                  <option value="Used">Used / Pre-Owned</option>
                </select>
              </div>

              <div className="vl-elig-field">
                <label>Vehicle Price (₹)</label>
                <input name="vehicle_price" placeholder="₹ 12,00,000" inputMode="numeric" type="number"
                  value={form.vehicle_price} onChange={set} />
                {form.vehicle_price && form.loan_amount && (
                  <span className="vl-elig-hint">
                    LTV: {Math.round((+form.loan_amount / +form.vehicle_price) * 100)}% (max {cfg.maxLtv}%)
                  </span>
                )}
              </div>

              <div className="vl-elig-field" style={{ gridColumn: "1/-1" }}>
                <label>Required Loan Amount (₹) *</label>
                <input name="loan_amount" placeholder="₹ 10,00,000" inputMode="numeric" type="number"
                  value={form.loan_amount} onChange={set}
                  className={errors.loan_amount ? "vl-input-err" : ""} />
                <InlineError msg={errors.loan_amount} />
                {cfg.maxAmt && (
                  <span className="vl-elig-hint">Max {fmt(cfg.maxAmt)} for {form.vehicle_type}</span>
                )}
              </div>
            </div>

            <button type="submit" className="vl-btn-primary"
              style={{ marginTop: 24, width: "100%", justifyContent: "center", padding: "14px" }}>
              Check My Eligibility →
            </button>

            {checked && (
              <button type="button" onClick={reset}
                style={{ marginTop: 10, width: "100%", background: "none", border: "none", color: "#6b7280", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
                Reset &amp; Check Again
              </button>
            )}
          </form>

          {/* ── Result Panel ── */}
          <div className="vl-elig-result-card">
            {!result && (
              <div className="vl-elig-placeholder">
                <div className="vl-elig-placeholder-icon">{cfg.icon}</div>
                <h3>Instant Eligibility Check</h3>
                <p>Fill your details and click "Check My Eligibility" to get an instant result — no CIBIL impact.</p>
                <div className="vl-elig-criteria-box">
                  <div className="vl-elig-criteria-title">
                    {cfg.icon} {form.vehicle_type} — Key Criteria
                  </div>
                  {[
                    ["Min. Income",    cfg.minIncome > 0 ? fmt(cfg.minIncome) + "/mo" : "Based on vehicle"],
                    ["Age Range",      `${cfg.minAge} – ${cfg.maxAge} years`],
                    ["Min. CIBIL",     `${cfg.minCibil}+`],
                    ["Max LTV",        `${cfg.maxLtv}%`],
                    ["Max Loan",       fmt(cfg.maxAmt)],
                  ].map(([l, v]) => (
                    <div key={l} className="vl-elig-criteria-row">
                      <span>{l}</span><strong>{v}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result?.eligible && (
              <div className="vl-elig-success">
                <div className="vl-elig-result-icon success">✓</div>
                <div className="vl-elig-score-badge vl-elig-score-badge--green">
                  {result.score} Profile
                </div>
                <h2>Congratulations, {form.full_name.split(" ")[0]}!</h2>
                <p>You are eligible for <strong>{form.vehicle_type}</strong></p>
                <div className="vl-elig-amount">{fmt(result.maxLoan)}</div>
                <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>
                  Estimated maximum eligible loan amount
                </p>
                <div className="vl-elig-result-rows">
                  {[
                    ["Monthly Income",  fmt(form.monthly_income)],
                    ["Loan Type",       form.vehicle_type],
                    ["Max LTV",         `${result.cfg.maxLtv}%`],
                    ["Existing EMI",    form.existing_emi ? fmt(form.existing_emi) : "Nil"],
                  ].map(([l, v]) => (
                    <div key={l} className="vl-elig-result-row">
                      <span>{l}</span><strong>{v}</strong>
                    </div>
                  ))}
                </div>
                <Link to={`/vehicle-loan/${applySlug}/apply${applyQuery}`}
                  className="vl-btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
                  Apply Now →
                </Link>
                <Link to={`/vehicle-loan/${applySlug}`}
                  className="vl-btn-outline"
                  style={{ width: "100%", justifyContent: "center", marginTop: 8, fontSize: 13 }}>
                  Know More About This Loan
                </Link>
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 14, textAlign: "center" }}>
                  *Eligibility is indicative. Final approval subject to credit assessment.
                </p>
              </div>
            )}

            {result && !result.eligible && (
              <div className="vl-elig-failure">
                <div className="vl-elig-result-icon warning">!</div>
                <div className="vl-elig-score-badge vl-elig-score-badge--red">Not Eligible</div>
                <h2>Not Eligible Currently</h2>
                <p>Your profile does not meet the criteria for <strong>{form.vehicle_type}</strong> at this time.</p>

                <div className="vl-elig-issues">
                  <div className="vl-elig-issues-title">Issues Found</div>
                  {result.issues.map((iss, i) => (
                    <div key={i} className="vl-elig-issue-item">
                      <span>✗</span><span>{iss}</span>
                    </div>
                  ))}
                </div>

                <div className="vl-elig-suggestions">
                  <div className="vl-elig-suggestions-title">💡 Suggestions</div>
                  <ul>
                    <li>Add a co-applicant with higher income</li>
                    <li>Reduce the required loan amount</li>
                    <li>Clear existing EMIs to improve FOIR</li>
                    {form.vehicle_type !== "Two-Wheeler Loan" && (
                      <li>Consider a Two-Wheeler Loan (lower income threshold)</li>
                    )}
                    <li>Improve CIBIL score before reapplying</li>
                  </ul>
                </div>

                <Link to="/vehicle-loan" className="vl-btn-outline"
                  style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
                  ← Explore Other Loan Options
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
