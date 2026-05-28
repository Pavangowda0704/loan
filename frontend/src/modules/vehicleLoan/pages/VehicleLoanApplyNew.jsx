// ============================================================
//  VehicleLoanApplyNew.jsx — 4-step apply form
//  Routes: /vehicle-loan/apply  OR  /vehicle-loan/:type/apply
// ============================================================
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createVehicleLoanApplication } from "../../../api/vehicleLoanApi.js";
import "../vehicleLoan.css";

const VEHICLE_TYPES = [
  "New Car Loan","Used Car Loan","Two-Wheeler Loan","Used Bike Loan",
  "Commercial Vehicle Loan","Agriculture Equipment Loan",
];

const TYPE_MAP = {
  "new-car":"New Car Loan","used-car":"Used Car Loan",
  "two-wheeler":"Two-Wheeler Loan","used-bike":"Used Bike Loan",
  "commercial":"Commercial Vehicle Loan","agriculture-equipment":"Agriculture Equipment Loan",
};

const STEPS = ["Personal Details","Vehicle Info","Loan Details","Review & Submit"];

export default function VehicleLoanApplyNew() {
  const { type }   = useParams();
  const navigate   = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    full_name:"", phone:"", email:"", dob:"", pan_number:"", city:"",
    vehicle_type: TYPE_MAP[type] || "New Car Loan",
    vehicle_condition:"New",
    vehicle_brand:"", vehicle_model:"", vehicle_price:"", down_payment:"",
    loan_amount:"", monthly_income:"", employment_type:"Salaried", tenure:"48",
  });

  const set = e => setForm({...form,[e.target.name]:e.target.value});

  const validate = () => {
    if (step===1){
      if (!form.full_name||!form.phone||!form.email||!form.pan_number||!form.city)
        return alert("Please fill all personal details."),false;
      if (!/^[0-9]{10}$/.test(form.phone)) return alert("Mobile must be 10 digits."),false;
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(form.pan_number)) return alert("Invalid PAN format."),false;
    }
    if (step===2){
      if (!form.vehicle_type||!form.vehicle_price) return alert("Fill vehicle type & price."),false;
    }
    if (step===3){
      if (!form.loan_amount||!form.monthly_income) return alert("Fill loan amount & income."),false;
    }
    return true;
  };

  const next = () => { if (validate()) setStep(s=>s+1); };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await createVehicleLoanApplication({
        ...form,
        pan_number:     form.pan_number.toUpperCase(),
        vehicle_price:  +form.vehicle_price||0,
        down_payment:   +form.down_payment||0,
        loan_amount:    +form.loan_amount,
        monthly_income: +form.monthly_income,
        tenure:         +form.tenure,
      });
      navigate(`/vehicle-loan/success/${res.data.application_id}`, {
        state:{ full_name:form.full_name, vehicle_type:form.vehicle_type }
      });
    } catch(err){
      alert(err.response?.data?.message||"Submission failed. Please try again.");
    } finally { setSubmitting(false); }
  };

  const fmt = v => v ? "₹"+Number(v).toLocaleString("en-IN") : "—";
  const reviewRows=[
    ["Full Name",form.full_name],["Phone",form.phone],["Email",form.email],
    ["Date of Birth",form.dob||"—"],["PAN",form.pan_number.toUpperCase()],["City",form.city],
    ["Vehicle Type",form.vehicle_type],["Condition",form.vehicle_condition],
    ["Brand / Model",`${form.vehicle_brand||"—"} / ${form.vehicle_model||"—"}`],
    ["Vehicle Price",fmt(form.vehicle_price)],["Down Payment",fmt(form.down_payment)],
    ["Loan Amount",fmt(form.loan_amount)],["Monthly Income",fmt(form.monthly_income)],
    ["Employment",form.employment_type],["Tenure",`${form.tenure} months`],
  ];

  return (
    <div className="vl-page">
      <div className="vl-breadcrumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to="/vehicle-loan">Vehicle Loan</Link><span>›</span>
        <span>Apply</span>
      </div>

      <div className="vl-apply-wrapper">
        <div className="vl-apply-header">
          <div className="vl-chip">VEHICLE LOAN APPLICATION</div>
          <h1>Apply for Vehicle Loan</h1>
          <p>Complete in 4 simple steps — takes about 5 minutes</p>
        </div>

        {/* Stepper */}
        <div className="vl-stepper">
          {STEPS.map((s,i)=>(
            <div key={s} className={`vl-step-new${step>i+1?" done":step===i+1?" active":""}`}>
              <div className="vl-step-circle">{step>i+1?"✓":i+1}</div>
              <span>{s}</span>
              {i<STEPS.length-1&&<div className="vl-step-connector"/>}
            </div>
          ))}
        </div>

        <div className="vl-form-card">
          {step===1&&(
            <>
              <h3>Personal Details</h3>
              <div className="vl-form-grid">
                <input name="full_name"  placeholder="Full Name *"       value={form.full_name}  onChange={set}/>
                <input name="phone"      placeholder="Mobile Number *"   value={form.phone}      onChange={set} maxLength={10}/>
                <input name="email"      placeholder="Email Address *"   value={form.email}      onChange={set} type="email"/>
                <input name="dob"        type="date"                     value={form.dob}        onChange={set}/>
                <input name="pan_number" placeholder="PAN Number *"      value={form.pan_number} onChange={set}/>
                <input name="city"       placeholder="City *"            value={form.city}       onChange={set}/>
              </div>
            </>
          )}
          {step===2&&(
            <>
              <h3>Vehicle Information</h3>
              <div className="vl-form-grid">
                <select name="vehicle_type" value={form.vehicle_type} onChange={set}>
                  {VEHICLE_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
                <select name="vehicle_condition" value={form.vehicle_condition} onChange={set}>
                  <option value="New">New Vehicle</option>
                  <option value="Used">Used / Pre-Owned</option>
                </select>
                <input name="vehicle_brand" placeholder="Vehicle Brand (e.g. Maruti)"   value={form.vehicle_brand} onChange={set}/>
                <input name="vehicle_model" placeholder="Vehicle Model (e.g. Swift)"    value={form.vehicle_model} onChange={set}/>
                <input name="vehicle_price" placeholder="Vehicle Price (₹) *" type="number" value={form.vehicle_price} onChange={set}/>
                <input name="down_payment"  placeholder="Down Payment (₹)"    type="number" value={form.down_payment}  onChange={set}/>
              </div>
            </>
          )}
          {step===3&&(
            <>
              <h3>Loan Details</h3>
              <div className="vl-form-grid">
                <input name="loan_amount"    placeholder="Required Loan Amount (₹) *" type="number" value={form.loan_amount}    onChange={set}/>
                <input name="monthly_income" placeholder="Monthly Income (₹) *"       type="number" value={form.monthly_income} onChange={set}/>
                <select name="employment_type" value={form.employment_type} onChange={set}>
                  <option>Salaried</option>
                  <option>Self-Employed</option>
                  <option>Business Owner</option>
                  <option>Farmer</option>
                </select>
                <select name="tenure" value={form.tenure} onChange={set}>
                  {[12,24,36,48,60,72,84].map(t=><option key={t} value={t}>{t} Months</option>)}
                </select>
              </div>
            </>
          )}
          {step===4&&(
            <>
              <h3>Review Your Application</h3>
              <div className="vl-review-box">
                {reviewRows.map(([l,v])=>(
                  <div key={l} className="vl-review-row">
                    <span className="vl-review-label">{l}</span>
                    <span className="vl-review-val">{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="vl-form-actions">
            {step>1&&<button className="vl-btn-outline" onClick={()=>setStep(s=>s-1)}>← Previous</button>}
            {step<4
              ? <button className="vl-btn-primary" onClick={next}>Next Step →</button>
              : <button className="vl-btn-primary" onClick={submit} disabled={submitting}>
                  {submitting?"Submitting…":"Submit Application ✓"}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}