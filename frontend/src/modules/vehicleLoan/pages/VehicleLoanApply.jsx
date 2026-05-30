// ============================================================
//  VehicleLoanApply.jsx — 8-step Vehicle Loan Apply
//  PDF-compliant: mandatory docs + per-vehicle-type docs
// ============================================================
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createVehicleLoanApplication } from "../../../api/vehicleLoanApi.js";
import "../vehicleLoan.css";
import "./VehicleLoanApply.css";

const STEPS = [
  { num:1, label:"Loan Type" },
  { num:2, label:"Personal Details" },
  { num:3, label:"Employment & Income" },
  { num:4, label:"Vehicle Details" },
  { num:5, label:"EMI Preview" },
  { num:6, label:"Upload Documents" },
  { num:7, label:"Review & Submit" },
  { num:8, label:"Success" },
];

const LOAN_TYPES = [
  { id:"new-car",    title:"New Car Loan",             desc:"Lowest interest rates for brand new cars",    img:"🚙" },
  { id:"used-car",   title:"Used Car Loan",             desc:"Best deals on pre-owned cars",                img:"🚗" },
  { id:"two-wheeler",title:"Two Wheeler Loan",          desc:"Easy loans for new bikes and scooters",       img:"🏍️" },
  { id:"used-bike",  title:"Used Bike Loan",            desc:"Pre-owned two-wheelers up to 7 years old",    img:"🛵" },
  { id:"commercial", title:"Commercial Vehicle Loan",   desc:"Financing for your business vehicles",        img:"🚛" },
  { id:"agriculture",title:"Agriculture Equipment Loan",desc:"Tractors, harvesters & agri-machinery",       img:"🚜" },
];

const TYPE_MAP = {
  "new-car":"new-car","used-car":"used-car","two-wheeler":"two-wheeler",
  "used-bike":"used-bike","commercial":"commercial",
  "agriculture-equipment":"agriculture",
};

