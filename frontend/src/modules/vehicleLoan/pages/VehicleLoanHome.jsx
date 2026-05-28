// ============================================================
//  VehicleLoanHome.jsx  —  Route: /vehicle-loan
// ============================================================
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../vehicleLoan.css";

const LOAN_TYPES = [
  {
    icon: "🚗", title: "New Car Loan", slug: "new-car", accent: "",
    desc: "Finance your brand new car from authorised dealers at the best rates.",
    features: ["Up to 100% on-road funding", "Rates from 8.49% p.a.", "Tenure up to 7 years", "Approval in 24 hours"],
    defaultRate: 8.49, maxAmt: 5000000,
  },
  {
    icon: "🚙", title: "Used Car Loan", slug: "used-car", accent: "vl-type-card--orange",
    desc: "Best financing options for your pre-owned car with quick processing.",
    features: ["Up to 90% of car value", "Rates from 10.5% p.a.", "Tenure up to 5 years", "Easy processing"],
    defaultRate: 10.5, maxAmt: 3000000,
  },
  {
    icon: "🏍️", title: "Two-Wheeler Loan", slug: "two-wheeler", accent: "vl-type-card--green",
    desc: "Easy loans for bikes and scooters — new or pre-owned two-wheelers.",
    features: ["Up to 95% on-road funding", "Rates from 9.5% p.a.", "Tenure up to 4 years", "Quick approval"],
    defaultRate: 9.5, maxAmt: 500000,
  },
  {
    icon: "🚚", title: "Commercial Vehicle", slug: "commercial", accent: "vl-type-card--purple",
    desc: "Fuel your business with easy commercial vehicle financing solutions.",
    features: ["Trucks, buses & vans", "Rates from 11% p.a.", "Tenure up to 7 years", "Business-friendly"],
    defaultRate: 11, maxAmt: 10000000,
  },
  {
    icon: "🏍️", title: "Used Bike Loan", slug: "used-bike", accent: "vl-type-card--green",
    desc: "Affordable financing for pre-owned bikes and scooters up to 7 years old.",
    features: ["Up to 90% of assessed value", "Rates from 10.5% p.a.", "Tenure up to 3 years", "Quick 48-hr approval"],
    defaultRate: 10.5, maxAmt: 300000,
  },
  {
    icon: "🚜", title: "Agriculture Equipment", slug: "agriculture-equipment", accent: "",
    desc: "Finance tractors, harvesters and agri-machinery with farmer-friendly rates.",
    features: ["Tractors, harvesters & more", "Rates from 9% p.a.", "Tenure up to 7 years", "Seasonal repayment"],
    defaultRate: 9, maxAmt: 2500000,
  },
];

const BENEFITS = [
  { icon: "⚡", title: "Quick Approval", desc: "Get approval within 24 hours of application" },
  { icon: "💰", title: "Lowest Rates", desc: "Competitive rates starting from 8.49% p.a." },
  { icon: "📄", title: "Minimal Docs", desc: "Hassle-free process with minimal paperwork" },
  { icon: "📅", title: "Flexible Tenure", desc: "Repayment tenure up to 7 years" },
  { icon: "🏠", title: "Doorstep Service", desc: "Assistance at your doorstep" },
];

const DOCS = [
  {
    title: "All Vehicle Loans",
    icon: "📋",
    items: ["Aadhaar Card (identity proof)", "PAN Card (mandatory)", "Passport size photo", "6-month bank statement", "Income proof / salary slips"],
  },
  {
    title: "For New Vehicles",
    icon: "🚗",
    items: ["Proforma invoice from dealer", "Insurance quote", "Vehicle registration form", "Down payment receipt"],
  },
  {
    title: "For Used Vehicles",
    icon: "🔄",
    items: ["RC copy of vehicle", "Form 35 (NOC from seller)", "Insurance copy", "Vehicle valuation report", "Transfer of ownership docs"],
  },
];

const FAQS = [
  { q: "What is the maximum loan amount for a new car?", a: "For a new car, you can get up to 100% of the on-road price, subject to eligibility. The maximum amount depends on your income and credit profile." },
  { q: "What credit score is needed for a vehicle loan?", a: "A CIBIL score of 700 or above is preferred. Higher scores attract lower interest rates and faster approval." },
  { q: "Can I get a loan for an electric vehicle?", a: "Yes! LoanEase offers special EV financing with preferential interest rates and tenure options up to 7 years." },
  { q: "How quickly is the loan disbursed after approval?", a: "After final approval and document verification, the loan amount is disbursed directly to the dealer within 24-48 hours." },
  { q: "Is there a prepayment penalty?", a: "No prepayment charges after 6 months of the loan. Partial prepayment is also allowed without any foreclosure fee." },
];

