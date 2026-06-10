// ============================================================
//  VehicleLoanApply.jsx — 8-step Vehicle Loan Apply
//  IMPROVED: inline validation, auto-format, donut chart,
//  scroll-to-top, mobile stepper, declaration checkbox fix,
//  loading skeleton, keyboard nav — zero flow changes
// ============================================================
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createVehicleLoanApplication } from "../../../api/vehicleLoanApi.js";
import API from "../../../api/axiosInstance.js";
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

const MANDATORY_DOCS = [
  { key:"pan",    label:"PAN Card",           hint:"JPG, PNG, PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true },
  { key:"aadhaar",label:"Aadhaar Card",        hint:"JPG, PNG, PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true },
  { key:"photo",  label:"Passport Size Photo", hint:"JPG, PNG (Max 1MB)",      accept:".jpg,.jpeg,.png",      required:true },
];

const INCOME_DOCS_SALARIED = [
  { key:"salary", label:"Latest 3 Salary Slips",  hint:"JPG, PNG, PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
  { key:"bank",   label:"6 Months Bank Statement", hint:"PDF (Max 5MB)",           accept:".jpg,.jpeg,.png,.pdf", required:true  },
  { key:"form16", label:"Form 16 / IT Returns",    hint:"JPG, PNG, PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:false },
];
const INCOME_DOCS_SE = [
  { key:"itr",    label:"IT Returns (2 Years)",    hint:"JPG, PNG, PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
  { key:"bankbiz",label:"Business Bank Statement", hint:"6 months — PDF (Max 5MB)",accept:".jpg,.jpeg,.png,.pdf", required:true  },
  { key:"gst",    label:"GST Registration",        hint:"JPG, PNG, PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:false },
];

const VEHICLE_DOCS = {
  "new-car":    [{ key:"quotation", label:"Proforma Invoice / Dealer Quotation", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true }],
  "used-car":   [
    { key:"rc",        label:"RC Copy (Registration Certificate)",    hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"noc",       label:"Form 35 (NOC from previous financier)", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:false },
    { key:"insurance", label:"Insurance Copy",                        hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"valuation", label:"Valuation Report",                      hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
  ],
  "two-wheeler":[{ key:"quotation", label:"Proforma Invoice / Dealer Quotation", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true }],
  "used-bike":  [
    { key:"rc",        label:"RC Copy (Registration Certificate)",    hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"noc",       label:"Form 35 (NOC from previous financier)", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:false },
    { key:"insurance", label:"Insurance Copy",                        hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"valuation", label:"Valuation Report",                      hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:false },
  ],
  "commercial": [
    { key:"quotation", label:"Proforma Invoice / Dealer Quotation",   hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"transport", label:"Transport Licence",                      hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true  },
    { key:"bizreg",    label:"Business Registration Certificate",      hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:false },
  ],
  "agriculture":[
    { key:"quotation", label:"Equipment Quotation / Proforma Invoice", hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true },
    { key:"land",      label:"Land Documents (7/12 extract)",          hint:"PDF (Max 2MB)", accept:".jpg,.jpeg,.png,.pdf", required:true },
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

// ── Inline field error messages (no alert popups on blur) ──
const VALIDATORS = {
  full_name: v => v.trim().length < 2 ? "Please enter your full name" : "",
  phone:     v => !/^[0-9]{10}$/.test(v) ? "Must be a 10-digit mobile number" : "",
  email:     v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Please enter a valid email" : "",
  pan_number:v => !/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(v) ? "Format: ABCDE1234F" : "",
  city:      v => v.trim().length < 2 ? "Please enter your city" : "",
  company_name: v => v.trim().length < 2 ? "Please enter company/business name" : "",
  monthly_income: v => (!v || +v <= 0) ? "Please enter monthly income" : "",
  ex_showroom_price: v => (!v || +v <= 0) ? "Please enter vehicle price" : "",
};

// Auto-format Aadhaar as groups of 4
const formatAadhaar = raw => {
  const digits = raw.replace(/\D/g,"").slice(0,12);
  return digits.replace(/(\d{4})(?=\d)/g,"$1 ");
};

export default function VehicleLoanApply(){
  const {type}   = useParams();
  const navigate = useNavigate();

  const [step, setStep]             = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [declared, setDeclared]     = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched]         = useState({});
  const [toast, setToast]             = useState("");   // inline error toast
  const contentRef = useRef(null);

  const defaultType = LOAN_TYPES.find(lt=>lt.id===TYPE_MAP[type])||null;
  const [loanType, setLoanType] = useState(defaultType);

  const [form, setForm] = useState(()=>{
    // Restore draft from sessionStorage (cleared on success)
    try {
      const saved = sessionStorage.getItem("vla_draft");
      if(saved) return { ...JSON.parse(saved) };
    } catch(_){}
    return {
      full_name:"", phone:"", email:"", dob:"", pan_number:"", aadhaar:"",
      city:"", state:"", pincode:"",
      employment_type:"Salaried", company_name:"", monthly_income:"",
      work_experience:"", existing_emi:"", other_obligations:"", bank_name:"",
      vehicle_brand:"", vehicle_model:"", fuel_type:"Petrol",
      ex_showroom_price:"", down_payment:"", loan_amount:"",
      tenure:"60", interest_rate:"9.25",
    };
  });

  const [files, setFiles] = useState({});
  const fileRefs          = useRef({});

  // Scroll to top of card on step change
  useEffect(()=>{
    contentRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
  },[step]);

  // Auto-save draft on form change (steps 2-6 only)
  useEffect(()=>{
    if(step >= 2 && step <= 6){
      try { sessionStorage.setItem("vla_draft", JSON.stringify(form)); } catch(_){}
    }
  },[form, step]);

  // Wake up Render backend on page load
  useEffect(()=>{
    API.get('/health').catch(()=>{});
  },[]);

  const set = useCallback(e => {
    const { name, value } = e.target;
    let val = value;

    // Auto-format special fields
    if(name === "pan_number") val = value.toUpperCase().slice(0,10);
    if(name === "aadhaar")    val = formatAadhaar(value);
    if(name === "pincode")    val = value.replace(/\D/g,"").slice(0,6);
    if(name === "phone")      val = value.replace(/\D/g,"").slice(0,10);

    setForm(f=>({...f,[name]:val}));

    // Clear error on change if field was touched
    if(touched[name] && VALIDATORS[name]){
      setFieldErrors(prev=>({...prev,[name]:VALIDATORS[name](val)}));
    }
  }, [touched]);

  const handleBlur = useCallback(e => {
    const { name, value } = e.target;
    setTouched(prev=>({...prev,[name]:true}));
    if(VALIDATORS[name]){
      setFieldErrors(prev=>({...prev,[name]:VALIDATORS[name](value)}));
    }
  },[]);

  const derivedLoan = form.ex_showroom_price && form.down_payment
    ? Math.max(0,+form.ex_showroom_price - +form.down_payment).toString()
    : form.loan_amount;

  const emi           = calcEMI(+derivedLoan,+form.interest_rate,+form.tenure);
  const totalPayable  = emi * +form.tenure;
  const totalInterest = totalPayable - +derivedLoan;

  const incomeDocs  = form.employment_type==="Salaried" ? INCOME_DOCS_SALARIED : INCOME_DOCS_SE;
  const vehicleDocs = VEHICLE_DOCS[loanType?.id] || [];
  const allDocs     = [...MANDATORY_DOCS, ...incomeDocs, ...vehicleDocs];

  // Validate and mark fields touched on "next"
  const validate = () => {
    if(step===1 && !loanType){ setToast("Please select a vehicle loan type to continue."); return false; }
    if(step===2){
      const fields = ["full_name","phone","email","pan_number","city"];
      const newErrors = {};
      let hasError = false;
      fields.forEach(name=>{
        const err = VALIDATORS[name]?.(form[name])||"";
        newErrors[name] = err;
        if(err) hasError = true;
      });
      setFieldErrors(prev=>({...prev,...newErrors}));
      setTouched(prev=>{ const t={...prev}; fields.forEach(f=>t[f]=true); return t; });
      if(hasError){ setToast("Please fix the errors highlighted below."); return false; }
    }
    if(step===3 && (!form.company_name||!form.monthly_income)){
      setToast("Please fill in your company name and monthly income.");
      return false;
    }
    if(step===4 && !form.ex_showroom_price){
      setToast("Please enter the vehicle price to continue.");
      return false;
    }
    if(step===6){
      const missing = allDocs.filter(d=>d.required && !files[d.key]).map(d=>d.label);
      if(missing.length>0){
        setToast(`Missing required documents: ${missing.slice(0,2).join(", ")}${missing.length>2?` +${missing.length-2} more`:""}`);
        return false;
      }
    }
    setToast("");
    return true;
  };

  const next = () => { if(validate()) setStep(s=>s+1); };
  const back = () => setStep(s=>s-1);

  const handleFile = (key,e) => {
    const f=e.target.files[0];
    if(f) setFiles(prev=>({...prev,[key]:f}));
  };

  const submit = async () => {
    if(!declared){ setToast("Please accept the declaration to proceed."); return; }
    setSubmitting(true);
    try {
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
      

      if (Object.keys(files).length > 0) {
        const formData = new FormData();
        Object.entries(files).forEach(([key, file]) => {
          formData.append(key, file);
        });
        try {
          await API.post(
            `/vehicle-loans/${applicationId}/documents`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
        } catch (uploadErr) {
          console.warn('Document upload error:', uploadErr.message);
        }
      }

      // Clear draft on success
      try { sessionStorage.removeItem("vla_draft"); } catch(_){}
      // Navigate to dedicated success page with full state
      navigate(`/vehicle-loan/success/${applicationId}`, {
        state: {
          full_name:    form.full_name,
          vehicle_type: loanType?.title || "Vehicle Loan",
          loan_amount:  derivedLoan,
          tenure:       form.tenure,
          emi:          calcEMI(+derivedLoan, +form.interest_rate, +form.tenure),
        }
      });
    } catch(err){
      // Replace alert with inline toast — set on a toast state
      setToast(err.response?.data?.message || "Submission failed. Please try again.");
    } finally { setSubmitting(false); }
  };

  const brands = VEHICLE_BRANDS[loanType?.id]||VEHICLE_BRANDS["new-car"];

  // Donut chart data for EMI step
  const principalPct = totalPayable > 0 ? (+derivedLoan / totalPayable) : 0;
  const CIRC = 2 * Math.PI * 38; // circumference for r=38

  // Helper: field with inline error
  const Field = ({ name, label, children, full }) => (
    <div className={`vla-field${full?" vla-field--full":""}`}>
      <label htmlFor={`vla-${name}`}>{label}</label>
      {children}
      {touched[name] && fieldErrors[name] && (
        <span className="vla-field-error" role="alert">⚠ {fieldErrors[name]}</span>
      )}
    </div>
  );

  return(
    <div className="vla-page">
      <div className="vla-hero">
        <h1>Vehicle Loan <span>Application Process</span></h1>
        <p>Simple, Quick &amp; 100% Digital Process</p>
      </div>

      {/* ── Stepper ── */}
      <div className="vla-stepper-wrap">
        <div className="vla-stepper">
          {STEPS.map((s,i)=>{
            const done=step>s.num, active=step===s.num;
            return(
              <div key={s.num} className={`vla-step ${done?"done":active?"active":""}`}
                aria-current={active?"step":undefined}>
                <div className="vla-step-bubble" aria-label={`Step ${s.num}: ${s.label}`}>
                  {done?"✓":s.num}
                </div>
                <span className="vla-step-label">{s.label}</span>
                {i<STEPS.length-1 && <div className="vla-step-line"/>}
              </div>
            );
          })}
        </div>
        {/* Mobile progress bar */}
        <div className="vla-progress-bar" aria-hidden="true">
          <div className="vla-progress-fill" style={{width:`${((step-1)/(STEPS.length-1))*100}%`}}/>
        </div>
        <div className="vla-step-mobile-label">Step {step} of {STEPS.length}: {STEPS[step-1]?.label}</div>
      </div>

      <div className="vla-content" ref={contentRef}>

        {/* ── Step 1: Loan Type ── */}
        {step===1 && (
          <div className="vla-card vla-card--anim">
            <div className="vla-card-head">
              <span className="vla-step-badge">1</span>
              <div><h2>Select Vehicle Loan Type</h2><p>Choose the loan type that suits your need</p></div>
            </div>
            <div className="vla-loan-type-grid">
              {LOAN_TYPES.map(lt=>(
                <div key={lt.id}
                  className={`vla-lt-card ${loanType?.id===lt.id?"selected":""}`}
                  onClick={()=>setLoanType(lt)}
                  role="radio" aria-checked={loanType?.id===lt.id}
                  tabIndex={0}
                  onKeyDown={e=>(e.key===" "||e.key==="Enter")&&setLoanType(lt)}>
                  <div className="vla-lt-img">{lt.img}</div>
                  <div className="vla-lt-body"><strong>{lt.title}</strong><span>{lt.desc}</span></div>
                  <div className={`vla-lt-radio ${loanType?.id===lt.id?"checked":""}`}>
                    {loanType?.id===lt.id && <div className="vla-lt-dot"/>}
                  </div>
                </div>
              ))}
            </div>
            <div className="vla-actions">
              <button className="vla-btn-primary" onClick={next} disabled={!loanType}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Personal Details ── */}
        {step===2 && (
          <div className="vla-card vla-card--anim">
            <div className="vla-card-head">
              <span className="vla-step-badge">2</span>
              <div><h2>Personal Details</h2><p>Tell us about yourself</p></div>
            </div>
            <div className="vla-form-grid">
              <Field name="full_name" label="Full Name *">
                <input id="vla-full_name" name="full_name" placeholder="Rahul Sharma"
                  value={form.full_name} onChange={set} onBlur={handleBlur}
                  className={touched.full_name&&fieldErrors.full_name?"vla-input-error":""}/>
              </Field>
              <Field name="phone" label="Mobile Number *">
                <input id="vla-phone" name="phone" placeholder="98765 43210"
                  value={form.phone} onChange={set} onBlur={handleBlur} inputMode="numeric"
                  className={touched.phone&&fieldErrors.phone?"vla-input-error":""}/>
              </Field>
              <Field name="email" label="Email Address *">
                <input id="vla-email" name="email" type="email" placeholder="rahul@email.com"
                  value={form.email} onChange={set} onBlur={handleBlur}
                  className={touched.email&&fieldErrors.email?"vla-input-error":""}/>
              </Field>
              <div className="vla-field">
                <label htmlFor="vla-dob">Date of Birth</label>
                <input id="vla-dob" name="dob" type="date" value={form.dob} onChange={set}/>
              </div>
              <Field name="pan_number" label="PAN Number *">
                <input id="vla-pan_number" name="pan_number" placeholder="ABCDE1234F"
                  value={form.pan_number} onChange={set} onBlur={handleBlur}
                  maxLength={10} style={{textTransform:"uppercase"}}
                  className={touched.pan_number&&fieldErrors.pan_number?"vla-input-error":""}/>
              </Field>
              <div className="vla-field">
                <label htmlFor="vla-aadhaar">Aadhaar Number</label>
                <input id="vla-aadhaar" name="aadhaar" placeholder="1234 5678 9012"
                  value={form.aadhaar} onChange={set} inputMode="numeric"/>
                <span className="vla-field-hint">Auto-formatted as you type</span>
              </div>
              <Field name="city" label="City *">
                <input id="vla-city" name="city" placeholder="Mumbai"
                  value={form.city} onChange={set} onBlur={handleBlur}
                  className={touched.city&&fieldErrors.city?"vla-input-error":""}/>
              </Field>
              <div className="vla-field">
                <label htmlFor="vla-state">State</label>
                <select id="vla-state" name="state" value={form.state} onChange={set}>
                  <option value="">Select State</option>
                  {STATES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="vla-field">
                <label htmlFor="vla-pincode">Pincode</label>
                <input id="vla-pincode" name="pincode" placeholder="400001"
                  value={form.pincode} onChange={set} inputMode="numeric"/>
              </div>
            </div>
            <div className="vla-actions">
              <button className="vla-btn-outline" onClick={back}>← Back</button>
              <button className="vla-btn-primary" onClick={next}>Save &amp; Continue</button>
            </div>
          </div>
        )}

        {/* ── Step 3: Employment & Income ── */}
        {step===3 && (
          <div className="vla-card vla-card--anim">
            <div className="vla-card-head">
              <span className="vla-step-badge">3</span>
              <div><h2>Employment &amp; Income</h2><p>Tell us about your employment and income</p></div>
            </div>
            <div className="vla-form-grid">
              <div className="vla-field">
                <label htmlFor="vla-employment_type">Employment Type</label>
                <select id="vla-employment_type" name="employment_type" value={form.employment_type} onChange={set}>
                  <option>Salaried</option><option>Self-Employed</option>
                  <option>Business Owner</option><option>Farmer</option><option>Freelancer</option>
                </select>
              </div>
              <div className="vla-field">
                <label htmlFor="vla-company_name">Company / Business Name *</label>
                <input id="vla-company_name" name="company_name" placeholder="TCS Private Limited"
                  value={form.company_name} onChange={set}/>
              </div>
              <div className="vla-field">
                <label htmlFor="vla-monthly_income">Monthly Income (₹) *</label>
                <input id="vla-monthly_income" name="monthly_income" type="number"
                  placeholder="75,000" value={form.monthly_income} onChange={set} inputMode="numeric"/>
              </div>
              <div className="vla-field">
                <label htmlFor="vla-work_experience">Work Experience</label>
                <select id="vla-work_experience" name="work_experience" value={form.work_experience} onChange={set}>
                  <option value="">Select</option>
                  {["Less than 1 Year","1 Year","2 Years","3 Years","4 Years","5 Years","6-10 Years","10+ Years"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="vla-field">
                <label htmlFor="vla-existing_emi">Existing EMI (₹)</label>
                <input id="vla-existing_emi" name="existing_emi" type="number"
                  placeholder="10,000" value={form.existing_emi} onChange={set} inputMode="numeric"/>
              </div>
              <div className="vla-field">
                <label htmlFor="vla-other_obligations">Other Monthly Obligations (₹)</label>
                <input id="vla-other_obligations" name="other_obligations" type="number"
                  placeholder="5,000" value={form.other_obligations} onChange={set} inputMode="numeric"/>
              </div>
              <div className="vla-field">
                <label htmlFor="vla-bank_name">Bank Name</label>
                <select id="vla-bank_name" name="bank_name" value={form.bank_name} onChange={set}>
                  <option value="">Select Bank</option>
                  {BANKS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              {/* Affordability indicator */}
              {form.monthly_income && (
                <div className="vla-field vla-field--full">
                  <AffordabilityMeter income={+form.monthly_income} existingEmi={+form.existing_emi||0}/>
                </div>
              )}
            </div>
            <div className="vla-actions">
              <button className="vla-btn-outline" onClick={back}>← Back</button>
              <button className="vla-btn-primary" onClick={next}>Save &amp; Continue</button>
            </div>
          </div>
        )}

        {/* ── Step 4: Vehicle Details ── */}
        {step===4 && (
          <div className="vla-card vla-card--anim">
            <div className="vla-card-head">
              <span className="vla-step-badge">4</span>
              <div><h2>Vehicle Details</h2><p>Enter details about the vehicle you want to finance</p></div>
            </div>
            <div className="vla-form-grid">
              <div className="vla-field">
                <label>Vehicle Type</label>
                <input value={loanType?.title||""} readOnly style={{background:"#f8fafc",color:"#64748b"}}/>
              </div>
              <div className="vla-field">
                <label htmlFor="vla-vehicle_brand">Vehicle Brand</label>
                <select id="vla-vehicle_brand" name="vehicle_brand" value={form.vehicle_brand} onChange={set}>
                  <option value="">Select Brand</option>
                  {brands.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="vla-field">
                <label htmlFor="vla-vehicle_model">Vehicle Model</label>
                <input id="vla-vehicle_model" name="vehicle_model" placeholder="e.g. Creta SX"
                  value={form.vehicle_model} onChange={set}/>
              </div>
              <div className="vla-field">
                <label htmlFor="vla-fuel_type">Fuel Type</label>
                <select id="vla-fuel_type" name="fuel_type" value={form.fuel_type} onChange={set}>
                  {FUEL_TYPES.map(f=><option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="vla-field">
                <label htmlFor="vla-ex_showroom_price">Ex-Showroom / Assessed Price (₹) *</label>
                <input id="vla-ex_showroom_price" name="ex_showroom_price" type="number"
                  placeholder="12,00,000" value={form.ex_showroom_price} onChange={set} inputMode="numeric"/>
              </div>
              <div className="vla-field">
                <label htmlFor="vla-down_payment">Down Payment (₹)</label>
                <input id="vla-down_payment" name="down_payment" type="number"
                  placeholder="2,00,000" value={form.down_payment} onChange={set} inputMode="numeric"/>
                {form.ex_showroom_price && form.down_payment && (
                  <span className="vla-field-hint">
                    LTV: {Math.round((+derivedLoan / +form.ex_showroom_price)*100)}% of vehicle price
                  </span>
                )}
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

        {/* ── Step 5: EMI Preview ── */}
        {step===5 && (
          <div className="vla-card vla-card--emi vla-card--anim">
            <div className="vla-emi-layout">
              <div className="vla-emi-summary">
                <div className="vla-card-head">
                  <span className="vla-step-badge">5</span>
                  <div><h2>EMI Preview</h2><p>Review your loan and EMI details</p></div>
                </div>
                {[["Loan Amount",fmt(derivedLoan)],["Interest Rate (p.a.)",`${form.interest_rate}%`],["Tenure",`${form.tenure} Months`],["Monthly EMI",`₹ ${emi.toLocaleString("en-IN")}`],["Total Payable",`₹ ${totalPayable.toLocaleString("en-IN")}`],["Total Interest",`₹ ${totalInterest.toLocaleString("en-IN")}`]].map(([l,v])=>(
                  <div key={l} className="vla-emi-row">
                    <span>{l}</span>
                    <strong style={l.includes("EMI")?{color:"#00B050",fontSize:"18px"}:{}}>{v}</strong>
                  </div>
                ))}

                {/* Donut chart breakdown */}
                <div className="vla-donut-wrap">
                  <svg viewBox="0 0 100 100" className="vla-donut" aria-label="Loan breakdown chart">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="14"/>
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#00B050" strokeWidth="14"
                      strokeDasharray={`${principalPct * CIRC} ${CIRC}`}
                      strokeDashoffset={CIRC * 0.25}
                      strokeLinecap="butt"
                      style={{transition:"stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)"}}/>
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#003087" strokeWidth="14"
                      strokeDasharray={`${(1-principalPct) * CIRC} ${CIRC}`}
                      strokeDashoffset={CIRC * (0.25 - principalPct)}
                      strokeLinecap="butt"
                      style={{transition:"stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)"}}/>
                  </svg>
                  <div className="vla-donut-legend">
                    <span><i style={{background:"#00B050"}}/> Principal: {Math.round(principalPct*100)}%</span>
                    <span><i style={{background:"#003087"}}/> Interest: {Math.round((1-principalPct)*100)}%</span>
                  </div>
                </div>
              </div>

              <div className="vla-emi-calc">
                <div className="vla-calc-title">EMI Calculator</div>
                <div className="vla-calc-field">
                  <label>Loan Amount</label>
                  <div className="vla-calc-val">{fmt(derivedLoan)}</div>
                  <input name="loan_amount" type="range" min={50000} max={3000000} step={10000}
                    value={derivedLoan} onChange={set} className="vla-range"
                    aria-label="Loan amount slider"/>
                  <div className="vla-range-labels"><span>₹50,000</span><span>₹30,00,000</span></div>
                </div>
                <div className="vla-calc-field">
                  <label>Interest Rate (p.a.): <strong>{form.interest_rate}%</strong></label>
                  <input name="interest_rate" type="range" min={8} max={24} step={0.01}
                    value={form.interest_rate} onChange={set} className="vla-range"
                    aria-label="Interest rate slider"/>
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

        {/* ── Step 6: Upload Documents ── */}
        {step===6 && (
          <div className="vla-card vla-card--anim">
            <div className="vla-card-head">
              <span className="vla-step-badge">6</span>
              <div><h2>Upload Documents</h2><p>Documents for <strong>{loanType?.title}</strong> — {form.employment_type} applicant</p></div>
            </div>

            {/* Upload progress pill */}
            <UploadProgressBar docs={allDocs} files={files}/>

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
              <span>Documents marked <strong>*</strong> are mandatory. All uploads are encrypted and stored securely.</span>
            </div>
            <div className="vla-actions">
              <button className="vla-btn-outline" onClick={back}>← Back</button>
              <button className="vla-btn-primary" onClick={next}>Save &amp; Continue</button>
            </div>
          </div>
        )}

        {/* ── Step 7: Review & Submit ── */}
        {step===7 && (
          <div className="vla-card vla-card--anim">
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
                  <span key={d.key} style={{padding:"4px 10px",borderRadius:6,fontSize:12,fontWeight:600,background:files[d.key]?"#dcfce7":"#f1f5f9",color:files[d.key]?"#166534":"#94a3b8"}}>
                    {files[d.key]?"✅":"⬜"} {d.label}
                  </span>
                ))}
              </div>
              <div style={{fontSize:12,color:"#64748b",marginTop:8}}>{Object.keys(files).length} of {allDocs.length} Documents Uploaded</div>
            </div>
            <div className="vla-declaration">
              <label>
                <input type="checkbox" checked={declared} onChange={e=>setDeclared(e.target.checked)}/>
                <span>I hereby declare that the above information is true and correct to the best of my knowledge. I authorize Plumzo Capital Services and its partners to verify my details and fetch credit report.</span>
              </label>
            </div>
            <div className="vla-actions">
              <button className="vla-btn-outline" onClick={back}>← Back</button>
              <button className="vla-btn-submit" onClick={submit} disabled={submitting||!declared}>
                {submitting?"Submitting…":"🔒 Submit Application"}
              </button>
            </div>
          </div>
        )}

        {/* Toast error */}
        {toast && (
          <div className="vla-toast vla-toast--error" role="alert">
            <span>⚠ {toast}</span>
            <button onClick={()=>setToast("")} aria-label="Dismiss">✕</button>
          </div>
        )}
      </div>

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
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────

function VlaDocCard({doc,file,onUpload,inputRef,onChange}){
  return(
    <div className={`vla-doc-card ${file?"uploaded":""}`}
      role="group" aria-label={doc.label}>
      <div className="vla-doc-icon">{file?"✅":"📄"}</div>
      <div className="vla-doc-label">{doc.label}{doc.required?" *":""}</div>
      <div className="vla-doc-hint">{doc.hint}</div>
      {file && <div className="vla-doc-done">✓ {file.name}</div>}
      <input type="file" accept={doc.accept} ref={inputRef} style={{display:"none"}} onChange={onChange}
        aria-label={`Upload ${doc.label}`}/>
      <button className="vla-doc-btn" onClick={onUpload}
        aria-label={file?`Change ${doc.label}`:`Upload ${doc.label}`}>
        {file?"Change":"Upload ↑"}
      </button>
    </div>
  );
}

function AffordabilityMeter({ income, existingEmi }) {
  const maxAffordable = Math.round(income * 0.5 - existingEmi);
  const label = maxAffordable > 0
    ? `Based on your income, you can afford an EMI up to ₹${maxAffordable.toLocaleString("en-IN")}/month`
    : "Existing obligations are high — please review before proceeding";
  const color = maxAffordable > 10000 ? "#00B050" : maxAffordable > 0 ? "#f59e0b" : "#ef4444";
  return (
    <div className="vla-affordability" style={{borderColor:color}}>
      <span style={{color}}>💡</span>
      <span style={{fontSize:12,color:"#374151"}}>{label}</span>
    </div>
  );
}

function UploadProgressBar({ docs, files }) {
  const required = docs.filter(d=>d.required);
  const done = required.filter(d=>files[d.key]);
  const pct = required.length ? Math.round((done.length/required.length)*100) : 0;
  return (
    <div className="vla-upload-progress">
      <div className="vla-upload-progress-label">
        <span>Required documents: {done.length}/{required.length}</span>
        <span style={{color: pct===100?"#00B050":"#64748b",fontWeight:700}}>{pct}%</span>
      </div>
      <div className="vla-upload-bar">
        <div className="vla-upload-bar-fill" style={{width:`${pct}%`,background:pct===100?"#00B050":"#003087"}}/>
      </div>
    </div>
  );
}
