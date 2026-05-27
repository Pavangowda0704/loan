import { Link } from "react-router-dom";
import "../personalLoan.css";

function PersonalLoan() {
  return (
    <section className="pl-page">
      <div className="pl-hero">
        <div>
          <span className="pl-tag">Personal Loan</span>
          <h1>Quick funds for your personal needs</h1>
          <p>
            Simple documentation, expert support, quick eligibility checking and
            a smooth digital loan application process.
          </p>

          <div className="pl-actions">
            <Link to="/loans/personal/eligibility" className="pl-primary-btn">
              Check Eligibility
            </Link>
            <Link to="/loans/personal/apply" className="pl-secondary-btn">
              Apply Now
            </Link>
          </div>
        </div>

        <div className="pl-highlight-card">
          <h3>Loan Highlights</h3>
          <ul>
            <li>Minimal documentation</li>
            <li>Quick approval</li>
            <li>Flexible repayment</li>
            <li>No collateral required</li>
          </ul>
        </div>
      </div>

      <div className="pl-product-grid">
        <div className="pl-card">
          <span>For employees</span>
          <h2>Salaried Personal Loan</h2>
          <p>
            Best for private, government, or company employees with fixed
            monthly income.
          </p>
          <Link to="/loans/personal/eligibility?type=salaried">
            Check Eligibility
          </Link>
        </div>

        <div className="pl-card">
          <span>For business owners</span>
          <h2>Self-Employed Personal Loan</h2>
          <p>
            Best for freelancers, shop owners, business owners and independent
            professionals.
          </p>
          <Link to="/loans/personal/eligibility?type=self-employed">
            Check Eligibility
          </Link>
        </div>
      </div>

      <div className="pl-section">
        <h2>Benefits</h2>
        <div className="pl-benefits">
          {[
            "Minimal documentation",
            "Quick approval",
            "Flexible repayment",
            "No collateral required",
            "Digital process",
            "Expert assistance",
          ].map((item) => (
            <div className="pl-benefit" key={item}>
              ✓ {item}
            </div>
          ))}
        </div>
      </div>

      <div className="pl-section">
        <h2>Required Documents</h2>
        <div className="pl-doc-grid">
          <div>
            <h3>Salaried</h3>
            <p>Aadhaar, PAN, Salary slips, Bank statement, Form 16, Employee ID.</p>
          </div>
          <div>
            <h3>Self-Employed</h3>
            <p>
              Aadhaar, PAN, GST, Business proof, IT returns, Bank statements,
              Trade license.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PersonalLoan;