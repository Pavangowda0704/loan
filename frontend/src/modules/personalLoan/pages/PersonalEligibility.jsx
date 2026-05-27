import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../personalLoan.css";

function PersonalEligibility() {
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    monthlyIncome: "",
    employmentType: params.get("type") || "salaried",
    city: "",
    loanAmount: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkEligibility = (e) => {
    e.preventDefault();

    const income = Number(form.monthlyIncome);

    if (!form.fullName || !form.phone || !form.monthlyIncome || !form.city) {
      alert("Please fill all required fields");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      alert("Mobile number must be 10 digits");
      return;
    }

    if (income >= 25000) {
      setResult({
        eligible: true,
        amount: income * 15,
      });
    } else {
      setResult({
        eligible: false,
        amount: 0,
      });
    }
  };

  return (
    <section className="pl-page">
      <div className="pl-form-layout">
        <form className="pl-form-card" onSubmit={checkEligibility}>
          <span className="pl-tag">Eligibility Check</span>
          <h1>Check Your Personal Loan Eligibility</h1>

          <div className="pl-form-grid">
            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Mobile Number"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              name="monthlyIncome"
              placeholder="Monthly Income"
              value={form.monthlyIncome}
              onChange={handleChange}
            />

            <select
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
            >
              <option value="salaried">Salaried</option>
              <option value="self-employed">Self-Employed</option>
            </select>

            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />

            <input
              name="loanAmount"
              placeholder="Required Loan Amount"
              value={form.loanAmount}
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
                <h2>Great! You are eligible</h2>
                <h1>₹{result.amount.toLocaleString("en-IN")}</h1>
                <p>Estimated eligible amount</p>
                <Link to="/loans/personal/apply" className="pl-primary-btn">
                  Apply Now
                </Link>
              </>
            ) : (
              <>
                <div className="warning-icon">!</div>
                <h2>Need Support</h2>
                <p>
                  You may need higher income or co-applicant support for better
                  eligibility.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default PersonalEligibility;