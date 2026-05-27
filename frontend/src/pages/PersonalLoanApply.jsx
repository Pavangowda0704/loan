// ============================================================
//  pages/PersonalLoanApply.jsx — 4-Step Personal Loan Form
//
//  Step 1: Personal Info   (name, mobile, email, dob, pan, city)
//  Step 2: Employment Info (type, company, income, experience, emi)
//  Step 3: Loan Details    (product, amount, tenure, purpose)
//  Step 4: Review & Submit
//
//  On submit → POST /api/personal-loans
//           → navigates to /loans/personal/upload/:applicationId
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationStepper from "../components/ApplicationStepper.jsx";
import { createPersonalLoan } from "../api/personalLoanApi.js";
import "../styles/personalLoan.css";

const initialForm = {
  full_name:        "",
  phone:            "",
  email:            "",
  dob:              "",
  pan_number:       "",
  city:             "",
  employment_type:  "Salaried",
  company_name:     "",
  monthly_income:   "",
  work_experience:  "",
  existing_emi:     "",
  loan_product:     "Salaried Personal Loan",
  loan_amount:      "",
  tenure:           "",
  loan_purpose:     "Medical",
};

function PersonalLoanApply() {
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const navigate              = useNavigate();

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === "employment_type") {
      updated.loan_product =
        e.target.value === "Salaried"
          ? "Salaried Personal Loan"
          : "Self-Employed Personal Loan";
    }
    setForm(updated);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!form.full_name || !form.phone || !form.email || !form.pan_number || !form.city) {
        alert("Please fill all personal information fields"); return false;
      }
      if (!/^[0-9]{10}$/.test(form.phone)) {
        alert("Mobile number must be exactly 10 digits"); return false;
      }
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(form.pan_number)) {
        alert("Enter a valid PAN number (e.g. ABCDE1234F)"); return false;
      }
    }
    if (step === 2) {
      if (!form.company_name || !form.monthly_income) {
        alert("Please fill company name and monthly income"); return false;
      }
    }
    if (step === 3) {
      if (!form.loan_amount || !form.tenure || !form.loan_purpose) {
        alert("Please fill all loan detail fields"); return false;
      }
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(step + 1); };

  const submitApplication = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        pan_number:     form.pan_number.toUpperCase(),
        loan_amount:    Number(form.loan_amount),
        monthly_income: Number(form.monthly_income),
        existing_emi:   Number(form.existing_emi) || 0,
      };
      const res = await createPersonalLoan(payload);
      navigate(
        `/loans/personal/upload/${res.data.application_id}`,
        { state: { full_name: form.full_name, loan_product: form.loan_product } }
      );
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reviewRows = [
    ["Full Name",        form.full_name],
    ["Phone",            form.phone],
    ["Email",            form.email],
    ["Date of Birth",    form.dob || "—"],
    ["PAN Number",       form.pan_number.toUpperCase()],
    ["City",             form.city],
    ["Employment Type",  form.employment_type],
    ["Company / Business", form.company_name],
    ["Monthly Income",   form.monthly_income ? `₹${Number(form.monthly_income).toLocaleString("en-IN")}` : "—"],
    ["Work Experience",  form.work_experience || "—"],
    ["Existing EMI",     form.existing_emi ? `₹${Number(form.existing_emi).toLocaleString("en-IN")}` : "—"],
    ["Loan Product",     form.loan_product],
    ["Loan Amount",      form.loan_amount ? `₹${Number(form.loan_amount).toLocaleString("en-IN")}` : "—"],
    ["Tenure",           form.tenure ? `${form.tenure} months` : "—"],
    ["Purpose",          form.loan_purpose],
  ];

  return (
    <section className="pl-page">
      <div className="pl-apply-card">
        <span className="pl-tag">Personal Loan Application</span>
        <h1>Apply for Personal Loan</h1>

        <ApplicationStepper currentStep={step} />

        {/* Step 1 — Personal Info */}
        {step === 1 && (
          <div className="pl-form-grid">
            <input name="full_name"  placeholder="Full Name *"      value={form.full_name}  onChange={handleChange} />
            <input name="phone"      placeholder="Mobile Number *"  value={form.phone}      onChange={handleChange} maxLength={10} />
            <input name="email"      placeholder="Email Address *"  value={form.email}      onChange={handleChange} />
            <input name="dob"        type="date"                    value={form.dob}        onChange={handleChange} />
            <input name="pan_number" placeholder="PAN Number *"     value={form.pan_number} onChange={handleChange} />
            <input name="city"       placeholder="City *"           value={form.city}       onChange={handleChange} />
          </div>
        )}

        {/* Step 2 — Employment Info */}
        {step === 2 && (
          <div className="pl-form-grid">
            <select name="employment_type" value={form.employment_type} onChange={handleChange}>
              <option>Salaried</option>
              <option>Self-Employed</option>
            </select>
            <input name="company_name"    placeholder="Company / Business Name *" value={form.company_name}    onChange={handleChange} />
            <input name="monthly_income"  placeholder="Monthly Income (₹) *"      type="number" value={form.monthly_income}  onChange={handleChange} />
            <input name="work_experience" placeholder="Work Experience (e.g. 3 years)" value={form.work_experience} onChange={handleChange} />
            <input name="existing_emi"    placeholder="Existing Monthly EMI (₹)"   type="number" value={form.existing_emi}    onChange={handleChange} />
          </div>
        )}

        {/* Step 3 — Loan Details */}
        {step === 3 && (
          <div className="pl-form-grid">
            <select name="loan_product" value={form.loan_product} onChange={handleChange}>
              <option>Salaried Personal Loan</option>
              <option>Self-Employed Personal Loan</option>
            </select>
            <input name="loan_amount" placeholder="Required Loan Amount (₹) *" type="number" value={form.loan_amount}  onChange={handleChange} />
            <input name="tenure"      placeholder="Tenure (in months) *"        type="number" value={form.tenure}       onChange={handleChange} />
            <select name="loan_purpose" value={form.loan_purpose} onChange={handleChange}>
              <option>Medical</option>
              <option>Education</option>
              <option>Travel</option>
              <option>Marriage</option>
              <option>Home Renovation</option>
              <option>Business</option>
              <option>Other</option>
            </select>
          </div>
        )}

        {/* Step 4 — Review */}
        {step === 4 && (
          <div className="review-box">
            <h3 style={{ marginBottom: 16, color: "#071b46" }}>Review Your Application</h3>
            {reviewRows.map(([label, val]) => (
              <div className="review-row" key={label}>
                <span className="review-label">{label}</span>
                <span className="review-val">{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="pl-form-actions">
          {step > 1 && (
            <button className="pl-secondary-btn" onClick={() => setStep(step - 1)}>
              ← Previous
            </button>
          )}
          {step < 4 ? (
            <button className="pl-primary-btn" onClick={nextStep}>
              Next →
            </button>
          ) : (
            <button
              className="pl-primary-btn"
              onClick={submitApplication}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default PersonalLoanApply;
