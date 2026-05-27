import { Link } from "react-router-dom";
import "./PersonalLoanHome.css";

function PersonalLoanHome() {
  return (
    <section className="personal-loan-page">
      <div className="personal-hero">
        <div className="personal-hero-content">
          <p className="section-tag">Personal Loan</p>

          <h1>Choose the right personal loan for your need</h1>

          <p>
            Get quick loan assistance with simple eligibility, document guidance,
            flexible repayment options, and easy application tracking.
          </p>

          <div className="personal-hero-actions">
            <Link to="/loans/personal/salaried" className="primary-btn">
              Salaried Personal Loan
            </Link>

            <Link to="/loans/personal/self-employed" className="secondary-btn">
              Self-Employed Loan
            </Link>
          </div>
        </div>

        <div className="personal-summary-card">
          <h3>Loan Highlights</h3>

          <ul>
            <li>Quick eligibility check</li>
            <li>Minimal documents</li>
            <li>Flexible repayment options</li>
            <li>Expert loan assistance</li>
          </ul>

          <div className="personal-stats">
            <div className="personal-stat-box">
              <strong>₹25L</strong>
              <span>Loan support</span>
            </div>

            <div className="personal-stat-box">
              <strong>24h</strong>
              <span>Quick process</span>
            </div>
          </div>
        </div>
      </div>

      <div className="loan-option-grid">
        <div className="loan-option-card">
          <span className="loan-card-badge">For employees</span>
          <h2>Salaried Personal Loan</h2>

          <p>
            Best for private, government, or company employees who receive a
            fixed monthly salary.
          </p>

          <ul>
            <li>Salary proof required</li>
            <li>Bank statement required</li>
            <li>Fast approval support</li>
          </ul>

          <Link to="/loans/personal/salaried" className="option-btn">
            View Details
          </Link>
        </div>

        <div className="loan-option-card">
          <span className="loan-card-badge">For business owners</span>
          <h2>Self-Employed Personal Loan</h2>

          <p>
            Best for business owners, freelancers, shop owners, and working
            professionals without fixed salary slips.
          </p>

          <ul>
            <li>Business proof required</li>
            <li>Income proof required</li>
            <li>Flexible documentation guidance</li>
          </ul>

          <Link to="/loans/personal/self-employed" className="option-btn">
            View Details
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PersonalLoanHome;