const EMI_CONFIGS = {
  "New Car":        { min: 200000, max: 5000000, rate: 8.49, minRate: 8.49 },
  "Used Car":       { min: 100000, max: 3000000, rate: 10.5, minRate: 10.5 },
  "Two-Wheeler":    { min: 30000,  max: 500000,  rate: 9.5,  minRate: 9.5  },
  "Commercial":     { min: 500000, max: 10000000,rate: 11,   minRate: 11   },
};

function useEmi(loanAmt, rate, tenure) {
  return useMemo(() => {
    const r = rate / 12 / 100, n = tenure;
    if (r === 0) return { emi: loanAmt / n, interest: 0, total: loanAmt };
    const e = (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { emi: e, interest: e * n - loanAmt, total: e * n };
  }, [loanAmt, rate, tenure]);
}

function HomeEmiCalculator() {
  const [tab, setTab]     = useState("New Car");
  const cfg               = EMI_CONFIGS[tab];
  const [amt, setAmt]     = useState(cfg.min * 5);
  const [rate, setRate]   = useState(cfg.rate);
  const [tenure, setTenure] = useState(48);
  const { emi, interest, total } = useEmi(amt, rate, tenure);
  const fmt = v => "₹" + Math.round(v).toLocaleString("en-IN");
  const principal = amt, totalPay = total;
  const principalPct = totalPay > 0 ? (principal / totalPay) * 238.76 : 0;

  return (
    <div className="vl-emi-section vl-section" style={{borderRadius:24}}>
      <div className="vl-emi-inner">
        <div className="vl-emi-left">
          <div className="vl-chip vl-chip--blue" style={{background:"rgba(255,255,255,.12)",color:"#fff"}}>EMI CALCULATOR</div>
          <h2>Calculate Your Monthly EMI</h2>
          <p>Get an instant estimate for any vehicle loan type.</p>
          <div className="vl-emi-type-tabs">
            {Object.keys(EMI_CONFIGS).map(t => (
              <button key={t} className={`vl-emi-tab${tab===t?" active":""}`}
                onClick={() => { setTab(t); const c=EMI_CONFIGS[t]; setAmt(c.min*5); setRate(c.rate); }}>
                {t}
              </button>
            ))}
          </div>
          <div className="vl-emi-fields">
            <div className="vl-emi-field" style={{gridColumn:"1/-1"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <label>Loan Amount</label><span style={{color:"#fdba74",fontWeight:700}}>{fmt(amt)}</span>
              </div>
              <input type="range" className="vl-emi-slider" min={cfg.min} max={cfg.max} step={cfg.min} value={amt} onChange={e=>setAmt(+e.target.value)} />
              <div className="vl-emi-slider-row"><span>{fmt(cfg.min)}</span><span>{fmt(cfg.max)}</span></div>
            </div>
            <div className="vl-emi-field">
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <label>Interest Rate (% p.a.)</label><span style={{color:"#fdba74",fontWeight:700}}>{rate.toFixed(2)}</span>
              </div>
              <input type="range" className="vl-emi-slider" min={cfg.minRate} max={20} step={0.1} value={rate} onChange={e=>setRate(+e.target.value)} />
              <div className="vl-emi-slider-row"><span>{cfg.minRate}%</span><span>20%</span></div>
            </div>
            <div className="vl-emi-field">
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <label>Tenure (Months)</label><span style={{color:"#fdba74",fontWeight:700}}>{tenure}</span>
              </div>
              <input type="range" className="vl-emi-slider" min={12} max={84} step={12} value={tenure} onChange={e=>setTenure(+e.target.value)} />
              <div className="vl-emi-slider-row"><span>12</span><span>84</span></div>
            </div>
          </div>
        </div>

        <div className="vl-emi-result">
          <div className="vl-emi-result-title">Monthly EMI</div>
          <div className="vl-emi-result-val">{fmt(emi)}<span style={{fontSize:14,fontWeight:400,marginLeft:4}}>/month</span></div>
          <div className="vl-emi-result-row"><span>Loan Amount</span><strong>{fmt(amt)}</strong></div>
          <div className="vl-emi-result-row"><span>Total Interest</span><strong>{fmt(interest)}</strong></div>
          <div className="vl-emi-result-row"><span>Total Payable</span><strong>{fmt(total)}</strong></div>
          <div className="vl-emi-donut">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="14"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#f97316" strokeWidth="14"
                strokeDasharray={`${principalPct} 238.76`} strokeDashoffset="59.69" strokeLinecap="round"/>
            </svg>
            <div className="vl-emi-legend">
              <span><i style={{background:"#f97316"}}/>Principal</span>
              <span><i style={{background:"rgba(255,255,255,.15)"}}/>Interest</span>
            </div>
          </div>
          <Link to={`/vehicle-loan/${["New Car","Used Car","Two-Wheeler","Commercial"].indexOf(tab)===0?"new-car":tab==="Used Car"?"used-car":tab==="Two-Wheeler"?"two-wheeler":"commercial"}/apply`}
            className="vl-btn-primary" style={{width:"100%",marginTop:18,justifyContent:"center"}}>
            Apply Now →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VehicleLoanHome() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="vl-page">
      {/* Hero */}
      <section className="vl-hero">
        <div className="vl-hero-inner">
          <div className="vl-hero-text">
            <div className="vl-chip">VEHICLE LOAN</div>
            <h1>Drive Your <span>Dream Vehicle</span> Today</h1>
            <p>Get quick approval and competitive interest rates on New Car, Used Car, Two-Wheeler &amp; Commercial Vehicle Loans.</p>
            <div className="vl-hero-badges">
              {["✓ Quick Approval in 24 Hrs","✓ Minimal Documentation","✓ Flexible Tenure Up to 7 Years","✓ Up to 100% Financing"].map(b=>(
                <span key={b} className="vl-hero-badge">{b}</span>
              ))}
            </div>
            <div className="vl-actions">
              <Link to="/vehicle-loan/new-car" className="vl-btn-primary">Explore Loans →</Link>
              <Link to="/vehicle-loan/eligibility" className="vl-btn-white">Check Eligibility</Link>
            </div>
          </div>
          <div className="vl-hero-card">
            <h3>Loan Highlights</h3>
            <div className="vl-hero-stats">
              <div className="vl-hero-stat"><div className="vl-hero-stat-val">₹1.5 Cr</div><div className="vl-hero-stat-lab">Max Loan Amount</div></div>
              <div className="vl-hero-stat"><div className="vl-hero-stat-val">8.49%</div><div className="vl-hero-stat-lab">Starting Rate p.a.</div></div>
              <div className="vl-hero-stat"><div className="vl-hero-stat-val">84 Mo</div><div className="vl-hero-stat-lab">Max Tenure</div></div>
              <div className="vl-hero-stat"><div className="vl-hero-stat-val">24 Hrs</div><div className="vl-hero-stat-lab">Quick Approval</div></div>
            </div>
            <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #f0f4ff",display:"flex",gap:10}}>
              <Link to="/vehicle-loan/apply" className="vl-btn-primary" style={{flex:1,justifyContent:"center",fontSize:13,padding:"10px 14px"}}>Apply Now</Link>
              <Link to="/vehicle-loan/eligibility" className="vl-btn-outline" style={{flex:1,justifyContent:"center",fontSize:13,padding:"10px 14px"}}>Check Eligibility</Link>
            </div>
          </div>
        </div>
        <div className="vl-hero-blob vl-hero-blob--1"/>
        <div className="vl-hero-blob vl-hero-blob--2"/>
      </section>

      {/* Stats Bar */}
      <section className="vl-stats-bar">
        <div className="vl-stats-inner">
          {[["5 Lakh+","Vehicles Financed"],["₹8,000 Cr+","Loans Disbursed"],["8.49%","Starting Rate"],["24 Hrs","Approval Time"],["4.9/5","Customer Rating"]].map(([v,l])=>(
            <div key={l} className="vl-stat-item"><div className="vl-stat-val">{v}</div><div className="vl-stat-lab">{l}</div></div>
          ))}
        </div>
      </section>

      {/* Loan Types */}
      <section className="vl-section" style={{marginTop:60,marginBottom:60}}>
        <div className="vl-section-head">
          <div className="vl-chip">LOAN OPTIONS</div>
          <h2>Explore Vehicle Loan Options</h2>
          <p>Choose the right loan for your needs — new, used, two-wheeler or commercial</p>
        </div>
        <div className="vl-types-grid">
          {LOAN_TYPES.map(lt=>(
            <div key={lt.slug} className={`vl-type-card ${lt.accent}`}>
              <div className="vl-type-icon">{lt.icon}</div>
              <h3>{lt.title}</h3>
              <p>{lt.desc}</p>
              <ul className="vl-type-features">
                {lt.features.map(f=><li key={f}>{f}</li>)}
              </ul>
              <div className="vl-type-card-actions">
                <Link to={`/vehicle-loan/${lt.slug}`} className="vl-btn-blue" style={{fontSize:13,padding:"9px 16px"}}>Learn More →</Link>
                <Link to={`/vehicle-loan/${lt.slug}/apply`} className="vl-btn-outline" style={{fontSize:13,padding:"9px 16px"}}>Apply</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="vl-section">
        <div className="vl-benefits-section">
          <div className="vl-section-head">
            <div className="vl-chip">WHY CHOOSE US</div>
            <h2>Why Choose LoanEase?</h2>
            <p>Everything designed to make vehicle financing seamless and stress-free</p>
          </div>
          <div className="vl-benefits-grid">
            {BENEFITS.map(b=>(
              <div key={b.title} className="vl-benefit-card">
                <div className="vl-benefit-icon">{b.icon}</div>
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI Calculator */}
      <section className="vl-section" style={{marginTop:60}}>
        <HomeEmiCalculator />
      </section>

      {/* Required Documents */}
      <section className="vl-section vl-docs-section">
        <div className="vl-section-head">
          <div className="vl-chip">DOCUMENTS</div>
          <h2>Required Documents</h2>
          <p>Keep these ready for a smooth and quick application process</p>
        </div>
        <div className="vl-docs-grid">
          {DOCS.map(d=>(
            <div key={d.title} className="vl-doc-card">
              <h3>{d.icon} {d.title}</h3>
              <div className="vl-doc-list">
                {d.items.map(item=>(
                  <div key={item} className="vl-doc-item">
                    <span className="vl-doc-check">✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="vl-section" style={{marginTop:60,marginBottom:56}}>
        <div className="vl-section-head">
          <div className="vl-chip">PROCESS</div>
          <h2>How to Apply in 4 Simple Steps</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
          {[
            {n:"1",icon:"📋",t:"Check Eligibility",d:"Fill basic details and verify your eligibility in seconds"},
            {n:"2",icon:"📝",t:"Apply Online",d:"Complete the 4-step application form with your details"},
            {n:"3",icon:"📤",t:"Upload Documents",d:"Upload required documents securely through our portal"},
            {n:"4",icon:"✅",t:"Get Disbursed",d:"Approved amount disbursed to dealer within 24-48 hours"},
          ].map((s,i)=>(
            <div key={s.n} style={{background:"#fff",borderRadius:18,padding:24,border:"1px solid #e6edff",textAlign:"center",boxShadow:"0 2px 12px rgba(15,28,63,.05)"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"#eef3ff",color:"#1A56DB",fontWeight:800,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>{s.n}</div>
              <div style={{fontSize:26,marginBottom:10}}>{s.icon}</div>
              <h5 style={{fontWeight:800,color:"#0F1C3F",marginBottom:6}}>{s.t}</h5>
              <p style={{fontSize:13,color:"#6b7280",lineHeight:1.6}}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="vl-section" style={{marginBottom:60}}>
        <div className="vl-section-head">
          <div className="vl-chip">FAQ</div>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="vl-faq-list" style={{maxWidth:820,margin:"0 auto"}}>
          {FAQS.map((f,i)=>(
            <div key={i} className={`vl-faq-item${openFaq===i?" open":""}`}>
              <button className="vl-faq-q" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                <span>{f.q}</span><span className="vl-faq-arrow">{openFaq===i?"▲":"▼"}</span>
              </button>
              {openFaq===i&&<div className="vl-faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="vl-cta">
        <div className="vl-chip" style={{margin:"0 auto 16px",background:"rgba(255,255,255,.12)",color:"#fff"}}>GET STARTED</div>
        <h2>Ready to Drive Home Your Dream Vehicle?</h2>
        <p>Apply online in minutes. Quick approval · Minimal documents · Competitive rates</p>
        <div className="vl-actions vl-actions--center">
          <Link to="/vehicle-loan/apply" className="vl-btn-primary">Apply Now →</Link>
          <Link to="/vehicle-loan/eligibility" className="vl-btn-white">Check Eligibility</Link>
        </div>
        <p style={{marginTop:14,fontSize:13,color:"rgba(255,255,255,.55)"}}>*Interest rates are indicative and subject to credit assessment.</p>
      </section>
    </div>
  );
}