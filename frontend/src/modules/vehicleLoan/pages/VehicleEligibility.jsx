import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import "../vehicleLoan.css";

const VEHICLE_TYPES = [
  "New Car Purchase Loan",
  "Used Car Loan",
  "Used Bike Loan",
  "Commercial Vehicle Loan",
  "Agriculture Equipment Loan",
];

const typeMap = {
  "new-car":     "New Car Purchase Loan",
  "used-car":    "Used Car Loan",
  "used-bike":   "Used Bike Loan",
  commercial:    "Commercial Vehicle Loan",
  agriculture:   "Agriculture Equipment Loan",
};

function VehicleEligibility() {
  const [params] = useSearchParams();
  const defaultType = typeMap[params.get("type")] || "New Car Purchase Loan";

  const [form, setForm] = useState({
    fullName:       "",
    phone:          "",
    monthlyIncome:  "",
    vehicleType:    defaultType,
    vehicleCondition: "New",
    vehiclePrice:   "",
    downPayment:    "",
    loanAmount:     "",
    city:           "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const checkEligibility = (e) => {
    e.preventDefault();

    const { fullName, phone, monthlyIncome, vehicleType, vehiclePrice, loanAmount, city } = form;

    if (!fullName || !phone || !monthlyIncome || !vehicleType || !loanAmount || !city) {
      alert("Please fill all required fields");
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Mobile number must be 10 digits");
      return;
    }

    const income = Number(monthlyIncome);
    const eligible = income >= 20000;
    const estimatedAmount = eligible ? income * 18 : 0;

    setResult({ eligible, estimatedAmount, income });
  };

  const applyLink = `/vehicle-loan/apply?type=${encodeURIComponent(form.vehicleType)}&name=${encodeURIComponent(form.fullName)}&phone=${encodeURIComponent(form.phone)}&income=${form.monthlyIncome}&city=${encodeURIComponent(form.city)}&condition=${form.vehicleCondition}&price=${form.vehiclePrice}&dp=${form.downPayment}&amount=${form.loanAmount}`;

  return (
    <section className="pl-page">
      <div className="pl-form-layout">
        <form className="pl-form-card" onSubmit={checkEligibility}>
          <span className="pl-tag">Eligibility Check</span>
          <h1>Check Vehicle Loan Eligibility</h1>

          <div className="pl-form-grid">
            <input
              name="fullName"
              placeholder="Full Name *"
              value={form.fullName}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Mobile Number *"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
            />
            <input
              name="monthlyIncome"
              placeholder="Monthly Income (₹) *"
              type="number"
              value={form.monthlyIncome}
              onChange={handleChange}
            />
            <select
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
            >
              {VEHICLE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select
              name="vehicleCondition"
              value={form.vehicleCondition}
              onChange={handleChange}
            >
              <option value="New">New Vehicle</option>
              <option value="Used">Used Vehicle</option>
            </select>
            <input
              name="vehiclePrice"
              placeholder="Vehicle Price (₹)"
              type="number"
              value={form.vehiclePrice}
              onChange={handleChange}
            />
            <input
              name="downPayment"
              placeholder="Down Payment (₹)"
              type="number"
              value={form.downPayment}
              onChange={handleChange}
            />
            <input
              name="loanAmount"
              placeholder="Required Loan Amount (₹) *"
              type="number"
              value={form.loanAmount}
              onChange={handleChange}
            />
            <input
              name="city"
              placeholder="City *"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          <button className="pl-primary-btn" type="submit">
            Check Eligibility
          </button>
        </form>

        {result && (
          <div className="pl-result-card">
            {result.eligible ? (
              <>
                <div className="success-icon">✓</div>
                <h2>Congratulations! You are eligible</h2>
                <h1>₹{result.estimatedAmount.toLocaleString("en-IN")}</h1>
                <p>Estimated maximum eligible amount</p>
                <p className="vl-result-note">
                  Based on your monthly income of ₹{Number(result.income).toLocaleString("en-IN")}
                </p>
                <Link to={applyLink} className="pl-primary-btn" style={{ marginTop: 16 }}>
                  Apply Now →
                </Link>
              </>
            ) : (
              <>
                <div className="warning-icon">!</div>
                <h2>Not Eligible at this time</h2>
                <p>
                  Minimum monthly income required is ₹20,000. You may apply
                  with a co-applicant or increase your income for better
                  eligibility.
                </p>
                <Link to="/vehicle-loan" className="pl-secondary-btn" style={{ marginTop: 16 }}>
                  ← Back to Vehicle Loan
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default VehicleEligibility;
