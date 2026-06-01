// frontend/src/modules/homeLoan/components/HomeLoanEmiWidget.jsx
import { useState, useEffect } from 'react';

const formatINR = (val) =>
  '₹' + Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 });

const HomeLoanEmiWidget = ({ defaultAmount = 5000000, defaultTenure = 20, defaultRate = 8.5 }) => {
  const [amount, setAmount] = useState(defaultAmount);
  const [tenure, setTenure] = useState(defaultTenure);
  const [rate, setRate] = useState(defaultRate);

  const calcEMI = () => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    if (r === 0) return amount / n;
    return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const emi = calcEMI();
  const totalPayable = emi * tenure * 12;
  const totalInterest = totalPayable - amount;
  const principalPct = Math.round((amount / totalPayable) * 100);

  return (
    <div className="hl-emi-widget">
      <div className="hl-emi-widget__header">
        🧮 EMI Calculator
        <span style={{ marginLeft: 'auto', fontSize: '13px', opacity: .85 }}>
          Estimate your monthly payment
        </span>
      </div>
      <div className="hl-emi-widget__body">
        {/* Controls */}
        <div className="hl-emi-widget__controls">
          <div className="hl-slider-group">
            <div className="hl-slider-label">
              <span>Loan Amount</span>
              <span>{formatINR(amount)}</span>
            </div>
            <input
              type="range"
              className="hl-slider"
              min={100000}
              max={50000000}
              step={50000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--c-slate)', marginTop: '4px' }}>
              <span>₹1L</span><span>₹5Cr</span>
            </div>
          </div>

          <div className="hl-slider-group">
            <div className="hl-slider-label">
              <span>Tenure</span>
              <span>{tenure} Years</span>
            </div>
            <input
              type="range"
              className="hl-slider"
              min={5}
              max={30}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--c-slate)', marginTop: '4px' }}>
              <span>5 yrs</span><span>30 yrs</span>
            </div>
          </div>

          <div className="hl-slider-group">
            <div className="hl-slider-label">
              <span>Interest Rate</span>
              <span>{rate}% p.a.</span>
            </div>
            <input
              type="range"
              className="hl-slider"
              min={6}
              max={18}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--c-slate)', marginTop: '4px' }}>
              <span>6%</span><span>18%</span>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--c-slate)', marginTop: '8px', lineHeight: '1.5' }}>
            * EMI is indicative. Actual rate depends on credit profile and lender assessment.
          </p>
        </div>

        {/* Results */}
        <div className="hl-emi-widget__results">
          <div className="hl-emi-result__main">
            <div className="hl-emi-result__label">Monthly EMI</div>
            <div className="hl-emi-result__value">{formatINR(Math.round(emi))}</div>
            <div className="hl-emi-result__sub">per month for {tenure} years</div>
          </div>

          <div className="hl-emi-chart">
            <div className="hl-emi-chart__fill" style={{ width: `${principalPct}%` }} />
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#64748b', marginBottom: '20px' }}>
            <span>🟠 Principal {principalPct}%</span>
            <span>⬜ Interest {100 - principalPct}%</span>
          </div>

          <div className="hl-emi-breakdown">
            <div className="hl-emi-breakdown__row">
              <span className="hl-emi-breakdown__key">Principal Amount</span>
              <span className="hl-emi-breakdown__val">{formatINR(amount)}</span>
            </div>
            <div className="hl-emi-breakdown__row">
              <span className="hl-emi-breakdown__key">Total Interest</span>
              <span className="hl-emi-breakdown__val">{formatINR(Math.round(totalInterest))}</span>
            </div>
            <div className="hl-emi-breakdown__row">
              <span className="hl-emi-breakdown__key">Total Amount Payable</span>
              <span className="hl-emi-breakdown__val" style={{ color: 'var(--c-orange)' }}>
                {formatINR(Math.round(totalPayable))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoanEmiWidget;
