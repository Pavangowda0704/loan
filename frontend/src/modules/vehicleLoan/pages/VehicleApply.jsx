// ============================================================
//  pages/VehicleLoanApply.jsx — 4-Step Vehicle Loan Form
//
//  Step 1: Personal Information
//  Step 2: Vehicle Information
//  Step 3: Loan Details
//  Step 4: Review & Submit
//
//  On submit → POST /api/vehicle-loans
//           → navigates to /vehicle-loan/success/:applicationId
// ============================================================

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApplicationStepper from "../../../shared/components/ApplicationStepper.jsx";
import { createVehicleLoanApplication } from "../../../api/vehicleLoanApi.js";

import "../vehicleLoan.css";

const VEHICLE_TYPES = [
  "New Car Purchase Loan",
  "Used Car Loan",
  "Used Bike Loan",
  "Commercial Vehicle Loan",
  "Agriculture Equipment Loan",
];

function VehicleLoanApply() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    // Step 1 — Personal
    full_name:        params.get("name") || "",
    phone:            params.get("phone") || "",
    email:            "",
    dob:              "",
    pan_number:       "",
    city:             params.get("city") || "",
    // Step 2 — Vehicle
    vehicle_type:     params.get("type") || "New Car Purchase Loan",
    vehicle_condition: params.get("condition") || "New",
    vehicle_price:    params.get("price") || "",
    down_payment:     params.get("dp") || "",
    // Step 3 — Loan
    loan_amount:      params.get("amount") || "",
    monthly_income:   params.get("income") || "",
    employment_type:  "Salaried",
    tenure:           "36",
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      if (!form.vehicle_type || !form.vehicle_price) {
        alert("Please fill vehicle type and vehicle price"); return false;
      }
    }
    if (step === 3) {
      if (!form.loan_amount || !form.monthly_income || !form.tenure) {
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
        pan_number: form.pan_number.toUpperCase(),
        vehicle_price:  Number(form.vehicle_price)  || 0,
        down_payment:   Number(form.down_payment)   || 0,
        loan_amount:    Number(form.loan_amount),
        monthly_income: Number(form.monthly_income),
      };
      const res = await createVehicleLoanApplication(payload);
      navigate(`/vehicle-loan/success/${res.data.application_id}`, {
        state: { full_name: form.full_name, vehicle_type: form.vehicle_type },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const STEP_LABELS = ["Personal Info", "Vehicle Info", "Loan Details", "Review"];

  const reviewRows = [
    ["Full Name",         form.full_name],
    ["Phone",             form.phone],
    ["Email",             form.email],
    ["Date of Birth",     form.dob || "—"],
    ["PAN Number",        form.pan_number.toUpperCase()],
    ["City",              form.city],
    ["Vehicle Type",      form.vehicle_type],
    ["Vehicle Condition", form.vehicle_condition],
    ["Vehicle Price",     form.vehicle_price ? `₹${Number(form.vehicle_price).toLocaleString("en-IN")}` : "—"],
    ["Down Payment",      form.down_payment ? `₹${Number(form.down_payment).toLocaleString("en-IN")}` : "—"],
    ["Loan Amount",       `₹${Number(form.loan_amount).toLocaleString("en-IN")}`],
    ["Monthly Income",    `₹${Number(form.monthly_income).toLocaleString("en-IN")}`],
    ["Employment Type",   form.employment_type],
    ["Tenure",            `${form.tenure} months`],
  ];

  return (
    <section className="pl-page">
      <div className="pl-apply-card">
        <span className="pl-tag">Vehicle Loan Application</span>
        <h1>Apply for Vehicle Loan</h1>

        {/* Step labels */}
        <div className="vl-step-bar">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className={`vl-step-item ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}>
              <div className="vl-step-circle">{step > i + 1 ? "✓" : i + 1}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Step 1 — Personal */}
        {step === 1 && (
          <div className="pl-form-grid">
            <input name="full_name"  placeholder="Full Name *"      value={form.full_name}  onChange={handle} />
            <input name="phone"      placeholder="Mobile Number *"  value={form.phone}      onChange={handle} maxLength={10} />
            <input name="email"      placeholder="Email Address *"  value={form.email}      onChange={handle} />
            <input name="dob"        type="date"                    value={form.dob}        onChange={handle} />
            <input name="pan_number" placeholder="PAN Number *"     value={form.pan_number} onChange={handle} />
            <input name="city"       placeholder="City *"           value={form.city}       onChange={handle} />
          </div>
        )}

        {/* Step 2 — Vehicle */}
        {step === 2 && (
          <div className="pl-form-grid">
            <select name="vehicle_type" value={form.vehicle_type} onChange={handle}>
              {VEHICLE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select name="vehicle_condition" value={form.vehicle_condition} onChange={handle}>
              <option value="New">New Vehicle</option>
              <option value="Used">Used Vehicle</option>
            </select>
            <input name="vehicle_price" placeholder="Vehicle Price (₹) *" type="number" value={form.vehicle_price} onChange={handle} />
            <input name="down_payment"  placeholder="Down Payment (₹)"    type="number" value={form.down_payment}  onChange={handle} />
          </div>
        )}

        {/* Step 3 — Loan Details */}
        {step === 3 && (
          <div className="pl-form-grid">
            <input name="loan_amount"    placeholder="Required Loan Amount (₹) *" type="number" value={form.loan_amount}    onChange={handle} />
            <input name="monthly_income" placeholder="Monthly Income (₹) *"       type="number" value={form.monthly_income} onChange={handle} />
            <select name="employment_type" value={form.employment_type} onChange={handle}>
              <option>Salaried</option>
              <option>Self-Employed</option>
              <option>Business Owner</option>
              <option>Farmer</option>
            </select>
            <select name="tenure" value={form.tenure} onChange={handle}>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
              <option value="48">48 months</option>
              <option value="60">60 months</option>
              <option value="72">72 months</option>
              <option value="84">84 months</option>
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

export default VehicleLoanApply;
