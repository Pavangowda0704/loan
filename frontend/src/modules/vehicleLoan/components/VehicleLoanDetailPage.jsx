// ============================================================
//  VehicleLoanDetailPage.jsx  —  Shared template used by
//  NewCarLoan / UsedCarLoan / TwoWheelerLoan / CommercialVehicleLoan
// ============================================================
import { useState } from "react";
import { Link } from "react-router-dom";
import VehicleEmiWidget from "./VehicleEmiWidget";
import "../vehicleLoan.css";

export default function VehicleLoanDetailPage({
  title, subtitle, heroClass, applyRoute,
  highlights, overviewItems, benefits,
  eligibility, documents, faqs,
  emiConfig, accentColor="#1A56DB",
  chip, chipClass,
}) {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview","Eligibility","Documents","EMI Calculator","FAQs"];

  const renderTabFaq = (f, i) => {
    const [open, setOpen] = useState(false);
    return (
      <div key={i} className={`vl-faq-item${open?" open":""}`}>
        <button className="vl-faq-q" onClick={()=>setOpen(!open)}>
          <span>{f.q}</span><span className="vl-faq-arrow">{open?"▲":"▼"}</span>
        </button>
        {open&&<div className="vl-faq-a">{f.a}</div>}
      </div>
    );
  };

  return (
    <div className="vl-page">
      {/* Breadcrumb */}
      <div className="vl-breadcrumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to="/vehicle-loan">Vehicle Loan</Link><span>›</span>
        <span>{title}</span>
      </div>

      {/* Sub-Hero */}
      <section className={`vl-sub-hero ${heroClass||""}`}>
        <div className="vl-sub-hero-inner">
          <div className={`vl-chip ${chipClass||""}`} style={{marginBottom:14}}>{chip||"VEHICLE LOAN"}</div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <div className="vl-sub-highlights">
            {highlights.map(h=>(
              <div key={h.label} className="vl-sub-hl">
                <div className="vl-sub-hl-val"><strong>{h.val}</strong></div>
                <div className="vl-sub-hl-lab">{h.label}</div>
              </div>
            )).reduce((acc,el,i)=>{ acc.push(el); if(i<highlights.length-1) acc.push(<div key={`d${i}`} className="vl-sub-hl-div"/>); return acc; },[])}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="vl-tabs-bar">
        {tabs.map(t=>(
          <button key={t} className={`vl-tab${activeTab===t?" active":""}`} onClick={()=>setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {/* Tab content */}
      <div className="vl-tab-content">

        {/* OVERVIEW */}
        {activeTab==="Overview"&&(
          <div className="vl-tab-layout">
            <div className="vl-tab-main">
              <h3>About {title}</h3>
              <div className="vl-overview-grid">
                {overviewItems.map(o=>(
                  <div key={o.title} className="vl-overview-card">
                    <span className="vl-overview-icon">{o.icon}</span>
                    <div><h5>{o.title}</h5><p>{o.desc}</p></div>
                  </div>
                ))}
              </div>
              {benefits&&(
                <>
                  <h3 style={{marginTop:8}}>Key Benefits</h3>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                    {benefits.map(b=>(
                      <div key={b} style={{background:"#f8faff",border:"1px solid #e6edff",borderRadius:12,padding:"12px 16px",fontSize:13.5,fontWeight:600,color:"#374151",display:"flex",alignItems:"center",gap:8}}>
                        <span style={{color:accentColor,fontWeight:800}}>✓</span>{b}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="vl-tab-side">
              <VehicleEmiWidget {...emiConfig} accentColor={accentColor}/>
              <Link to={applyRoute} className="vl-btn-primary" style={{width:"100%",justifyContent:"center"}}>Apply Now →</Link>
              <Link to={`/vehicle-loan/eligibility`} className="vl-btn-outline" style={{width:"100%",justifyContent:"center"}}>Check Eligibility</Link>
            </div>
          </div>
        )}

        {/* ELIGIBILITY */}
        {activeTab==="Eligibility"&&(
          <div className="vl-tab-layout">
            <div className="vl-tab-main">
              <h3>Eligibility Criteria</h3>
              <div className="vl-elig-table">
                {eligibility.map(r=>(
                  <div key={r.label} className="vl-elig-row">
                    <span className="vl-elig-label">{r.label}</span>
                    <span className="vl-elig-val">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="vl-note">
                <span>ℹ️</span>
                <p>Eligibility is subject to credit assessment, income verification, and LoanEase's credit policies. Final eligibility and loan amount may vary.</p>
              </div>
              <div style={{marginTop:22}}>
                <Link to="/vehicle-loan/eligibility" className="vl-btn-blue">Check My Eligibility →</Link>
              </div>
            </div>
            <div className="vl-tab-side">
              <VehicleEmiWidget {...emiConfig} accentColor={accentColor}/>
              <Link to={applyRoute} className="vl-btn-primary" style={{width:"100%",justifyContent:"center"}}>Apply Now →</Link>
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {activeTab==="Documents"&&(
          <div className="vl-tab-layout">
            <div className="vl-tab-main">
              <h3>Required Documents</h3>
              <p style={{color:"#6b7280",marginBottom:20,fontSize:14}}>Keep these documents ready for a smooth and fast application process.</p>
              <div className="vl-docs-tab-grid">
                {documents.map(d=>(
                  <div key={d.name} className="vl-doc-tab-item">
                    <span className="vl-doc-check" style={{background:accentColor}}>✓</span>
                    <div><h5>{d.name}</h5><p>{d.desc}</p></div>
                  </div>
                ))}
              </div>
              <div className="vl-note" style={{marginTop:20}}>
                <span>💡</span>
                <p>All documents should be clear, legible scans. Password-protected or blurry documents will delay processing.</p>
              </div>
            </div>
            <div className="vl-tab-side">
              <VehicleEmiWidget {...emiConfig} accentColor={accentColor}/>
              <Link to={applyRoute} className="vl-btn-primary" style={{width:"100%",justifyContent:"center"}}>Apply Now →</Link>
            </div>
          </div>
        )}

        {/* EMI CALCULATOR */}
        {activeTab==="EMI Calculator"&&(
          <div style={{maxWidth:680,margin:"0 auto"}}>
            <VehicleEmiWidget {...emiConfig} accentColor={accentColor}/>
            <div style={{textAlign:"center",marginTop:22}}>
              <Link to={applyRoute} className="vl-btn-primary">Apply Now →</Link>
            </div>
          </div>
        )}

        {/* FAQs */}
        {activeTab==="FAQs"&&(
          <div style={{maxWidth:760}}>
            <h3 style={{fontSize:20,fontWeight:800,color:"#0F1C3F",marginBottom:20}}>Frequently Asked Questions</h3>
            <div className="vl-faq-list">
              {faqs.map((f,i)=>renderTabFaq(f,i))}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="vl-cta">
        <h2>Apply for {title} Today</h2>
        <p>Quick process · Competitive rates · Fast disbursal</p>
        <div className="vl-actions vl-actions--center">
          <Link to={applyRoute} className="vl-btn-primary">Apply Now →</Link>
          <Link to="/vehicle-loan/eligibility" className="vl-btn-white">Check Eligibility</Link>
        </div>
      </section>
    </div>
  );
}