// ── PDF: Mandatory docs for ALL loans ──
const MANDATORY_DOCS = [
  { key:"pan",    label:"PAN Card",    hint:"JPG, PNG, PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true },
  { key:"aadhaar",label:"Aadhaar Card",hint:"JPG, PNG, PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true },
  { key:"photo",  label:"Passport Size Photo", hint:"JPG, PNG (Max 1MB)", accept:".jpg,.jpeg,.png",  required:true },
];

// ── Income docs split by employment ──
const INCOME_DOCS_SALARIED = [
  { key:"salary", label:"Latest 3 Salary Slips",   hint:"JPG, PNG, PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
  { key:"bank",   label:"6 Months Bank Statement",  hint:"PDF (Max 5MB)",           accept:".jpg,.jpeg,.png,.pdf", required:true  },
  { key:"form16", label:"Form 16 / IT Returns",     hint:"JPG, PNG, PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:false },
];
const INCOME_DOCS_SE = [
  { key:"itr",    label:"IT Returns (2 Years)",     hint:"JPG, PNG, PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
  { key:"bankbiz",label:"Business Bank Statement",  hint:"6 months — PDF (Max 5MB)",accept:".jpg,.jpeg,.png,.pdf", required:true  },
  { key:"gst",    label:"GST Registration",         hint:"JPG, PNG, PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:false },
];

// ── Vehicle-specific docs ──
const VEHICLE_DOCS = {
  "new-car":    [{ key:"quotation", label:"Proforma Invoice / Dealer Quotation", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  }],
  "used-car":   [
    { key:"rc",        label:"RC Copy (Registration Certificate)", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"noc",       label:"Form 35 (NOC from previous financier)", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:false },
    { key:"insurance", label:"Insurance Copy",                     hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"valuation", label:"Valuation Report",                   hint:"From approved evaluator — PDF", accept:".jpg,.jpeg,.png,.pdf", required:true },
  ],
  "two-wheeler":[{ key:"quotation", label:"Proforma Invoice / Dealer Quotation", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true }],
  "used-bike":  [
    { key:"rc",        label:"RC Copy (Registration Certificate)", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"noc",       label:"Form 35 (NOC from previous financier)", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:false },
    { key:"insurance", label:"Insurance Copy",                     hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"valuation", label:"Valuation Report",                   hint:"From approved evaluator — PDF", accept:".jpg,.jpeg,.png,.pdf", required:false },
  ],
  "commercial": [
    { key:"quotation",  label:"Proforma Invoice / Dealer Quotation", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"transport",  label:"Transport Licence",                   hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"bizreg",     label:"Business Registration Certificate",   hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:false },
  ],
  "agriculture":[
    { key:"quotation",  label:"Equipment Quotation / Proforma Invoice", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"land",       label:"Land Documents (7/12 extract)",          hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
  ],
};

const VEHICLE_BRANDS = {
  "new-car":    ["Maruti Suzuki","Hyundai","Tata","Honda","Toyota","Kia","MG","Mahindra","Volkswagen","Skoda","Jeep","Other"],
  "used-car":   ["Maruti Suzuki","Hyundai","Tata","Honda","Toyota","Kia","Mahindra","Other"],
  "two-wheeler":["Honda","Hero","TVS","Bajaj","Royal Enfield","Suzuki","Yamaha","KTM","Other"],
  "used-bike":  ["Honda","Hero","TVS","Bajaj","Royal Enfield","Suzuki","Yamaha","Other"],
  "commercial": ["Tata","Ashok Leyland","Mahindra","Eicher","BharatBenz","Force","Other"],
  "agriculture":["Mahindra","Swaraj","John Deere","Sonalika","New Holland","Escorts","TAFE","Other"],
};
const FUEL_TYPES = ["Petrol","Diesel","CNG","Electric","Hybrid","N/A"];
const STATES     = ["Maharashtra","Karnataka","Delhi","Tamil Nadu","Telangana","Gujarat","Rajasthan","Uttar Pradesh","West Bengal","Kerala","Punjab","Haryana","Other"];
const BANKS      = ["HDFC Bank","ICICI Bank","SBI","Axis Bank","Kotak Mahindra Bank","Bank of Baroda","Punjab National Bank","Other"];

const calcEMI = (p,r,n) => {
  if(!p||!r||!n) return 0;
  const rm=r/12/100;
  return Math.round(p*rm*Math.pow(1+rm,n)/(Math.pow(1+rm,n)-1));
};
const fmt = v => v?"₹"+Number(v).toLocaleString("en-IN"):"—";

export default function VehicleLoanApply(){
  const {type}   = useParams();
  const navigate = useNavigate();

  const [step, setStep]             = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [appId, setAppId]           = useState("");

  const defaultType = LOAN_TYPES.find(lt=>lt.id===TYPE_MAP[type])||null;
  const [loanType, setLoanType] = useState(defaultType);

  const [form, setForm] = useState({
    full_name:"", phone:"", email:"", dob:"", pan_number:"", aadhaar:"",
    city:"", state:"", pincode:"",
    employment_type:"Salaried", company_name:"", monthly_income:"",
    work_experience:"", existing_emi:"", other_obligations:"", bank_name:"",
    vehicle_brand:"", vehicle_model:"", fuel_type:"Petrol",
    ex_showroom_price:"", down_payment:"", loan_amount:"",
    tenure:"60", interest_rate:"9.25",
  });

  const [files, setFiles] = useState({});
  const fileRefs          = useRef({});
  const set = e => setForm(f=>({...f,[e.target.name]:e.target.value}));

  const derivedLoan = form.ex_showroom_price && form.down_payment
    ? Math.max(0,+form.ex_showroom_price - +form.down_payment).toString()
    : form.loan_amount;

  const emi           = calcEMI(+derivedLoan,+form.interest_rate,+form.tenure);
  const totalPayable  = emi * +form.tenure;
  const totalInterest = totalPayable - +derivedLoan;

  // Build full docs list based on vehicle type + employment type
  const incomeDocs = form.employment_type==="Salaried" ? INCOME_DOCS_SALARIED : INCOME_DOCS_SE;
  const vehicleDocs = VEHICLE_DOCS[loanType?.id] || [];
  const allDocs = [...MANDATORY_DOCS, ...incomeDocs, ...vehicleDocs];

  const validate = () => {
    if(step===1 && !loanType) return alert("Please select a vehicle loan type."),false;
    if(step===2){
      if(!form.full_name||!form.phone||!form.email||!form.pan_number||!form.city)
        return alert("Please fill all required fields."),false;
      if(!/^[0-9]{10}$/.test(form.phone)) return alert("Mobile must be 10 digits."),false;
      if(!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(form.pan_number)) return alert("Invalid PAN format."),false;
    }
    if(step===3 && (!form.company_name||!form.monthly_income))
      return alert("Please fill employment details."),false;
    if(step===4 && !form.ex_showroom_price)
      return alert("Please enter vehicle price."),false;
    if(step===6){
      const missing = allDocs.filter(d=>d.required && !files[d.key]).map(d=>d.label);
      if(missing.length>0) return alert("Please upload required documents:\n• "+missing.join("\n• ")),false;
    }
    return true;
  };

  const next = () => { if(validate()) setStep(s=>s+1); };
  const back = () => setStep(s=>s-1);

  const handleFile = (key,e) => {
    const f=e.target.files[0];
    if(f) setFiles(prev=>({...prev,[key]:f}));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      // Step 1 — submit application JSON
      const res = await createVehicleLoanApplication({
        ...form,
        vehicle_type:   loanType.title,
        pan_number:     form.pan_number.toUpperCase(),
        vehicle_price:  +form.ex_showroom_price||0,
        down_payment:   +form.down_payment||0,
        loan_amount:    +derivedLoan,
        monthly_income: +form.monthly_income,
        existing_emi:   +form.existing_emi||0,
        tenure:         +form.tenure,
      });

      const applicationId = res.data.application_id;
      setAppId(applicationId);

      // Step 2 — upload documents as multipart/form-data
      if (Object.keys(files).length > 0) {
        const formData = new FormData();
        Object.entries(files).forEach(([key, file]) => {
          formData.append(key, file);
        });
        // ✅ FIXED: Use VITE_API_BASE_URL (strip /api suffix to get base server URL)
        const serverBase = (import.meta.env.VITE_API_BASE_URL || 'https://loan-l0df.onrender.com/api')
          .replace(/\/api$/, '')
        const uploadRes = await fetch(
  `${serverBase}/api/vehicle-loans/${applicationId}/documents`,
  {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    }
  }
);
if (!uploadRes.ok) {
  console.warn('Document upload failed but continuing...');
}
      }

      setStep(8);
    } catch(err){
      alert(err.response?.data?.message||"Submission failed. Please try again.");
    } finally { setSubmitting(false); }
  };

  const brands = VEHICLE_BRANDS[loanType?.id]||VEHICLE_BRANDS["new-car"];

  return(
    <div className="vla-page">

      {/* Hero */}
      <div className="vla-hero">
        <h1>Vehicle Loan <span>Application Process</span></h1>
        <p>Simple, Quick &amp; 100% Digital Process</p>
      </div>

      {/* Stepper */}
      <div className="vla-stepper-wrap">
        <div className="vla-stepper">
          {STEPS.map((s,i)=>{
            const done=step>s.num, active=step===s.num;
            return(
              <div key={s.num} className={`vla-step ${done?"done":active?"active":""}`}>
                <div className="vla-step-bubble">{done?"✓":s.num}</div>
                <span className="vla-step-label">{s.label}</span>
                {i<STEPS.length-1 && <div className="vla-step-line"/>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="vla-content">

        {/* STEP 1 — Loan Type */}
        {step===1 && (
          <div className="vla-card">
            <div className="vla-card-head">
              <span className="vla-step-badge">1</span>
              <div><h2>Select Vehicle Loan Type</h2><p>Choose the loan type that suits your need</p></div>
            </div>
            <div className="vla-loan-type-grid">
              {LOAN_TYPES.map(lt=>(
                <div key={lt.id}
                  className={`vla-lt-card ${loanType?.id===lt.id?"selected":""}`}
                  onClick={()=>setLoanType(lt)}>
                  <div className="vla-lt-img">{lt.img}</div>
                  <div className="vla-lt-body">
                    <strong>{lt.title}</strong>
                    <span>{lt.desc}</span>
                  </div>
                  <div className={`vla-lt-radio ${loanType?.id===lt.id?"checked":""}`}>
                    {loanType?.id===lt.id && <div className="vla-lt-dot"/>}
                  </div>
                </div>
              ))}
            </div>
            <div className="vla-actions">
              <button className="vla-btn-primary" onClick={next}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — Personal Details */}
        {step===2 && (
          <div className="vla-card">
            <div className="vla-card-head">
              <span className="vla-step-badge">2</span>
              <div><h2>Personal Details</h2><p>Tell us about yourself</p></div>
            </div>
            <div className="vla-form-grid">
              {[
                {name:"full_name", label:"Full Name *",      ph:"Rahul Sharma"},
                {name:"phone",     label:"Mobile Number *",  ph:"98765 43210", max:10},
                {name:"email",     label:"Email Address *",  ph:"rahul@email.com", type:"email"},
                {name:"dob",       label:"Date of Birth",    type:"date"},
                {name:"pan_number",label:"PAN Number *",     ph:"ABCDE1234F", upper:true},
                {name:"aadhaar",   label:"Aadhaar Number",   ph:"1234 5678 9012", max:14},
              ].map(f=>(
                <div key={f.name} className="vla-field">
                  <label>{f.label}</label>
                  <input name={f.name} type={f.type||"text"} placeholder={f.ph}
                    value={form[f.name]} onChange={set} maxLength={f.max}
                    style={f.upper?{textTransform:"uppercase"}:{}}/>
                </div>
              ))}
              <div className="vla-field"><label>City *</label>
                <input name="city" placeholder="Mumbai" value={form.city} onChange={set}/>
              </div>
              <div className="vla-field"><label>State</label>
                <select name="state" value={form.state} onChange={set}>
                  <option value="">Select State</option>
                  {STATES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="vla-field"><label>Pincode</label>
                <input name="pincode" placeholder="400001" value={form.pincode} onChange={set} maxLength={6}/>
              </div>
            </div>
            <div className="vla-actions">
              <button className="vla-btn-outline" onClick={back}>← Back</button>
              <button className="vla-btn-primary" onClick={next}>Save &amp; Continue</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Employment & Income */}
        {step===3 && (
          <div className="vla-card">
            <div className="vla-card-head">
              <span className="vla-step-badge">3</span>
              <div><h2>Employment &amp; Income</h2><p>Tell us about your employment and income</p></div>
            </div>
            <div className="vla-form-grid">
              <div className="vla-field"><label>Employment Type</label>
                <select name="employment_type" value={form.employment_type} onChange={set}>
                  <option>Salaried</option><option>Self-Employed</option>
                  <option>Business Owner</option><option>Farmer</option><option>Freelancer</option>
                </select>
              </div>
              <div className="vla-field"><label>Company / Business Name *</label>
                <input name="company_name" placeholder="TCS Private Limited" value={form.company_name} onChange={set}/>
              </div>
              <div className="vla-field"><label>Monthly Income (₹) *</label>
                <input name="monthly_income" type="number" placeholder="75,000" value={form.monthly_income} onChange={set}/>
              </div>
              <div className="vla-field"><label>Work Experience</label>
                <select name="work_experience" value={form.work_experience} onChange={set}>
                  <option value="">Select</option>
                  {["Less than 1 Year","1 Year","2 Years","3 Years","4 Years","5 Years","6-10 Years","10+ Years"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="vla-field"><label>Existing EMI (₹)</label>
                <input name="existing_emi" type="number" placeholder="10,000" value={form.existing_emi} onChange={set}/>
              </div>
              <div className="vla-field"><label>Other Monthly Obligations (₹)</label>
                <input name="other_obligations" type="number" placeholder="5,000" value={form.other_obligations} onChange={set}/>
              </div>
              <div className="vla-field"><label>Bank Name</label>
                <select name="bank_name" value={form.bank_name} onChange={set}>
                  <option value="">Select Bank</option>
                  {BANKS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="vla-actions">
              <button className="vla-btn-outline" onClick={back}>← Back</button>
              <button className="vla-btn-primary" onClick={next}>Save &amp; Continue</button>
            </div>
          </div>
        )}

        {/* STEP 4 — Vehicle Details */}
        {step===4 && (
          <div className="vla-card">
            <div className="vla-card-head">
              <span className="vla-step-badge">4</span>
              <div><h2>Vehicle Details</h2><p>Enter details about the vehicle you want to finance</p></div>
            </div>
            <div className="vla-form-grid">
              <div className="vla-field"><label>Vehicle Type</label>
                <input value={loanType?.title||""} readOnly style={{background:"#f8fafc",color:"#64748b"}}/>
              </div>
              <div className="vla-field"><label>Vehicle Brand</label>
                <select name="vehicle_brand" value={form.vehicle_brand} onChange={set}>
                  <option value="">Select Brand</option>
                  {brands.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="vla-field"><label>Vehicle Model</label>
                <input name="vehicle_model" placeholder="e.g. Creta SX" value={form.vehicle_model} onChange={set}/>
              </div>
              <div className="vla-field"><label>Fuel Type</label>
                <select name="fuel_type" value={form.fuel_type} onChange={set}>
                  {FUEL_TYPES.map(f=><option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="vla-field"><label>Ex-Showroom / Assessed Price (₹) *</label>
                <input name="ex_showroom_price" type="number" placeholder="12,00,000" value={form.ex_showroom_price} onChange={set}/>
              </div>
              <div className="vla-field"><label>Down Payment (₹)</label>
                <input name="down_payment" type="number" placeholder="2,00,000" value={form.down_payment} onChange={set}/>
              </div>
              <div className="vla-field vla-field--full">
                <label>Required Loan Amount (₹) — Auto-calculated</label>
                <input name="loan_amount" type="number" value={derivedLoan} onChange={set}
                  style={{background:"#f0fdf4",fontWeight:700,color:"#166534"}}/>
              </div>
            </div>
            <div className="vla-actions">
              <button className="vla-btn-outline" onClick={back}>← Back</button>
              <button className="vla-btn-primary" onClick={next}>Save &amp; Continue</button>
            </div>
          </div>
        )}

        {/* STEP 5 — EMI Preview */}
        {step===5 && (
          <div className="vla-card vla-card--emi">
            <div className="vla-emi-layout">
              <div className="vla-emi-summary">
                <div className="vla-card-head">
                  <span className="vla-step-badge">5</span>
                  <div><h2>EMI Preview</h2><p>Review your loan and EMI details</p></div>
                </div>
                {[
                  ["Loan Amount",fmt(derivedLoan)],
                  ["Interest Rate (p.a.)",`${form.interest_rate}%`],
                  ["Tenure",`${form.tenure} Months`],
                  ["Monthly EMI",`₹ ${emi.toLocaleString("en-IN")}`],
                  ["Total Payable",`₹ ${totalPayable.toLocaleString("en-IN")}`],
                  ["Total Interest",`₹ ${totalInterest.toLocaleString("en-IN")}`],
                ].map(([l,v])=>(
                  <div key={l} className="vla-emi-row">
                    <span>{l}</span>
                    <strong style={l.includes("EMI")?{color:"#00B050",fontSize:"18px"}:{}}>{v}</strong>
                  </div>
                ))}
              </div>
              <div className="vla-emi-calc">
                <div className="vla-calc-title">EMI Calculator</div>
                <div className="vla-calc-field">
                  <label>Loan Amount</label>
                  <div className="vla-calc-val">{fmt(derivedLoan)}</div>
                  <input name="loan_amount" type="range" min={50000} max={3000000} step={10000}
                    value={derivedLoan} onChange={set} className="vla-range"/>
                  <div className="vla-range-labels"><span>₹50,000</span><span>₹30,00,000</span></div>
                </div>
                <div className="vla-calc-field">
                  <label>Interest Rate (p.a.): <strong>{form.interest_rate}%</strong></label>
                  <input name="interest_rate" type="range" min={8} max={24} step={0.01}
                    value={form.interest_rate} onChange={set} className="vla-range"/>
                  <div className="vla-range-labels"><span>8%</span><span>24%</span></div>
                </div>
                <div className="vla-calc-field">
                  <label>Tenure</label>
                  <select name="tenure" value={form.tenure} onChange={set}>
                    {[12,24,36,48,60,72,84].map(t=>(
                      <option key={t} value={t}>{t} Months ({Math.round(t/12*10)/10} {t<=12?"Year":"Years"})</option>
                    ))}
                  </select>
                </div>
                <div className="vla-calc-emi">
                  <span>Monthly EMI</span>
                  <strong>₹ {emi.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>
            <div className="vla-actions">
              <button className="vla-btn-outline" onClick={back}>← Back</button>
              <button className="vla-btn-primary" onClick={next}>Save &amp; Continue</button>
            </div>
          </div>
        )}

        {/* STEP 6 — Upload Documents */}
        {step===6 && (
          <div className="vla-card">
            <div className="vla-card-head">
              <span className="vla-step-badge">6</span>
              <div>
                <h2>Upload Documents</h2>
                <p>Documents for <strong>{loanType?.title}</strong> — {form.employment_type} applicant</p>
              </div>
            </div>

            <div className="vla-doc-section-label">📋 KYC Documents</div>
            <div className="vla-doc-grid">
              {MANDATORY_DOCS.filter(d=>d.key!=="photo").map(doc=>(
                <VlaDocCard key={doc.key} doc={doc} file={files[doc.key]}
                  onUpload={()=>fileRefs.current[doc.key]?.click()}
                  inputRef={el=>fileRefs.current[doc.key]=el}
                  onChange={e=>handleFile(doc.key,e)}/>
              ))}
            </div>

            <div className="vla-doc-section-label">💰 Income Proof</div>
            <div className="vla-doc-grid">
              {incomeDocs.map(doc=>(
                <VlaDocCard key={doc.key} doc={doc} file={files[doc.key]}
                  onUpload={()=>fileRefs.current[doc.key]?.click()}
                  inputRef={el=>fileRefs.current[doc.key]=el}
                  onChange={e=>handleFile(doc.key,e)}/>
              ))}
            </div>

            <div className="vla-doc-section-label">🚗 Vehicle Documents</div>
            <div className="vla-doc-grid">
              {vehicleDocs.map(doc=>(
                <VlaDocCard key={doc.key} doc={doc} file={files[doc.key]}
                  onUpload={()=>fileRefs.current[doc.key]?.click()}
                  inputRef={el=>fileRefs.current[doc.key]=el}
                  onChange={e=>handleFile(doc.key,e)}/>
              ))}
            </div>

            <div className="vla-doc-section-label">📸 Photograph</div>
            <div className="vla-doc-grid vla-doc-grid--small">
              {MANDATORY_DOCS.filter(d=>d.key==="photo").map(doc=>(
                <VlaDocCard key={doc.key} doc={doc} file={files[doc.key]}
                  onUpload={()=>fileRefs.current[doc.key]?.click()}
                  inputRef={el=>fileRefs.current[doc.key]=el}
                  onChange={e=>handleFile(doc.key,e)}/>
              ))}
            </div>

            <div className="vla-doc-note">
              <span>ℹ️</span>
              <span>Documents marked <strong>*</strong> are mandatory. Our team may collect remaining documents in person (Step 6 of the process).</span>
            </div>

            <div className="vla-actions">
              <button className="vla-btn-outline" onClick={back}>← Back</button>
              <button className="vla-btn-primary" onClick={next}>Save &amp; Continue</button>
            </div>
          </div>
        )}

        {/* STEP 7 — Review & Submit */}
        {step===7 && (
          <div className="vla-card">
            <div className="vla-card-head">
              <span className="vla-step-badge">7</span>
              <div><h2>Review &amp; Submit</h2><p>Please review your details before submission</p></div>
            </div>
            <div className="vla-review-grid">
              <div className="vla-review-section">
                <div className="vla-rs-head">Personal Details<button className="vla-edit-btn" onClick={()=>setStep(2)}>Edit</button></div>
                <div className="vla-rs-row">{form.full_name}, {form.phone}, {form.email}</div>
                <div className="vla-rs-row">{[form.city,form.state,form.pincode].filter(Boolean).join(", ")}</div>
              </div>
              <div className="vla-review-section">
                <div className="vla-rs-head">Employment &amp; Income<button className="vla-edit-btn" onClick={()=>setStep(3)}>Edit</button></div>
                <div className="vla-rs-row">{form.employment_type}, {form.company_name}</div>
                <div className="vla-rs-row">{fmt(form.monthly_income)} Monthly</div>
              </div>
              <div className="vla-review-section">
                <div className="vla-rs-head">Vehicle Details<button className="vla-edit-btn" onClick={()=>setStep(4)}>Edit</button></div>
                <div className="vla-rs-row">{loanType?.title}</div>
                <div className="vla-rs-row">{form.vehicle_brand} {form.vehicle_model}, {form.fuel_type}</div>
                <div className="vla-rs-row">Price: {fmt(form.ex_showroom_price)}</div>
              </div>
              <div className="vla-review-section">
                <div className="vla-rs-head">Loan &amp; EMI Details<button className="vla-edit-btn" onClick={()=>setStep(5)}>Edit</button></div>
                {[["Loan",fmt(derivedLoan)],["EMI",`₹ ${emi.toLocaleString("en-IN")}/month`],["Tenure",`${form.tenure} Months`]].map(([l,v])=>(
                  <div key={l} className="vla-rs-kv"><span>{l}</span><strong>{v}</strong></div>
                ))}
              </div>
            </div>
            <div className="vla-review-section" style={{marginBottom:16}}>
              <div className="vla-rs-head">Uploaded Documents<button className="vla-edit-btn" onClick={()=>setStep(6)}>Edit</button></div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>
                {allDocs.map(d=>(
                  <span key={d.key} style={{
                    padding:"4px 10px",borderRadius:6,fontSize:12,fontWeight:600,
                    background:files[d.key]?"#dcfce7":"#f1f5f9",
                    color:files[d.key]?"#166534":"#94a3b8"
                  }}>{files[d.key]?"✅":"⬜"} {d.label}</span>
                ))}
              </div>
              <div style={{fontSize:12,color:"#64748b",marginTop:8}}>
                {Object.keys(files).length} of {allDocs.length} Documents Uploaded
              </div>
            </div>
            <div className="vla-declaration">
              <label>
                <input type="checkbox" defaultChecked/>
                <span>I hereby declare that the above information is true and correct to the best of my knowledge. I authorize Plumzo Capital Services and its partners to verify my details and fetch credit report.</span>
              </label>
            </div>
            <div className="vla-actions">
              <button className="vla-btn-outline" onClick={back}>← Back</button>
              <button className="vla-btn-submit" onClick={submit} disabled={submitting}>
                {submitting?"Submitting…":"🔒 Submit Application"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 8 — Success */}
        {step===8 && (
          <div className="vla-card vla-success-card">
            <div className="vla-success-confetti">
              {[0,1,2,3,4,5].map(i=><span key={i} className={`vla-cd vla-cd--${i}`}>✦</span>)}
            </div>
            <div className="vla-success-check">✓</div>
            <h2>Application Submitted Successfully!</h2>
            <p>Thank you! Your vehicle loan application has been submitted successfully.</p>
            <div className="vla-success-id">
              <div>Application ID</div>
              <strong>{appId||"VL20240516890"}</strong>
            </div>
            <div className="vla-success-status">
              <span className="vla-status-dot"/> Status: <strong>Under Review</strong>
            </div>
            <p style={{fontSize:13,color:"#94a3b8",margin:"8px 0 20px"}}>
              We will review your application and get back to you shortly.
            </p>
            <div className="vla-success-notice">
              <span>📞</span>
              <div>
                <strong>Next Step — Manual Document Collection (Step 6)</strong>
                <p>Our relationship manager will contact you within 24 hours to collect any remaining documents and complete verification.</p>
              </div>
            </div>
            <div className="vla-actions" style={{justifyContent:"center",marginTop:24}}>
              <button className="vla-btn-primary" onClick={()=>navigate("/")}>Go to Home</button>
            </div>
          </div>
        )}

      </div>

      {/* Trust bar */}
      <div className="vla-trust-bar">
        {[
          {icon:"⚡",t:"Quick Approval",d:"Get approval in 24-48 hours"},
          {icon:"📉",t:"Competitive Rates",d:"Lowest interest rates in the market"},
          {icon:"📋",t:"Minimal Documentation",d:"Simple process with minimal paperwork"},
          {icon:"📅",t:"Flexible Tenure",d:"Choose tenure up to 7 years"},
          {icon:"🛡️",t:"100% Secure",d:"Bank-level security of your data"},
        ].map(item=>(
          <div key={item.t} className="vla-trust-item">
            <span>{item.icon}</span>
            <div><strong>{item.t}</strong><span>{item.d}</span></div>
          </div>
        ))}
        <div className="vla-secure-badge">
          <span>🛡️</span>
          <div>
            <strong>Your data is 100% secure with Plumzo</strong>
            <span>We use bank-level security to protect your information</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable doc card ──
function VlaDocCard({doc,file,onUpload,inputRef,onChange}){
  return(
    <div className={`vla-doc-card ${file?"uploaded":""}`}>
      <div className="vla-doc-icon">{file?"✅":"📄"}</div>
      <div className="vla-doc-label">{doc.label}{doc.required?" *":""}</div>
      <div className="vla-doc-hint">{doc.hint}</div>
      {file && <div className="vla-doc-done">✓ {file.name}</div>}
      <input type="file" accept={doc.accept} ref={inputRef} style={{display:"none"}} onChange={onChange}/>
      <button className="vla-doc-btn" onClick={onUpload}>{file?"Change":"Upload ↑"}</button>
    </div>
  );
}
