// ============================================================
//  VehicleEmiWidget.jsx — Reusable EMI calculator
//  Layout: inputs left | results right (2-column)
// ============================================================
import { useState, useMemo } from "react";
import "../vehicleLoan.css";

export default function VehicleEmiWidget({ defaultRate=8.49, maxAmt=5000000, minAmt=200000, minRate=8.49, accentColor="#1A56DB" }) {
  const [amt,    setAmt]    = useState(Math.round((minAmt + maxAmt) / 2 / 50000) * 50000);
  const [rate,   setRate]   = useState(defaultRate);
  const [tenure, setTenure] = useState(48);

  const { emi, interest, total } = useMemo(() => {
    const r = rate / 12 / 100, n = tenure;
    if (r === 0) return { emi: amt/n, interest: 0, total: amt };
    const e = (amt * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
    return { emi: e, interest: e*n - amt, total: e*n };
  }, [amt, rate, tenure]);

  const fmt = v => "₹ " + Math.round(v).toLocaleString("en-IN");
  const principalPct = total > 0 ? (amt / total) * 238.76 : 0;

  return (
    <div className="vl-side-emi">
      <div className="vl-side-emi-title">EMI Calculator</div>

      <div className="vl-emi-two-col">

        {/* ── Left: Inputs ── */}
        <div className="vl-emi-inputs">
          <div className="vl-side-field">
            <div className="vl-side-field-row">
              <label>Loan Amount</label><span>{fmt(amt)}</span>
            </div>
            <input type="range" className="vl-side-slider" min={minAmt} max={maxAmt} step={50000}
              value={amt} onChange={e=>setAmt(+e.target.value)} style={{accentColor}} />
            <div className="vl-side-range"><span>{fmt(minAmt)}</span><span>{fmt(maxAmt)}</span></div>
          </div>

          <div className="vl-side-field">
            <div className="vl-side-field-row">
              <label>Interest Rate (% p.a.)</label><span>{rate.toFixed(2)}</span>
            </div>
            <input type="range" className="vl-side-slider" min={minRate} max={20} step={0.1}
              value={rate} onChange={e=>setRate(+e.target.value)} style={{accentColor}} />
            <div className="vl-side-range"><span>{minRate}%</span><span>20%</span></div>
          </div>

          <div className="vl-side-field">
            <div className="vl-side-field-row">
              <label>Tenure (Months)</label><span>{tenure}</span>
            </div>
            <input type="range" className="vl-side-slider" min={12} max={84} step={12}
              value={tenure} onChange={e=>setTenure(+e.target.value)} style={{accentColor}} />
            <div className="vl-side-range"><span>12</span><span>84</span></div>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="vl-side-result">
          <div className="vl-side-result-label">Monthly EMI</div>
          <div className="vl-side-result-val" style={{color: accentColor}}>{fmt(emi)}</div>
          <div className="vl-side-result-row"><span>Total Interest</span><strong>{fmt(interest)}</strong></div>
          <div className="vl-side-result-row"><span>Total Payment</span><strong>{fmt(total)}</strong></div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginTop:12}}>
            <svg viewBox="0 0 100 100" style={{width:56,height:56,flexShrink:0}}>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e8eef9" strokeWidth="14"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke={accentColor} strokeWidth="14"
                strokeDasharray={`${principalPct} 238.76`} strokeDashoffset="59.69" strokeLinecap="round"/>
            </svg>
            <div style={{display:"flex",flexDirection:"column",gap:4,fontSize:11,color:"#6b7280"}}>
              <span style={{display:"flex",alignItems:"center",gap:5}}><i style={{width:8,height:8,borderRadius:2,background:accentColor,display:"block"}}/> Principal</span>
              <span style={{display:"flex",alignItems:"center",gap:5}}><i style={{width:8,height:8,borderRadius:2,background:"#e8eef9",display:"block"}}/> Interest</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}