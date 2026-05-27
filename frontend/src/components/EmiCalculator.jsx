/* ============================================
   EmiCalculator.jsx
   Real EMI formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
   Edit TENURE_OPTIONS to add/remove tenure choices
   ============================================ */
import { useState, useMemo } from 'react'
import './EmiCalculator.css'

// === EDIT: tenure dropdown options ===
const TENURE_OPTIONS = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30]

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function EmiCalculator() {
  // === EDIT: default values ===
  const [loanAmount, setLoanAmount] = useState(1000000)   // ₹10,00,000
  const [interestRate, setInterestRate] = useState(8.5)   // 8.5% p.a.
  const [tenureYears, setTenureYears] = useState(20)      // 20 years

  const [calculated, setCalculated] = useState(true)

  const emi = useMemo(() => {
    const p = parseFloat(loanAmount)
    const r = parseFloat(interestRate) / 12 / 100
    const n = parseInt(tenureYears) * 12
    if (!p || !r || !n) return 0
    const emiVal = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    return Math.round(emiVal)
  }, [loanAmount, interestRate, tenureYears])

  const totalPayment = emi * parseInt(tenureYears) * 12
  const totalInterest = totalPayment - parseFloat(loanAmount)

  const handleCalculate = (e) => {
    e.preventDefault()
    setCalculated(true)
  }

  return (
    <section className="emi" id="emi" aria-label="EMI calculator">
      <div className="container">
        <div className="emi__header">
          {/* === EDIT: section label & heading === */}
          <span className="section-label">EMI Calculator</span>
          <h2 className="section-title">Check Your <span>EMI in Seconds</span></h2>
          <p className="section-subtitle">Use our calculator to plan your loan repayment easily.</p>
        </div>

        <div className="emi__layout">
          {/* Left: Inputs */}
          <div className="card emi__form-card">
            <form onSubmit={handleCalculate} noValidate>
              <div className="emi__fields">

                {/* Loan Amount */}
                <div className="emi__field">
                  <label htmlFor="loan-amount" className="emi__label">Loan Amount</label>
                  <div className="emi__input-wrap">
                    <span className="emi__prefix">₹</span>
                    <input
                      id="loan-amount"
                      type="number"
                      className="emi__input"
                      value={loanAmount}
                      min="50000"
                      max="50000000"
                      step="10000"
                      onChange={e => { setLoanAmount(e.target.value); setCalculated(false) }}
                      aria-label="Loan amount in rupees"
                    />
                  </div>
                  <input
                    type="range" className="emi__range" aria-hidden="true"
                    min="50000" max="10000000" step="50000"
                    value={loanAmount}
                    onChange={e => { setLoanAmount(e.target.value); setCalculated(false) }}
                  />
                  <div className="emi__range-labels">
                    <span>₹50K</span><span>₹1Cr</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="emi__field">
                  <label htmlFor="interest-rate" className="emi__label">Interest Rate (% p.a.)</label>
                  <div className="emi__input-wrap">
                    <input
                      id="interest-rate"
                      type="number"
                      className="emi__input"
                      value={interestRate}
                      min="5"
                      max="36"
                      step="0.1"
                      onChange={e => { setInterestRate(e.target.value); setCalculated(false) }}
                      aria-label="Annual interest rate in percent"
                    />
                    <span className="emi__suffix">%</span>
                  </div>
                  <input
                    type="range" className="emi__range" aria-hidden="true"
                    min="5" max="24" step="0.1"
                    value={interestRate}
                    onChange={e => { setInterestRate(e.target.value); setCalculated(false) }}
                  />
                  <div className="emi__range-labels">
                    <span>5%</span><span>24%</span>
                  </div>
                </div>

                {/* Tenure */}
                <div className="emi__field">
                  <label htmlFor="tenure" className="emi__label">Loan Tenure</label>
                  <select
                    id="tenure"
                    className="emi__select"
                    value={tenureYears}
                    onChange={e => { setTenureYears(e.target.value); setCalculated(false) }}
                    aria-label="Loan tenure in years"
                  >
                    {TENURE_OPTIONS.map(y => (
                      <option key={y} value={y}>{y} {y === 1 ? 'Year' : 'Years'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary emi__btn">
                Calculate EMI
              </button>
            </form>
          </div>

          {/* Right: Result */}
          <div className={`card emi__result-card${calculated ? ' emi__result-card--active' : ''}`} aria-live="polite">
            <p className="emi__result-label">Your Estimated EMI</p>
            <p className="emi__result-emi">{formatINR(emi)}<span>/month</span></p>
            <p className="emi__result-note">* Approximate. Final rate set at disbursement.</p>

            <div className="emi__breakdown">
              <div className="emi__breakdown-row">
                <span>Principal Amount</span>
                <strong>{formatINR(loanAmount)}</strong>
              </div>
              <div className="emi__breakdown-row">
                <span>Total Interest</span>
                <strong className="emi__interest">{formatINR(Math.max(0, totalInterest))}</strong>
              </div>
              <div className="emi__breakdown-row emi__breakdown-total">
                <span>Total Payment</span>
                <strong>{formatINR(Math.max(0, totalPayment))}</strong>
              </div>
            </div>

            <a href="#apply" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
              Apply for This Loan
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
