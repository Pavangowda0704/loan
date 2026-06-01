// ============================================================
//  PersonalLoanApply.jsx — 7-step Personal Loan Apply
// ============================================================
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPersonalLoan } from "../../../api/personalLoanApi.js";
import API from "../../../api/axiosInstance.js";
import "../personalLoan.css";
import "./PersonalLoanApply.css";

const STEPS = [
  { num: 1, label: "Loan Type" },
  { num: 2, label: "Personal Details" },
  { num: 3, label: "Employment & Income" },
  { num: 4, label: "Loan Details & EMI" },
  { num: 5, label: "Upload Documents" },
  { num: 6, label: "Review & Submit" },
  { num: 7, label: "Success" },
];

const LOAN_TYPES = [
  { id: "salaried",      icon: "💼", title: "Salaried Personal Loan",      desc: "For individuals with regular monthly income" },
  { id: "self-employed", icon: "🏢", title: "Self-Employed Personal Loan",  desc: "For self-employed professionals & business owners" },
];

const SALARIED_DOCS = [
  { key: "pan",     label: "PAN Card",              hint: "JPG, PNG, PDF (Max 2MB)", accept: ".jpg,.jpeg,.png,.pdf", required: true  },
  { key: "aadhaar", label: "Aadhaar Card",           hint: "JPG, PNG, PDF (Max 2MB)", accept: ".jpg,.jpeg,.png,.pdf", required: true  },
  { key: "salary1", label: "Salary Slip – Month 1",  hint: "JPG, PNG, PDF (Max 2MB)", accept: ".jpg,.jpeg,.png,.pdf", required: true  },
  { key: "salary2", label: "Salary Slip – Month 2",  hint: "JPG, PNG, PDF (Max 2MB)", accept: ".jpg,.jpeg,.png,.pdf", required: false },
  { key: "salary3", label: "Salary Slip – Month 3",  hint: "JPG, PNG, PDF (Max 2MB)", accept: ".jpg,.jpeg,.png,.pdf", required: false },
  { key: "bank",    label: "6 Months Bank Statement",hint: "JPG, PNG, PDF (Max 5MB)", accept: ".jpg,.jpeg,.png,.pdf", required: true  },
  { key: "form16",  label: "Form 16 / IT Returns",   hint: "JPG, PNG, PDF (Max 2MB)", accept: ".jpg,.jpeg,.png,.pdf", required: true  },
  { key: "empid",   label: "Employee ID Card",        hint: "JPG, PNG (Max 2MB)",      accept: ".jpg,.jpeg,.png,.pdf", required: false },
  { key: "photo",   label: "Passport Size Photo",    hint: "JPG, PNG (Max 1MB)",      accept: ".jpg,.jpeg,.png",      required: true  },
];

const SE_DOCS = [
  { key: "pan",     label: "PAN Card",                      hint: "JPG, PNG, PDF (Max 2MB)", accept: ".jpg,.jpeg,.png,.pdf", required: true  },
  { key: "aadhaar", label: "Aadhaar Card",                   hint: "JPG, PNG, PDF (Max 2MB)", accept: ".jpg,.jpeg,.png,.pdf", required: true  },
  { key: "gst",     label: "GST Registration",              hint: "JPG, PNG, PDF (Max 2MB)", accept: ".jpg,.jpeg,.png,.pdf", required: true  },
  { key: "bizproof",label: "Business Proof",                 hint: "Ownership / Registration — PDF", accept: ".jpg,.jpeg,.png,.pdf", required: true  },
  { key: "trade",   label: "Trade License",                  hint: "Shops & Establishment cert — PDF", accept: ".jpg,.jpeg,.png,.pdf", required: false },
  { key: "itr",     label: "IT Returns (2 Years)",           hint: "JPG, PNG, PDF (Max 2MB)", accept: ".jpg,.jpeg,.png,.pdf", required: true  },
  { key: "bankbiz", label: "Business Bank Statement",        hint: "6 months — PDF (Max 5MB)", accept: ".jpg,.jpeg,.png,.pdf", required: true  },
  { key: "compreg", label: "Company Registration Documents", hint: "MOA / AOA / Partnership deed — PDF", accept: ".jpg,.jpeg,.png,.pdf", required: false },
  { key: "photo",   label: "Passport Size Photo",           hint: "JPG, PNG (Max 1MB)",      accept: ".jpg,.jpeg,.png",      required: true  },
];

