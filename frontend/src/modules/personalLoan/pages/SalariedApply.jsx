// ============================================================
//  SalariedApply.jsx — Multi-step Salaried Personal Loan Form
//  Route: /personal-loan/salaried/apply
// ============================================================
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPersonalLoan } from "../../../api/personalLoanApi.js";
import "../personalLoan.css";

const STEPS = ["Personal Details", "Employment Details", "Loan Details", "Review & Submit"];

const initialForm = {
  full_name: "", phone: "", email: "", dob: "", pan_number: "", city: "",
  employment_type: "Salaried", company_name: "", monthly_income: "",
  work_experience: "", existing_emi: "",
  loan_product: "Salaried Personal Loan", loan_amount: "", tenure: "36", loan_purpose: "Medical",
};

export default function SalariedApply() {
  const [step, setStep]           = useState(1);
  const [form, setForm]           = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const navigate                  = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (step === 1) {
      if (!form.full_name || !form.phone || !form.email || !form.pan_number || !form.city) return alert("Fill all personal details"), false;
      if (!/^[0-9]{10}$/.test(form.phone)) return alert("Mobile must be 10 digits"), false;
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(form.pan_number)) return alert("Invalid PAN format"), false;
    }
    if (step === 2) {
      if (!form.company_name || !form.monthly_income) return alert("Fill company name and income"), false;
    }
    if (step === 3) {
      if (!form.loan_amount || !form.tenure) return alert("Fill loan amount and tenure"), false;
    }
    return true;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await createPersonalLoan({
        ...form,
        pan_number: form.pan_number.toUpperCase(),
        loan_amount: +form.loan_amount,
        monthly_income: +form.monthly_income,
        existing_emi: +form.existing_emi || 0,
        tenure: +form.tenure,
      });
      navigate(`/loans/personal/upload/${res.data.application_id}`, {
        state: { full_name: form.full_name, loan_product: form.loan_product }
      });
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reviewRows = [
    ["Full Name", form.full_name], ["Phone", form.phone], ["Email", form.email],
    ["PAN", form.pan_number.toUpperCase()], ["City", form.city],
    ["Company", form.company_name],
    ["Monthly Income", form.monthly_income ? `₹${Number(form.monthly_income).toLocaleString("en-IN")}` : "—"],
    ["Loan Product", form.loan_product],
    ["Loan Amount", form.loan_amount ? `₹${Number(form.loan_amount).toLocaleString("en-IN")}` : "—"],
    ["Tenure", form.tenure ? `${form.tenure} months` : "—"],
    ["Purpose", form.loan_purpose],
  ];

  return (
    <div className="pl-new-page">
      <div className="pl-breadcrumb">
        <Link to="/">Home</Link> <span>›</span>
        <Link to="/personal-loan">Personal Loan</Link> <span>›</span>
        <Link to="/personal-loan/salaried">Salaried Loan</Link> <span>›</span>
        <span>Apply</span>
      </div>

      <div className="pl-apply-wrapper">
        <div className="pl-apply-header">
          <span className="pl-tag">SALARIED PERSONAL LOAN</span>
          <h1>Apply for Personal Loan</h1>
          <p>Complete the form below — takes just 5 minutes</p>
        </div>

        {/* Stepper */}
        <div className="pl-stepper-new">
          {STEPS.map((s, i) => (
            <div key={s} className={`pl-step-new${step > i+1 ? " done" : step === i+1 ? " active" : ""}`}>
              <div className="pl-step-circle">{step > i+1 ? "✓" : i+1}</div>
              <span>{s}</span>
              {i < STEPS.length - 1 && <div className="pl-step-connector" />}
            </div>
          ))}
        </div>

        <div className="pl-apply-card-new">
          {step === 1 && (
            <>
              <h3>Personal Details</h3>
              <div className="pl-form-grid">
                <input name="full_name" placeholder="Full Name *" value={form.full_name} onChange={handleChange} />
                <input name="phone" placeholder="Mobile Number *" value={form.phone} onChange={handleChange} maxLength={10} />
                <input name="email" placeholder="Email Address *" type="email" value={form.email} onChange={handleChange} />
                <input name="dob" type="date" value={form.dob} onChange={handleChange} placeholder="Date of Birth" />
                <input name="pan_number" placeholder="PAN Number *" value={form.pan_number} onChange={handleChange} />
                <input name="city" placeholder="City *" value={form.city} onChange={handleChange} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3>Employment Details</h3>
              <div className="pl-form-grid">
                <input name="company_name" placeholder="Company Name *" value={form.company_name} onChange={handleChange} />
                <input name="monthly_income" type="number" placeholder="Monthly Income (₹) *" value={form.monthly_income} onChange={handleChange} />
                <input name="work_experience" placeholder="Total Work Experience (e.g. 3 years)" value={form.work_experience} onChange={handleChange} />
                <input name="existing_emi" type="number" placeholder="Existing Monthly EMI (₹)" value={form.existing_emi} onChange={handleChange} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3>Loan Details</h3>
              <div className="pl-form-grid">
                <input name="loan_amount" type="number" placeholder="Required Loan Amount (₹) *" value={form.loan_amount} onChange={handleChange} />
                <select name="tenure" value={form.tenure} onChange={handleChange}>
                  {[12,18,24,36,48,60].map(t => <option key={t} value={t}>{t} Months</option>)}
                </select>
                <select name="loan_purpose" value={form.loan_purpose} onChange={handleChange}>
                  {["Medical","Education","Travel","Marriage","Home Renovation","Business","Other"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h3>Review Your Application</h3>
              <div className="pl-review-grid">
                {reviewRows.map(([l, v]) => (
                  <div key={l} className="review-row">
                    <span className="review-label">{l}</span>
                    <span className="review-val">{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="pl-form-actions">
            {step > 1 && <button className="pl-secondary-btn" onClick={() => setStep(s => s - 1)}>← Previous</button>}
            {step < 4
              ? <button className="pl-primary-btn" onClick={next}>Next Step →</button>
              : <button className="pl-primary-btn" onClick={submit} disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Application ✓"}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}