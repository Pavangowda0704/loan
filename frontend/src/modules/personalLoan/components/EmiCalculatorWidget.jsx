// ============================================================
//  EmiCalculatorWidget.jsx — Reusable EMI Calculator
// ============================================================
import { useState, useMemo } from "react";

function EmiCalculatorWidget({ defaultRate = 11.49, maxAmount = 4000000, minRate = 11.49 }) {
  const [loanAmt, setLoanAmt]   = useState(1000000);
  const [rate, setRate]         = useState(defaultRate);
  const [tenure, setTenure]     = useState(36);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    if (r === 0) return { emi: loanAmt / n, totalInterest: 0, totalPayment: loanAmt };
    const e = (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const tp = e * n;
    return { emi: e, totalInterest: tp - loanAmt, totalPayment: tp };
  }, [loanAmt, rate, tenure]);

  const fmt = (v) => "₹ " + Math.round(v).toLocaleString("en-IN");

  return (
    <div className="emi-widget">
      <h3 className="emi-widget-title">EMI Calculator</h3>

      <div className="emi-widget-body">
        <div className="emi-inputs">
          <div className="emi-field">
            <div className="emi-field-row">
              <label>Loan Amount</label>
              <span className="emi-val-display">{fmt(loanAmt)}</span>
            </div>
            <input type="range" min={100000} max={maxAmount} step={50000}
              value={loanAmt} onChange={e => setLoanAmt(+e.target.value)} className="emi-slider" />
            <div className="emi-range-labels"><span>₹1L</span><span>₹{maxAmount/100000}L</span></div>
          </div>

          <div className="emi-field">
            <div className="emi-field-row">
              <label>Interest Rate (% p.a.)</label>
              <span className="emi-val-display">{rate.toFixed(2)}</span>
            </div>
            <input type="range" min={minRate} max={24} step={0.1}
              value={rate} onChange={e => setRate(+e.target.value)} className="emi-slider" />
            <div className="emi-range-labels"><span>{minRate}%</span><span>24%</span></div>
          </div>

          <div className="emi-field">
            <div className="emi-field-row">
              <label>Tenure (Months)</label>
              <span className="emi-val-display">{tenure}</span>
            </div>
            <input type="range" min={12} max={60} step={6}
              value={tenure} onChange={e => setTenure(+e.target.value)} className="emi-slider" />
            <div className="emi-range-labels"><span>12</span><span>60</span></div>
          </div>
        </div>

        <div className="emi-results">
          <div className="emi-result-main">
            <div className="emi-result-label">Monthly EMI</div>
            <div className="emi-result-val">{fmt(emi)}</div>
          </div>
          <div className="emi-result-row">
            <span>Total Interest</span>
            <strong>{fmt(totalInterest)}</strong>
          </div>
          <div className="emi-result-row">
            <span>Total Payment</span>
            <strong>{fmt(totalPayment)}</strong>
          </div>
          <div className="emi-donut-wrap">
            <svg viewBox="0 0 100 100" className="emi-donut">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e8eef9" strokeWidth="14"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#1455d9" strokeWidth="14"
                strokeDasharray={`${(loanAmt/totalPayment)*238.76} 238.76`}
                strokeDashoffset="59.69" strokeLinecap="round" />
            </svg>
            <div className="emi-donut-legend">
              <span><i style={{background:"#1455d9"}} />Principal</span>
              <span><i style={{background:"#e8eef9"}} />Interest</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmiCalculatorWidget;