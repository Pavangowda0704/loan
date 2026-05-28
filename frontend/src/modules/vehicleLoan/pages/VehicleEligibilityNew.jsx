// ============================================================
//  VehicleEligibilityNew.jsx — Eligibility Checker
//  Route: /vehicle-loan/eligibility
// ============================================================
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../vehicleLoan.css";

const VEHICLE_TYPES = [
  "New Car Loan","Used Car Loan","Two-Wheeler Loan","Commercial Vehicle Loan",
];

const TYPE_SLUG_MAP = {
  "new-car":"New Car Loan","used-car":"Used Car Loan",
  "two-wheeler":"Two-Wheeler Loan","commercial":"Commercial Vehicle Loan",
};

const APPLY_SLUG = {
  "New Car Loan":"new-car","Used Car Loan":"used-car",
  "Two-Wheeler Loan":"two-wheeler","Commercial Vehicle Loan":"commercial",
};

export default function VehicleEligibilityNew() {
  const [params]    = useSearchParams();
  const [form, setForm] = useState({
    full_name:"", phone:"", monthly_income:"", city:"",
    vehicle_type: TYPE_SLUG_MAP[params.get("type")] || "New Car Loan",
    vehicle_condition:"New", vehicle_price:"", loan_amount:"",
  });
  const [result, setResult] = useState(null);

  const set = e => setForm({...form,[e.target.name]:e.target.value});

  const checkEligibility = e => {
    e.preventDefault();
    const { full_name, phone, monthly_income, vehicle_type, loan_amount, city } = form;
    if (!full_name||!phone||!monthly_income||!loan_amount||!city)
      return alert("Please fill all required fields.");
    if (!/^[0-9]{10}$/.test(phone)) return alert("Mobile must be 10 digits.");

    const income    = Number(monthly_income);
    const minIncome = vehicle_type==="Two-Wheeler Loan" ? 10000 : 20000;
    const eligible  = income >= minIncome;
    const maxLoan   = eligible ? income * 18 : 0;

    setResult({ eligible, maxLoan, income, vehicleType: vehicle_type, minIncome });
  };

  const applySlug  = APPLY_SLUG[form.vehicle_type]||"new-car";
  const applyQuery = `?name=${encodeURIComponent(form.full_name)}&phone=${encodeURIComponent(form.phone)}&income=${form.monthly_income}&city=${encodeURIComponent(form.city)}`;

  return (
    <div className="vl-page">
      <div className="vl-breadcrumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to="/vehicle-loan">Vehicle Loan</Link><span>›</span>
        <span>Check Eligibility</span>
      </div>

      <div className="vl-eligibility-page">
        <div className="vl-apply-header" style={{textAlign:"left",marginBottom:28}}>
          <div className="vl-chip">ELIGIBILITY CHECK</div>
          <h1>Check Vehicle Loan Eligibility</h1>
          <p style={{color:"#6b7280",fontSize:14}}>Fill in your details to instantly check your vehicle loan eligibility.</p>
        </div>

        <div className="vl-elig-layout">
          <form className="vl-elig-form-card" onSubmit={checkEligibility}>
            <h2>Your Details</h2>
            <p>All fields marked * are required</p>
            <div className="vl-form-grid">
              <input name="full_name"      placeholder="Full Name *"              value={form.full_name}      onChange={set}/>
              <input name="phone"          placeholder="Mobile Number *"           value={form.phone}          onChange={set} maxLength={10}/>
              <input name="monthly_income" placeholder="Monthly Income (₹) *"      value={form.monthly_income} onChange={set} type="number"/>
              <input name="city"           placeholder="City *"                   value={form.city}           onChange={set}/>
              <select name="vehicle_type"  value={form.vehicle_type}  onChange={set}>
                {VEHICLE_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
              <select name="vehicle_condition" value={form.vehicle_condition} onChange={set}>
                <option value="New">New Vehicle</option>
                <option value="Used">Used / Pre-Owned</option>
              </select>
              <input name="vehicle_price"  placeholder="Vehicle Price (₹)"        value={form.vehicle_price}  onChange={set} type="number"/>
              <input name="loan_amount"    placeholder="Required Loan Amount (₹) *" value={form.loan_amount}  onChange={set} type="number"/>
            </div>
            <button type="submit" className="vl-btn-primary" style={{marginTop:22,width:"100%",justifyContent:"center"}}>
              Check Eligibility →
            </button>
          </form>

          <div className="vl-elig-result-card">
            {!result && (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:48,marginBottom:16}}>🚗</div>
                <h3 style={{fontWeight:800,color:"#0F1C3F",marginBottom:8}}>Instant Eligibility Check</h3>
                <p style={{color:"#6b7280",fontSize:14,lineHeight:1.65}}>Fill in your details on the left and click "Check Eligibility" to see your estimated loan amount.</p>
                <div style={{marginTop:24,background:"#f8faff",borderRadius:14,padding:18,border:"1px solid #e6edff"}}>
                  <div style={{fontWeight:700,color:"#0F1C3F",marginBottom:10,fontSize:14}}>Eligibility Criteria</div>
                  {[["Minimum Income","₹10,000 / month"],["Age","18 – 65 years"],["CIBIL Score","650+"],["Employment","Salaried / Self-Employed"]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f0f4ff",fontSize:13}}>
                      <span style={{color:"#6b7280"}}>{l}</span><strong style={{color:"#0F1C3F"}}>{v}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result?.eligible && (
              <>
                <div className="vl-elig-result-icon success">✓</div>
                <h2 style={{fontWeight:800,color:"#0F1C3F",marginBottom:6}}>Congratulations!</h2>
                <p style={{color:"#6b7280",fontSize:14,marginBottom:12}}>You are eligible for a Vehicle Loan</p>
                <div className="vl-elig-amount">₹{result.maxLoan.toLocaleString("en-IN")}</div>
                <p style={{fontSize:13,color:"#6b7280",marginBottom:20}}>Estimated maximum eligible amount</p>
                <div style={{background:"#f8faff",borderRadius:12,padding:"12px 14px",border:"1px solid #e6edff",marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}>
                    <span style={{color:"#6b7280"}}>Monthly Income</span>
                    <strong>₹{Number(result.income).toLocaleString("en-IN")}</strong>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                    <span style={{color:"#6b7280"}}>Loan Type</span>
                    <strong>{result.vehicleType}</strong>
                  </div>
                </div>
                <Link to={`/vehicle-loan/${applySlug}/apply${applyQuery}`} className="vl-btn-primary" style={{width:"100%",justifyContent:"center"}}>
                  Apply Now →
                </Link>
              </>
            )}

            {result && !result.eligible && (
              <>
                <div className="vl-elig-result-icon warning">!</div>
                <h2 style={{fontWeight:800,color:"#0F1C3F",marginBottom:8}}>Not Eligible Currently</h2>
                <p style={{color:"#6b7280",fontSize:14,lineHeight:1.65,marginBottom:20}}>
                  Minimum monthly income required is ₹{result.minIncome.toLocaleString("en-IN")} for {result.vehicleType}. 
                  You may apply with a co-applicant or increase your income.
                </p>
                <div style={{background:"#fff8e6",border:"1px solid #fcd34d",borderRadius:12,padding:"12px 16px",marginBottom:20}}>
                  <p style={{fontSize:13,color:"#92400e",fontWeight:600}}>Suggestions to improve eligibility:</p>
                  <ul style={{marginTop:8,paddingLeft:18,fontSize:13,color:"#92400e",lineHeight:1.8}}>
                    <li>Add a co-applicant with higher income</li>
                    <li>Apply for a lower loan amount</li>
                    <li>Choose Two-Wheeler Loan (lower threshold)</li>
                  </ul>
                </div>
                <Link to="/vehicle-loan" className="vl-btn-outline" style={{width:"100%",justifyContent:"center"}}>
                  ← Back to Vehicle Loan
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}