const PURPOSES = ["Medical","Education","Travel","Marriage","Home Renovation","Business","Debt Consolidation","Other"];
const TENURES  = [12,18,24,36,48,60,84];
const STATES   = ["Maharashtra","Karnataka","Delhi","Tamil Nadu","Telangana","Gujarat","Rajasthan","Uttar Pradesh","West Bengal","Kerala","Punjab","Haryana","Other"];
const BANKS    = ["HDFC Bank","ICICI Bank","SBI","Axis Bank","Kotak Mahindra Bank","Bank of Baroda","Punjab National Bank","Canara Bank","Other"];

const calcEMI = (p,r,n) => {
  if (!p||!r||!n) return 0;
  const rm = r/12/100;
  return Math.round(p*rm*Math.pow(1+rm,n)/(Math.pow(1+rm,n)-1));
};
const fmt = v => v ? "₹"+Number(v).toLocaleString("en-IN") : "—";

export default function PersonalLoanApply() {
  const navigate = useNavigate();
  const [step, setStep]             = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [appId, setAppId]           = useState("");
  const [loanType, setLoanType]     = useState(null);
  const [files, setFiles]           = useState({});
  const fileRefs                    = useRef({});

  const [form, setForm] = useState({
    full_name:"", phone:"", email:"", dob:"", pan_number:"", aadhaar:"",
    city:"", state:"", pincode:"",
    employment_type:"Salaried", company_name:"", monthly_income:"",
    work_experience:"", existing_emi:"", other_obligations:"", bank_name:"",
    loan_amount:"800000", tenure:"60", loan_purpose:"Home Renovation", interest_rate:"10.49",
  });

  // Wake up Render backend on page load
  useEffect(() => {
    API.get('/health').catch(() => {});
  }, []);

  const set = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const docs = loanType?.id === "self-employed" ? SE_DOCS : SALARIED_DOCS;

  const emi          = calcEMI(+form.loan_amount, +form.interest_rate, +form.tenure);
  const totalPayable = emi * +form.tenure;
  const totalInterest= totalPayable - +form.loan_amount;

  const validate = () => {
    if (step===1 && !loanType)
      return alert("Please select a loan type."), false;
    if (step===2){
      if (!form.full_name||!form.phone||!form.email||!form.pan_number||!form.city)
        return alert("Please fill all required fields."), false;
      if (!/^[0-9]{10}$/.test(form.phone))
        return alert("Mobile must be 10 digits."), false;
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(form.pan_number))
        return alert("Invalid PAN format e.g. ABCDE1234F."), false;
    }
    if (step===3 && (!form.company_name||!form.monthly_income))
      return alert("Please fill employment details."), false;
    if (step===4 && +form.loan_amount < 50000)
      return alert("Minimum loan amount is ₹50,000."), false;
    if (step===5){
      const missing = docs.filter(d=>d.required && !files[d.key]).map(d=>d.label);
      if (missing.length>0)
        return alert("Please upload required documents:\n• "+missing.join("\n• ")), false;
    }
    return true;
  };

  const next = () => { if(validate()) setStep(s=>s+1); };
  const back = () => setStep(s=>s-1);

  const handleFile = (key,e) => {
    const f = e.target.files[0];
    if(f) setFiles(prev=>({...prev,[key]:f}));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await createPersonalLoan({
        ...form,
        loan_product:    loanType.title,
        employment_type: loanType.id==="self-employed" ? "Self-Employed" : "Salaried",
        pan_number:      form.pan_number.toUpperCase(),
        loan_amount:     +form.loan_amount,
        monthly_income:  +form.monthly_income,
        existing_emi:    +form.existing_emi||0,
        tenure:          +form.tenure,
      });

      const applicationId = res.data.application_id;
      setAppId(applicationId);

      // Upload documents using axios
      if (Object.keys(files).length > 0) {
        const formData = new FormData();
        Object.entries(files).forEach(([key, file]) => {
          formData.append(key, file);
        });
        try {
          await API.post(
            `/personal-loans/${applicationId}/documents`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
        } catch (uploadErr) {
          console.warn('Document upload error:', uploadErr.message);
        }
      }

      setStep(7);
    } catch(err){
      alert(err.response?.data?.message||"Submission failed. Please try again.");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="pla-page">
      <div className="pla-hero">
        <h1>Personal Loan <span>Application Process</span></h1>
        <p>Simple, Quick &amp; 100% Digital Process</p>
      </div>
      <div className="pla-stepper-wrap">
        <div className="pla-stepper">
          {STEPS.map((s,i)=>{
            const done=step>s.num, active=step===s.num;
            return(
              <div key={s.num} className={`pla-step ${done?"done":active?"active":""}`}>
                <div className="pla-step-bubble">{done?"✓":s.num}</div>
                <span className="pla-step-label">{s.label}</span>
                {i<STEPS.length-1 && <div className="pla-step-line"/>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="pla-content">
        {step===1 && (
          <div className="pla-card">
            <div className="pla-card-head">
              <span className="pla-step-badge">1</span>
              <div><h2>Select Personal Loan Type</h2><p>Choose the loan type that suits you</p></div>
            </div>
            <div className="pla-loan-type-grid">
              {LOAN_TYPES.map(lt=>(
                <div key={lt.id}
                  className={`pla-loan-type-card ${loanType?.id===lt.id?"selected":""}`}
                  onClick={()=>{
                    setLoanType(lt);
                    setForm(f=>({...f, employment_type: lt.id==="self-employed" ? "Self-Employed" : "Salaried"}));
                  }}>
                  <div className="pla-lt-icon">{lt.icon}</div>
                  <div className="pla-lt-body"><strong>{lt.title}</strong><span>{lt.desc}</span></div>
                  <div className="pla-lt-radio">{loanType?.id===lt.id && <div className="pla-lt-dot"/>}</div>
                </div>
              ))}
            </div>
            <div className="pla-actions">
              <button className="pla-btn-primary" onClick={next}>Continue →</button>
            </div>
          </div>
        )}
        {step===2 && (
          <div className="pla-card">
            <div className="pla-card-head">
              <span className="pla-step-badge">2</span>
              <div><h2>Personal Details</h2><p>Tell us about yourself</p></div>
            </div>
            <div className="pla-form-grid">
              <div className="pla-field"><label>Full Name *</label>
                <input name="full_name" placeholder="Rahul Sharma" value={form.full_name} onChange={set}/></div>
              <div className="pla-field"><label>Mobile Number *</label>
                <input name="phone" placeholder="98765 43210" value={form.phone} onChange={set} maxLength={10}/></div>
              <div className="pla-field"><label>Email Address *</label>
                <input name="email" type="email" placeholder="rahul@email.com" value={form.email} onChange={set}/></div>
              <div className="pla-field"><label>Date of Birth</label>
                <input name="dob" type="date" value={form.dob} onChange={set}/></div>
              <div className="pla-field"><label>PAN Number *</label>
                <input name="pan_number" placeholder="ABCDE1234F" value={form.pan_number} onChange={set} style={{textTransform:"uppercase"}}/></div>
              <div className="pla-field"><label>Aadhaar Number</label>
                <input name="aadhaar" placeholder="1234 5678 9012" value={form.aadhaar} onChange={set} maxLength={14}/></div>
              <div className="pla-field"><label>City *</label>
                <input name="city" placeholder="Mumbai" value={form.city} onChange={set}/></div>
              <div className="pla-field"><label>State</label>
                <select name="state" value={form.state} onChange={set}>
                  <option value="">Select State</option>
                  {STATES.map(s=><option key={s}>{s}</option>)}
                </select></div>
              <div className="pla-field"><label>Pincode</label>
                <input name="pincode" placeholder="400001" value={form.pincode} onChange={set} maxLength={6}/></div>
            </div>
            <div className="pla-actions">
              <button className="pla-btn-outline" onClick={back}>← Back</button>
              <button className="pla-btn-primary" onClick={next}>Save &amp; Continue</button>
            </div>
          </div>
        )}
        {step===3 && (
          <div className="pla-card">
            <div className="pla-card-head">
              <span className="pla-step-badge">3</span>
              <div><h2>Employment &amp; Income</h2><p>Tell us about your employment and income</p></div>
            </div>
            <div className="pla-form-grid">
              <div className="pla-field"><label>Employment Type</label>
                <select name="employment_type" value={form.employment_type} onChange={set}>
                  {loanType?.id === "self-employed"
                    ? <><option>Self-Employed</option><option>Business Owner</option><option>Freelancer</option></>
                    : <><option>Salaried</option><option>Self-Employed</option><option>Business Owner</option><option>Freelancer</option></>}
                </select></div>
              <div className="pla-field">
                <label>{loanType?.id==="self-employed"?"Business Name *":"Company Name *"}</label>
                <input name="company_name" placeholder={loanType?.id==="self-employed"?"My Business Pvt Ltd":"TCS Private Limited"} value={form.company_name} onChange={set}/></div>
              <div className="pla-field"><label>Monthly Income (₹) *</label>
                <input name="monthly_income" type="number" placeholder="75,000" value={form.monthly_income} onChange={set}/></div>
              <div className="pla-field"><label>Work Experience</label>
                <select name="work_experience" value={form.work_experience} onChange={set}>
                  <option value="">Select</option>
                  {["Less than 1 Year","1 Year","2 Years","3 Years","4 Years","5 Years","6-10 Years","10+ Years"].map(v=><option key={v}>{v}</option>)}
                </select></div>
              <div className="pla-field"><label>Existing EMI (₹)</label>
                <input name="existing_emi" type="number" placeholder="10,000" value={form.existing_emi} onChange={set}/></div>
              <div className="pla-field"><label>Other Monthly Obligations (₹)</label>
                <input name="other_obligations" type="number" placeholder="5,000" value={form.other_obligations} onChange={set}/></div>
              <div className="pla-field"><label>Bank Name</label>
                <select name="bank_name" value={form.bank_name} onChange={set}>
                  <option value="">Select Bank</option>
                  {BANKS.map(b=><option key={b}>{b}</option>)}
                </select></div>
            </div>
            <div className="pla-actions">
              <button className="pla-btn-outline" onClick={back}>← Back</button>
              <button className="pla-btn-primary" onClick={next}>Save &amp; Continue</button>
            </div>
          </div>
        )}
        {step===4 && (
          <div className="pla-card pla-card--wide">
            <div className="pla-loan-emi-layout">
              <div className="pla-loan-form-col">
                <div className="pla-card-head">
                  <span className="pla-step-badge">4</span>
                  <div><h2>Loan Details &amp; EMI Preview</h2><p>Choose loan amount, purpose and tenure</p></div>
                </div>
                <div className="pla-field pla-field--full">
                  <label>Required Loan Amount (₹)</label>
                  <input name="loan_amount" type="number" value={form.loan_amount} onChange={set} placeholder="8,00,000"/>
                  <input name="loan_amount" type="range" min={50000} max={2500000} step={10000} value={form.loan_amount} onChange={set} className="pla-range"/>
                  <div className="pla-range-labels"><span>₹50,000</span><span>₹25,00,000</span></div>
                </div>
                <div className="pla-field pla-field--full">
                  <label>Purpose of Loan</label>
                  <select name="loan_purpose" value={form.loan_purpose} onChange={set}>
                    {PURPOSES.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="pla-field pla-field--full">
                  <label>Interest Rate (p.a.): <strong>{form.interest_rate}%</strong></label>
                  <input name="interest_rate" type="range" min={8} max={24} step={0.01} value={form.interest_rate} onChange={set} className="pla-range"/>
                  <div className="pla-range-labels"><span>8%</span><span>24%</span></div>
                </div>
                <div className="pla-field pla-field--full">
                  <label>Tenure</label>
                  <select name="tenure" value={form.tenure} onChange={set}>
                    {TENURES.map(t=><option key={t} value={t}>{t} Months ({Math.round(t/12*10)/10} {t<=12?"Year":"Years"})</option>)}
                  </select>
                </div>
              </div>
              <div className="pla-emi-panel">
                <div className="pla-emi-icon">🖩</div>
                <div className="pla-emi-title">EMI Preview</div>
                <div className="pla-emi-label">Monthly EMI</div>
                <div className="pla-emi-amount">₹ {emi.toLocaleString("en-IN")}</div>
                <div className="pla-emi-divider"/>
                <div className="pla-emi-row"><span>Total Payable</span><strong>₹ {totalPayable.toLocaleString("en-IN")}</strong></div>
                <div className="pla-emi-row"><span>Total Interest</span><strong>₹ {totalInterest.toLocaleString("en-IN")}</strong></div>
              </div>
            </div>
            <div className="pla-actions">
              <button className="pla-btn-outline" onClick={back}>← Back</button>
              <button className="pla-btn-primary" onClick={next}>Save &amp; Continue</button>
            </div>
          </div>
        )}
        {step===5 && (
          <div className="pla-card">
            <div className="pla-card-head">
              <span className="pla-step-badge">5</span>
              <div><h2>Upload Documents</h2><p>Documents required for <strong>{loanType?.title}</strong></p></div>
            </div>
            <div className="pla-doc-section-label">📋 KYC Documents</div>
            <div className="pla-doc-grid">
              {docs.filter(d=>["pan","aadhaar"].includes(d.key)).map(doc=>(
                <DocCard key={doc.key} doc={doc} file={files[doc.key]}
                  onUpload={()=>fileRefs.current[doc.key]?.click()}
                  inputRef={el=>fileRefs.current[doc.key]=el}
                  onChange={e=>handleFile(doc.key,e)}/>
              ))}
            </div>
            <div className="pla-doc-section-label">💰 Income Proof</div>
            <div className="pla-doc-grid">
              {docs.filter(d=>!["pan","aadhaar","photo"].includes(d.key)).map(doc=>(
                <DocCard key={doc.key} doc={doc} file={files[doc.key]}
                  onUpload={()=>fileRefs.current[doc.key]?.click()}
                  inputRef={el=>fileRefs.current[doc.key]=el}
                  onChange={e=>handleFile(doc.key,e)}/>
              ))}
            </div>
            <div className="pla-doc-section-label">📸 Photograph</div>
            <div className="pla-doc-grid pla-doc-grid--small">
              {docs.filter(d=>d.key==="photo").map(doc=>(
                <DocCard key={doc.key} doc={doc} file={files[doc.key]}
                  onUpload={()=>fileRefs.current[doc.key]?.click()}
                  inputRef={el=>fileRefs.current[doc.key]=el}
                  onChange={e=>handleFile(doc.key,e)}/>
              ))}
            </div>
            <div className="pla-doc-note">
              <span>ℹ️</span>
              <span>Documents marked <strong>*</strong> are mandatory.</span>
            </div>
            <div className="pla-actions">
              <button className="pla-btn-outline" onClick={back}>← Back</button>
              <button className="pla-btn-primary" onClick={next}>Save &amp; Continue</button>
            </div>
          </div>
        )}
        {step===6 && (
          <div className="pla-card pla-card--review">
            <div className="pla-card-head">
              <span className="pla-step-badge">6</span>
              <div><h2>Review &amp; Submit</h2><p>Please review your details before submission</p></div>
            </div>
            <div className="pla-review-grid">
              <div className="pla-review-section">
                <div className="pla-review-section-head">Personal Details<button className="pla-edit-btn" onClick={()=>setStep(2)}>Edit</button></div>
                {[["👤",form.full_name],["📱",form.phone],["✉️",form.email],["🎂",form.dob||"—"],["🪪",form.pan_number.toUpperCase()],["📍",[form.city,form.state,form.pincode].filter(Boolean).join(", ")||"—"]].map(([ic,val])=>(
                  <div key={ic+val} className="pla-review-row"><span className="pla-rr-icon">{ic}</span><span>{val}</span></div>
                ))}
              </div>
              <div className="pla-review-section">
                <div className="pla-review-section-head">Employment &amp; Income<button className="pla-edit-btn" onClick={()=>setStep(3)}>Edit</button></div>
                {[["💼",form.employment_type],["🏢",form.company_name],["💰",fmt(form.monthly_income)+" (Monthly)"],["📅",form.work_experience||"—"],["🏦",form.bank_name||"—"]].map(([ic,val],i)=>(
                  <div key={i} className="pla-review-row"><span className="pla-rr-icon">{ic}</span><span>{val}</span></div>
                ))}
              </div>
              <div className="pla-review-section">
                <div className="pla-review-section-head">Loan Details<button className="pla-edit-btn" onClick={()=>setStep(4)}>Edit</button></div>
                {[["Loan Amount",fmt(form.loan_amount)],["Purpose",form.loan_purpose],["Interest Rate",`${form.interest_rate}%`],["Tenure",`${form.tenure} Months`],["Monthly EMI",`₹ ${emi.toLocaleString("en-IN")}`],["Total Payable",`₹ ${totalPayable.toLocaleString("en-IN")}`]].map(([l,v])=>(
                  <div key={l} className="pla-review-row pla-review-row--kv"><span className="pla-rr-label">{l}</span><span className="pla-rr-val">{v}</span></div>
                ))}
              </div>
              <div className="pla-review-section">
                <div className="pla-review-section-head">Uploaded Documents<button className="pla-edit-btn" onClick={()=>setStep(5)}>Edit</button></div>
                {docs.map(doc=>(
                  <div key={doc.key} className="pla-review-row">
                    <span className="pla-rr-icon">{files[doc.key]?"✅":"⬜"}</span>
                    <span style={{color:files[doc.key]?"#065f46":"#6b7280"}}>{doc.label}{doc.required?" *":""}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pla-declaration">
              <label>
                <input type="checkbox" defaultChecked/>
                <span>I hereby declare that the above information is true and correct to the best of my knowledge. I authorize Plumzo Capital Services and its partners to verify my details and fetch credit report.</span>
              </label>
            </div>
            <div className="pla-actions">
              <button className="pla-btn-outline" onClick={back}>← Back</button>
              <button className="pla-btn-submit" onClick={submit} disabled={submitting}>
                {submitting?"Submitting…":"🔒 Submit Application"}
              </button>
            </div>
          </div>
        )}
        {step===7 && (
          <div className="pla-card pla-success-card">
            <div className="pla-success-confetti">
              {[0,1,2,3,4,5,6,7].map(i=><span key={i} className={`pla-confetti-dot pla-confetti-dot--${i}`}>✦</span>)}
            </div>
            <div className="pla-success-check">✓</div>
            <h2>Application Submitted Successfully!</h2>
            <p>Thank you! Your personal loan application has been submitted successfully.</p>
            <div className="pla-success-id">
              <div className="pla-sid-label">Application ID</div>
              <div className="pla-sid-value">{appId||"PL20240516890"}</div>
            </div>
            <div className="pla-success-status">
              <span className="pla-status-dot"/> Status: <strong>Under Review</strong>
            </div>
            <p className="pla-success-note">We will review your application and get back to you shortly.</p>
            <div className="pla-success-notice">
              <span>📞</span>
              <div>
                <strong>Next Step — Document Collection (Step 6)</strong>
                <p>Our relationship manager will contact you within 24 hours to collect any remaining documents and complete the verification process.</p>
              </div>
            </div>
            <div className="pla-actions pla-actions--center">
              <button className="pla-btn-primary" onClick={()=>navigate("/")}>Go to Home</button>
            </div>
          </div>
        )}
      </div>
      <div className="pla-trust-bar">
        {[
          {icon:"⚡",title:"Quick Approval",desc:"Get approval in 24-48 hours"},
          {icon:"📉",title:"Lowest Interest Rates",desc:"Starting from 8.49%* p.a."},
          {icon:"📋",title:"Minimal Documentation",desc:"Simple process with minimal paperwork"},
          {icon:"📅",title:"Flexible Tenure",desc:"Choose tenure up to 7 years"},
          {icon:"✅",title:"No Hidden Charges",desc:"Transparent process with zero fees"},
          {icon:"🛡️",title:"100% Secure",desc:"Bank-level security of your data"},
        ].map(t=>(
          <div key={t.title} className="pla-trust-item">
            <span className="pla-trust-icon">{t.icon}</span>
            <div><strong>{t.title}</strong><span>{t.desc}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocCard({doc, file, onUpload, inputRef, onChange}){
  return (
    <div className={`pla-doc-card ${file?"uploaded":""}`}>
      <div className="pla-doc-icon">{file?"✅":"📄"}</div>
      <div className="pla-doc-label">{doc.label}{doc.required?" *":""}</div>
      <div className="pla-doc-hint">{doc.hint}</div>
      {file && <div className="pla-doc-uploaded">✓ {file.name}</div>}
      <input type="file" accept={doc.accept} ref={inputRef} style={{display:"none"}} onChange={onChange}/>
      <button className="pla-doc-btn" onClick={onUpload}>{file?"Change":"Upload ↑"}</button>
    </div>
  );
}