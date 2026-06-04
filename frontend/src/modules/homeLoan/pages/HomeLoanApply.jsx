// frontend/src/modules/homeLoan/pages/HomeLoanApply.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import API from '../../../api/axiosInstance.js';
import HomeLoanDocUpload from '../components/HomeLoanDocUpload';
import { LOAN_TYPES } from './HomeLoan';
import '../homeLoan.css';



const formatINR = (val) =>
  '₹' + Number(Math.round(val)).toLocaleString('en-IN');

const calcEMI = (amount, tenureYrs, rate) => {
  const r = rate / 12 / 100;
  const n = tenureYrs * 12;
  if (r === 0) return amount / n;
  return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

const STEPS = [
  { label: 'Loan Type' },
  { label: 'Personal' },
  { label: 'Employment' },
  { label: 'Property' },
  { label: 'Loan & EMI' },
  { label: 'Documents' },
  { label: 'Review' },
];

// ── Doc lists ──────────────────────────────────────────────
const MANDATORY_DOCS = [
  { key: 'aadhaar', name: 'Aadhaar Card', required: true, icon: '🪪' },
  { key: 'pan', name: 'PAN Card', required: true, icon: '💳' },
  { key: 'income_proof', name: 'Income Proof', required: true, icon: '📋' },
  { key: 'bank_statement', name: 'Bank Statement (6 months)', required: true, icon: '🏦' },
  { key: 'photograph', name: 'Passport Photograph', required: true, icon: '📷' },
];
const SALARIED_DOCS = [
  { key: 'salary_slips', name: 'Latest 3 Salary Slips', required: true, icon: '💰' },
  { key: 'form16', name: 'Form 16 / IT Returns', required: true, icon: '📊' },
  { key: 'emp_id', name: 'Employee ID Card', required: false, icon: '🪪' },
];
const SELF_EMPLOYED_DOCS = [
  { key: 'gst', name: 'GST Registration', required: true, icon: '📑' },
  { key: 'business_proof', name: 'Business Proof', required: true, icon: '🏢' },
  { key: 'trade_license', name: 'Trade License', required: false, icon: '📜' },
  { key: 'itr', name: 'IT Returns (2 years)', required: true, icon: '📊' },
  { key: 'biz_bank_stmt', name: 'Business Bank Statements', required: true, icon: '🏦' },
  { key: 'company_reg', name: 'Company Registration Documents', required: false, icon: '📋' },
];
const PROPERTY_DOCS = [
  { key: 'sale_deed', name: 'Sale Deed', required: true, icon: '📜' },
  { key: 'khata', name: 'Khata Certificate & Extract', required: true, icon: '📑' },
  { key: 'tax_receipt', name: 'Tax Paid Receipts', required: true, icon: '🧾' },
  { key: 'building_plan', name: 'Approved Building Plan', required: true, icon: '📐' },
  { key: 'ec', name: 'Encumbrance Certificate (EC)', required: true, icon: '🔒' },
  { key: 'occupancy', name: 'Occupancy Certificate', required: false, icon: '🏡' },
];

// Validation helpers
const validateStep = (step, data) => {
  const e = {};
  if (step === 0) {
    if (!data.loanType) e.loanType = 'Please select a loan type';
  }
  if (step === 1) {
    if (!data.fullName.trim()) e.fullName = 'Full name is required';
    if (!data.dob) e.dob = 'Date of birth is required';
    if (!data.gender) e.gender = 'Gender is required';
    if (!data.mobile || !/^\d{10}$/.test(data.mobile)) e.mobile = 'Enter valid 10-digit mobile number';
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) e.email = 'Enter valid email address';
    if (!data.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan.toUpperCase())) e.pan = 'Enter valid PAN (e.g. ABCDE1234F)';
    if (!data.aadhaar || !/^\d{12}$/.test(data.aadhaar)) e.aadhaar = 'Enter valid 12-digit Aadhaar number';
    if (!data.address.trim()) e.address = 'Address is required';
    if (!data.city.trim()) e.city = 'City is required';
    if (!data.state) e.state = 'State is required';
    if (!data.pincode || !/^\d{6}$/.test(data.pincode)) e.pincode = 'Enter valid 6-digit pincode';
  }
  if (step === 2) {
    if (!data.employmentType) e.employmentType = 'Please select employment type';
    if (!data.companyName.trim()) e.companyName = 'Company/Business name is required';
    if (!data.monthlyIncome || Number(data.monthlyIncome) < 10000) e.monthlyIncome = 'Minimum income ₹10,000';
    if (!data.workExperience || Number(data.workExperience) < 0) e.workExperience = 'Work experience is required';
  }
  if (step === 3) {
    if (!data.propertyType) e.propertyType = 'Select property type';
    if (!data.propertyLocation.trim()) e.propertyLocation = 'Property location is required';
    if (!data.propertyCity.trim()) e.propertyCity = 'Property city is required';
    if (!data.propertyValue || Number(data.propertyValue) < 100000) e.propertyValue = 'Property value must be at least ₹1,00,000';
    if (!data.loanPurpose) e.loanPurpose = 'Select loan purpose';
  }
  if (step === 4) {
    if (!data.loanAmount || Number(data.loanAmount) < 100000) e.loanAmount = 'Loan amount must be at least ₹1,00,000';
  }
  if (step === 5) {
    // Validate required docs
    const allDocs = [...MANDATORY_DOCS, ...(data.employmentType === 'salaried' ? SALARIED_DOCS : SELF_EMPLOYED_DOCS), ...PROPERTY_DOCS];
    allDocs.filter((d) => d.required).forEach((d) => {
      if (!data.files[d.key]) e[d.key] = 'This document is required';
    });
    if (Object.keys(e).length > 0) e._general = 'Please upload all required documents';
  }
  if (step === 6) {
    if (!data.declaration) e.declaration = 'Please check the declaration to proceed';
  }
  return e;
};

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry', 'Ladakh', 'Jammu and Kashmir',
];

const HomeLoanApply = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    // Step 0
    loanType: searchParams.get('type') || '',
    // Step 1
    fullName: '', dob: '', gender: '', maritalStatus: '',
    mobile: '', email: '', alternateMobile: '',
    pan: '', aadhaar: '',
    address: '', city: '', state: '', pincode: '',
    // Step 2
    employmentType: '', companyName: '', monthlyIncome: '',
    workExperience: '', existingEMI: '0',
    // Step 3
    propertyType: '', propertyLocation: '', propertyCity: '',
    propertyValue: '', loanPurpose: '',
    // Step 4
    loanAmount: '3000000', tenure: 20, interestRate: 8.5,
    // Step 6
    declaration: false,
    // Files
    files: {},
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleFileChange = (key, file) => {
    setForm((prev) => ({ ...prev, files: { ...prev.files, [key]: file } }));
    setErrors((prev) => { const n = { ...prev }; delete n[key]; delete n._general; return n; });
  };

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const nextStep = () => {
    const errs = validateStep(currentStep, form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setCurrentStep((s) => s + 1);
    scrollTop();
  };

  const prevStep = () => {
    setCurrentStep((s) => s - 1);
    setErrors({});
    scrollTop();
  };

  const handleSubmit = async () => {
    const errs = validateStep(6, form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      // Submit application data
      const payload = {
        full_name: form.fullName,
        phone: form.mobile,
        email: form.email,
        dob: form.dob,
        pan_number: form.pan.toUpperCase(),
        city: form.city,
        state: form.state,
        employment_type: form.employmentType,
        company_name: form.companyName,
        monthly_income: Number(form.monthlyIncome),
        work_experience: Number(form.workExperience),
        existing_emi: Number(form.existingEMI) || 0,
        loan_type: form.loanType,
        property_type: form.propertyType,
        property_value: Number(form.propertyValue),
        loan_amount: Number(form.loanAmount),
        tenure: form.tenure,
        loan_purpose: form.loanPurpose,
      };

       const res = await API.post('/home-loans', payload);
      const applicationId = res.data?.application_id;

      const fd = new FormData();
      Object.entries(form.files).forEach(([key, file]) => {
        if (file) fd.append(key, file);
      });
      await API.post(`/home-loans/${applicationId}/documents`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      localStorage.setItem('hl_application_id', applicationId);
      navigate(`/home-loan/success/${applicationId}`);
    } catch (err) {
      alert('Submission failed: ' + (err.response?.data?.message || err.message || 'Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const emi = calcEMI(Number(form.loanAmount), form.tenure, form.interestRate);
  const totalPayable = emi * form.tenure * 12;
  const totalInterest = totalPayable - Number(form.loanAmount);

  const selectedLoan = LOAN_TYPES.find((l) => l.slug === form.loanType);
  const employmentTypeDocs = form.employmentType === 'salaried' ? SALARIED_DOCS : (form.employmentType ? SELF_EMPLOYED_DOCS : []);

  return (
    <div className="hl-module hl-apply-page" ref={topRef}>
      {/* NAV */}
      <div className="hl-apply-header">
        <div className="hl-apply-header__inner">
          <Link to="/home-loan" style={{ textDecoration: 'none', color: 'var(--c-navy)', fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-main)' }}>
            Loan<span style={{ color: 'var(--c-orange)' }}>Ease</span>
          </Link>
          <div>
            <h1>Home Loan Application</h1>
            <p>Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].label}</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Link to="/home-loan" className="hl-btn hl-btn--ghost hl-btn--sm">✕ Save & Exit</Link>
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="hl-progress-bar-wrap">
        <div className="hl-progress-bar-inner">
          <div className="hl-progress-steps">
            {STEPS.map((s, i) => (
              <div
                key={s.label}
                className={`hl-progress-step ${i < currentStep ? 'done' : ''} ${i === currentStep ? 'active' : ''}`}
              >
                <div className="hl-progress-step__dot">
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <div className="hl-progress-step__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP CONTENT */}
      <div className="hl-apply-body">

        {/* STEP 0 — Loan Type Selection */}
        {currentStep === 0 && (
          <div className="hl-step-card">
            <div className="hl-step-card__header">
              <div className="hl-step-card__num">Step 1 of 7</div>
              <div className="hl-step-card__title">Select Your Loan Type</div>
            </div>
            <div className="hl-step-card__body">
              {errors.loanType && <p className="hl-field-error" style={{ marginBottom: '16px', fontSize: '14px' }}>⚠ {errors.loanType}</p>}
              <div className="hl-loan-type-grid">
                {LOAN_TYPES.map((l) => (
                  <div
                    key={l.slug}
                    className={`hl-loan-type-option ${form.loanType === l.slug ? 'selected' : ''}`}
                    onClick={() => { setForm((p) => ({ ...p, loanType: l.slug })); setErrors({}); }}
                  >
                    <div className="hl-loan-type-option__icon">{l.icon}</div>
                    <div className="hl-loan-type-option__name">{l.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--c-orange)', marginTop: '4px', fontWeight: '600' }}>From {l.rate}% p.a.</div>
                  </div>
                ))}
              </div>
              {selectedLoan && (
                <div className="hl-loan-type-desc">
                  <strong>{selectedLoan.icon} {selectedLoan.name}:</strong> {selectedLoan.description}
                </div>
              )}
              <div className="hl-form-actions">
                <button className="hl-btn hl-btn--primary hl-btn--lg" onClick={nextStep}>
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1 — Personal Details */}
        {currentStep === 1 && (
          <div className="hl-step-card">
            <div className="hl-step-card__header">
              <div className="hl-step-card__num">Step 2 of 7</div>
              <div className="hl-step-card__title">Personal Details</div>
            </div>
            <div className="hl-step-card__body">
              <div className="hl-form-grid">
                <div className="hl-form-field hl-form-field--full">
                  <label className="hl-field-label">Full Name (as per Aadhaar) <span className="req">*</span></label>
                  <input name="fullName" className={`hl-field-input ${errors.fullName ? 'error' : ''}`} placeholder="Enter full name" value={form.fullName} onChange={handleChange} />
                  {errors.fullName && <span className="hl-field-error">{errors.fullName}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Date of Birth <span className="req">*</span></label>
                  <input type="date" name="dob" className={`hl-field-input ${errors.dob ? 'error' : ''}`} value={form.dob} onChange={handleChange} max={new Date(Date.now() - 21 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0]} />
                  {errors.dob && <span className="hl-field-error">{errors.dob}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Gender <span className="req">*</span></label>
                  <select name="gender" className={`hl-field-select ${errors.gender ? 'error' : ''}`} value={form.gender} onChange={handleChange}>
                    <option value="">Select gender</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                  {errors.gender && <span className="hl-field-error">{errors.gender}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Marital Status</label>
                  <select name="maritalStatus" className="hl-field-select" value={form.maritalStatus} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                  </select>
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Mobile Number <span className="req">*</span></label>
                  <input type="tel" name="mobile" maxLength={10} className={`hl-field-input ${errors.mobile ? 'error' : ''}`} placeholder="10-digit mobile" value={form.mobile} onChange={handleChange} />
                  {errors.mobile && <span className="hl-field-error">{errors.mobile}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Email Address <span className="req">*</span></label>
                  <input type="email" name="email" className={`hl-field-input ${errors.email ? 'error' : ''}`} placeholder="you@example.com" value={form.email} onChange={handleChange} />
                  {errors.email && <span className="hl-field-error">{errors.email}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Alternate Mobile</label>
                  <input type="tel" name="alternateMobile" maxLength={10} className="hl-field-input" placeholder="Optional" value={form.alternateMobile} onChange={handleChange} />
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">PAN Number <span className="req">*</span></label>
                  <input name="pan" maxLength={10} className={`hl-field-input ${errors.pan ? 'error' : ''}`} placeholder="ABCDE1234F" value={form.pan} onChange={handleChange} style={{ textTransform: 'uppercase' }} />
                  {errors.pan && <span className="hl-field-error">{errors.pan}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Aadhaar Number <span className="req">*</span></label>
                  <input name="aadhaar" maxLength={12} className={`hl-field-input ${errors.aadhaar ? 'error' : ''}`} placeholder="12-digit Aadhaar" value={form.aadhaar} onChange={handleChange} />
                  {errors.aadhaar && <span className="hl-field-error">{errors.aadhaar}</span>}
                </div>
                <div className="hl-form-field hl-form-field--full">
                  <label className="hl-field-label">Current Address <span className="req">*</span></label>
                  <textarea name="address" className={`hl-field-textarea ${errors.address ? 'error' : ''}`} placeholder="House No., Street, Locality" value={form.address} onChange={handleChange} rows={2} />
                  {errors.address && <span className="hl-field-error">{errors.address}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">City <span className="req">*</span></label>
                  <input name="city" className={`hl-field-input ${errors.city ? 'error' : ''}`} placeholder="City" value={form.city} onChange={handleChange} />
                  {errors.city && <span className="hl-field-error">{errors.city}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">State <span className="req">*</span></label>
                  <select name="state" className={`hl-field-select ${errors.state ? 'error' : ''}`} value={form.state} onChange={handleChange}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="hl-field-error">{errors.state}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Pincode <span className="req">*</span></label>
                  <input name="pincode" maxLength={6} className={`hl-field-input ${errors.pincode ? 'error' : ''}`} placeholder="6-digit pincode" value={form.pincode} onChange={handleChange} />
                  {errors.pincode && <span className="hl-field-error">{errors.pincode}</span>}
                </div>
              </div>
              <div className="hl-form-actions">
                <button className="hl-btn hl-btn--ghost" onClick={prevStep}>← Back</button>
                <button className="hl-btn hl-btn--primary" onClick={nextStep}>Continue →</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Employment & Income */}
        {currentStep === 2 && (
          <div className="hl-step-card">
            <div className="hl-step-card__header">
              <div className="hl-step-card__num">Step 3 of 7</div>
              <div className="hl-step-card__title">Employment & Income Details</div>
            </div>
            <div className="hl-step-card__body">
              <div className="hl-form-grid">
                <div className="hl-form-field">
                  <label className="hl-field-label">Employment Type <span className="req">*</span></label>
                  <select name="employmentType" className={`hl-field-select ${errors.employmentType ? 'error' : ''}`} value={form.employmentType} onChange={handleChange}>
                    <option value="">Select type</option>
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business">Business Owner</option>
                    <option value="nri">NRI</option>
                  </select>
                  {errors.employmentType && <span className="hl-field-error">{errors.employmentType}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Company / Business Name <span className="req">*</span></label>
                  <input name="companyName" className={`hl-field-input ${errors.companyName ? 'error' : ''}`} placeholder="Employer or business name" value={form.companyName} onChange={handleChange} />
                  {errors.companyName && <span className="hl-field-error">{errors.companyName}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Net Monthly Income (₹) <span className="req">*</span></label>
                  <input type="number" name="monthlyIncome" className={`hl-field-input ${errors.monthlyIncome ? 'error' : ''}`} placeholder="e.g. 75000" value={form.monthlyIncome} onChange={handleChange} min={0} />
                  {errors.monthlyIncome && <span className="hl-field-error">{errors.monthlyIncome}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Work Experience (years) <span className="req">*</span></label>
                  <input type="number" name="workExperience" className={`hl-field-input ${errors.workExperience ? 'error' : ''}`} placeholder="e.g. 5" value={form.workExperience} onChange={handleChange} min={0} />
                  {errors.workExperience && <span className="hl-field-error">{errors.workExperience}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Existing Monthly EMI Obligations (₹)</label>
                  <input type="number" name="existingEMI" className="hl-field-input" placeholder="0 if none" value={form.existingEMI} onChange={handleChange} min={0} />
                </div>
              </div>
              <div className="hl-form-actions">
                <button className="hl-btn hl-btn--ghost" onClick={prevStep}>← Back</button>
                <button className="hl-btn hl-btn--primary" onClick={nextStep}>Continue →</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Property Details */}
        {currentStep === 3 && (
          <div className="hl-step-card">
            <div className="hl-step-card__header">
              <div className="hl-step-card__num">Step 4 of 7</div>
              <div className="hl-step-card__title">Property Details</div>
            </div>
            <div className="hl-step-card__body">
              <div className="hl-form-grid">
                <div className="hl-form-field">
                  <label className="hl-field-label">Property Type <span className="req">*</span></label>
                  <select name="propertyType" className={`hl-field-select ${errors.propertyType ? 'error' : ''}`} value={form.propertyType} onChange={handleChange}>
                    <option value="">Select type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="plot">Plot / Land</option>
                    <option value="mixed">Mixed Use</option>
                  </select>
                  {errors.propertyType && <span className="hl-field-error">{errors.propertyType}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Loan Purpose <span className="req">*</span></label>
                  <select name="loanPurpose" className={`hl-field-select ${errors.loanPurpose ? 'error' : ''}`} value={form.loanPurpose} onChange={handleChange}>
                    <option value="">Select purpose</option>
                    <option value="purchase">Purchase</option>
                    <option value="construction">Construction</option>
                    <option value="renovation">Renovation / Improvement</option>
                    <option value="balance_transfer">Balance Transfer</option>
                    <option value="plot_purchase">Plot Purchase</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.loanPurpose && <span className="hl-field-error">{errors.loanPurpose}</span>}
                </div>
                <div className="hl-form-field hl-form-field--full">
                  <label className="hl-field-label">Property Location / Address <span className="req">*</span></label>
                  <textarea name="propertyLocation" className={`hl-field-textarea ${errors.propertyLocation ? 'error' : ''}`} placeholder="Plot no., street, locality, landmark" value={form.propertyLocation} onChange={handleChange} rows={2} />
                  {errors.propertyLocation && <span className="hl-field-error">{errors.propertyLocation}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Property City <span className="req">*</span></label>
                  <input name="propertyCity" className={`hl-field-input ${errors.propertyCity ? 'error' : ''}`} placeholder="City where property is located" value={form.propertyCity} onChange={handleChange} />
                  {errors.propertyCity && <span className="hl-field-error">{errors.propertyCity}</span>}
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Approximate Property Value (₹) <span className="req">*</span></label>
                  <input type="number" name="propertyValue" className={`hl-field-input ${errors.propertyValue ? 'error' : ''}`} placeholder="e.g. 7500000" value={form.propertyValue} onChange={handleChange} min={0} />
                  {errors.propertyValue && <span className="hl-field-error">{errors.propertyValue}</span>}
                </div>
              </div>
              <div className="hl-form-actions">
                <button className="hl-btn hl-btn--ghost" onClick={prevStep}>← Back</button>
                <button className="hl-btn hl-btn--primary" onClick={nextStep}>Continue →</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 — Loan Details & EMI Preview */}
        {currentStep === 4 && (
          <div className="hl-step-card">
            <div className="hl-step-card__header">
              <div className="hl-step-card__num">Step 5 of 7</div>
              <div className="hl-step-card__title">Loan Details & EMI Preview</div>
            </div>
            <div className="hl-step-card__body">
              <div className="hl-form-grid">
                <div className="hl-form-field hl-form-field--full">
                  <label className="hl-field-label">Required Loan Amount <span className="req">*</span></label>
                  <div className="hl-slider-label" style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--c-slate)' }}>₹1 Lakh</span>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--c-orange)' }}>{formatINR(form.loanAmount)}</span>
                    <span style={{ fontSize: '13px', color: 'var(--c-slate)' }}>₹5 Crore</span>
                  </div>
                  <input
                    type="range"
                    className="hl-slider"
                    name="loanAmount"
                    min={100000} max={50000000} step={50000}
                    value={form.loanAmount}
                    onChange={(e) => setForm((p) => ({ ...p, loanAmount: e.target.value }))}
                  />
                  {errors.loanAmount && <span className="hl-field-error">{errors.loanAmount}</span>}
                </div>
                <div className="hl-form-field hl-form-field--full">
                  <label className="hl-field-label">Tenure (years)</label>
                  <div className="hl-slider-label" style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--c-slate)' }}>5 years</span>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--c-orange)' }}>{form.tenure} years</span>
                    <span style={{ fontSize: '13px', color: 'var(--c-slate)' }}>30 years</span>
                  </div>
                  <input
                    type="range"
                    className="hl-slider"
                    min={5} max={30} step={1}
                    value={form.tenure}
                    onChange={(e) => setForm((p) => ({ ...p, tenure: Number(e.target.value) }))}
                  />
                </div>
                <div className="hl-form-field">
                  <label className="hl-field-label">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    className="hl-field-input"
                    value={form.interestRate}
                    readOnly
                    style={{ background: 'var(--c-bg-3)', color: 'var(--c-orange)', fontWeight: '700' }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--c-slate)', marginTop: '4px' }}>Rate auto-filled based on loan type and profile</span>
                </div>
              </div>

              {/* EMI Summary */}
              <div style={{
                background: 'var(--c-navy)',
                borderRadius: 'var(--radius)',
                padding: '28px',
                marginTop: '28px',
                color: '#fff',
              }}>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px', fontWeight: '600', letterSpacing: '.5px', textTransform: 'uppercase' }}>
                  EMI Summary
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Monthly EMI</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--c-orange)' }}>{formatINR(Math.round(emi))}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Total Interest</div>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>{formatINR(Math.round(totalInterest))}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Total Payable</div>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>{formatINR(Math.round(totalPayable))}</div>
                  </div>
                </div>
              </div>

              <div className="hl-form-actions">
                <button className="hl-btn hl-btn--ghost" onClick={prevStep}>← Back</button>
                <button className="hl-btn hl-btn--primary" onClick={nextStep}>Continue →</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 — Document Upload */}
        {currentStep === 5 && (
          <div className="hl-step-card">
            <div className="hl-step-card__header">
              <div className="hl-step-card__num">Step 6 of 7</div>
              <div className="hl-step-card__title">Document Upload</div>
            </div>
            <div className="hl-step-card__body">
              {errors._general && (
                <div style={{ background: 'rgba(220,38,38,.06)', border: '1px solid var(--c-error)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: 'var(--c-error)' }}>
                  ⚠ {errors._general}
                </div>
              )}
              <div className="hl-upload-grid">
                <div className="hl-upload-section-title">📁 Mandatory Documents (All Applicants)</div>
                {MANDATORY_DOCS.map((doc) => (
                  <HomeLoanDocUpload key={doc.key} doc={doc} file={form.files[doc.key]} onFileChange={handleFileChange} />
                ))}

                {form.employmentType && (
                  <>
                    <div className="hl-upload-section-title">
                      💼 {form.employmentType === 'salaried' ? 'Salaried Applicant' : 'Self-Employed / Business'} Documents
                    </div>
                    {employmentTypeDocs.map((doc) => (
                      <HomeLoanDocUpload key={doc.key} doc={doc} file={form.files[doc.key]} onFileChange={handleFileChange} />
                    ))}
                  </>
                )}

                <div className="hl-upload-section-title">🏠 Property Documents</div>
                {PROPERTY_DOCS.map((doc) => (
                  <HomeLoanDocUpload key={doc.key} doc={doc} file={form.files[doc.key]} onFileChange={handleFileChange} />
                ))}
              </div>

              <div style={{ marginTop: '16px', padding: '12px 16px', background: 'var(--c-bg-3)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--c-slate)', lineHeight: '1.6' }}>
                📎 Accepted formats: JPG, PNG, PDF · Max file size: 5MB per document · All uploads are end-to-end encrypted
              </div>

              <div className="hl-form-actions">
                <button className="hl-btn hl-btn--ghost" onClick={prevStep}>← Back</button>
                <button className="hl-btn hl-btn--primary" onClick={nextStep}>Review Application →</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6 — Review & Submit */}
        {currentStep === 6 && (
          <div className="hl-step-card">
            <div className="hl-step-card__header">
              <div className="hl-step-card__num">Step 7 of 7</div>
              <div className="hl-step-card__title">Review & Submit</div>
            </div>
            <div className="hl-step-card__body">
              <div className="hl-review-section">
                <div className="hl-review-section__title">Loan Type</div>
                <div className="hl-review-grid">
                  <div className="hl-review-item">
                    <div className="hl-review-item__key">Selected Loan</div>
                    <div className="hl-review-item__val">{selectedLoan?.name || form.loanType}</div>
                  </div>
                  <div className="hl-review-item">
                    <div className="hl-review-item__key">Interest Rate</div>
                    <div className="hl-review-item__val">{form.interestRate}% p.a.</div>
                  </div>
                </div>
              </div>

              <div className="hl-review-section">
                <div className="hl-review-section__title">Personal Information</div>
                <div className="hl-review-grid">
                  {[
                    ['Full Name', form.fullName],
                    ['Date of Birth', form.dob],
                    ['Gender', form.gender],
                    ['Marital Status', form.maritalStatus || '—'],
                    ['Mobile', form.mobile],
                    ['Email', form.email],
                    ['PAN', form.pan.toUpperCase()],
                    ['Aadhaar', form.aadhaar.slice(0, 4) + ' XXXX ' + form.aadhaar.slice(-4)],
                    ['Address', `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`],
                  ].map(([k, v]) => (
                    <div key={k} className="hl-review-item">
                      <div className="hl-review-item__key">{k}</div>
                      <div className="hl-review-item__val">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hl-review-section">
                <div className="hl-review-section__title">Employment & Income</div>
                <div className="hl-review-grid">
                  {[
                    ['Employment Type', form.employmentType],
                    ['Company / Business', form.companyName],
                    ['Monthly Income', formatINR(form.monthlyIncome)],
                    ['Work Experience', `${form.workExperience} years`],
                    ['Existing EMIs', formatINR(form.existingEMI || 0)],
                  ].map(([k, v]) => (
                    <div key={k} className="hl-review-item">
                      <div className="hl-review-item__key">{k}</div>
                      <div className="hl-review-item__val">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hl-review-section">
                <div className="hl-review-section__title">Property Details</div>
                <div className="hl-review-grid">
                  {[
                    ['Property Type', form.propertyType],
                    ['Loan Purpose', form.loanPurpose],
                    ['Property City', form.propertyCity],
                    ['Property Value', formatINR(form.propertyValue)],
                    ['Property Location', form.propertyLocation],
                  ].map(([k, v]) => (
                    <div key={k} className="hl-review-item">
                      <div className="hl-review-item__key">{k}</div>
                      <div className="hl-review-item__val">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hl-review-section">
                <div className="hl-review-section__title">Loan & EMI Details</div>
                <div className="hl-review-grid">
                  {[
                    ['Loan Amount', formatINR(form.loanAmount)],
                    ['Tenure', `${form.tenure} years`],
                    ['Monthly EMI', formatINR(Math.round(emi))],
                    ['Total Interest', formatINR(Math.round(totalInterest))],
                    ['Total Payable', formatINR(Math.round(totalPayable))],
                  ].map(([k, v]) => (
                    <div key={k} className="hl-review-item">
                      <div className="hl-review-item__key">{k}</div>
                      <div className="hl-review-item__val" style={{ color: k === 'Monthly EMI' ? 'var(--c-orange)' : undefined }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hl-review-section">
                <div className="hl-review-section__title">Documents Uploaded</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(form.files).map(([key, file]) => file && (
                    <span key={key} className="hl-badge hl-badge--green">✓ {file.name}</span>
                  ))}
                  {Object.keys(form.files).length === 0 && <span style={{ fontSize: '13px', color: 'var(--c-slate)' }}>No files uploaded</span>}
                </div>
              </div>

              <div className="hl-declare-row">
                <input
                  type="checkbox"
                  id="declaration"
                  name="declaration"
                  checked={form.declaration}
                  onChange={handleChange}
                />
                <label htmlFor="declaration">
                  I hereby declare that all information provided in this application is true, complete, and accurate to the best of my knowledge. I authorise LoanEase to verify my details and pull my credit report as part of the loan processing.
                </label>
              </div>
              {errors.declaration && <p className="hl-field-error" style={{ marginTop: '8px' }}>{errors.declaration}</p>}

              <div className="hl-form-actions">
                <button className="hl-btn hl-btn--ghost" onClick={prevStep}>← Back</button>
                <button
                  className="hl-btn hl-btn--primary hl-btn--lg"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <><div className="hl-spinner" />Submitting…</>
                  ) : (
                    'Submit Application →'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY */}
      <div className="hl-sticky-apply">
        <button className="hl-btn hl-btn--primary" onClick={currentStep < STEPS.length - 1 ? nextStep : handleSubmit} disabled={submitting}>
          {currentStep < STEPS.length - 1 ? 'Continue →' : 'Submit Application →'}
        </button>
      </div>
    </div>
  );
};

export default HomeLoanApply;
