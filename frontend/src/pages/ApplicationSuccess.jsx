// ============================================================
//  pages/ApplicationSuccess.jsx — Personal Loan Success
//
//  Shows real application ID + applicant details from backend.
//  Route: /loans/personal/success/:applicationId
// ============================================================

import { Link, useParams, useLocation } from "react-router-dom";
import "../styles/personalLoan.css";

function ApplicationSuccess() {
  const { applicationId } = useParams();
  const { state } = useLocation();

  const name        = state?.full_name    || "Applicant";
  const loanProduct = state?.loan_product || "Personal Loan";

  return (
    <section className="pl-page">
      <div className="success-card" style={{ maxWidth: 640, margin: "0 auto" }}>
        <div className="success-icon">✓</div>
        <h1>Application Submitted!</h1>
        <p>
          Your personal loan application has been received. Our team will
          review it and reach out within 24–48 hours.
        </p>

        <div className="success-details">
          <div className="success-detail-row">
            <span>Application ID</span>
            <strong>{applicationId}</strong>
          </div>
          <div className="success-detail-row">
            <span>Applicant Name</span>
            <strong>{name}</strong>
          </div>
          <div className="success-detail-row">
            <span>Loan Product</span>
            <strong>{loanProduct}</strong>
          </div>
          <div className="success-detail-row">
            <span>Submitted Date</span>
            <strong>
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </div>
          <div className="success-detail-row">
            <span>Status</span>
            <strong className="status-badge pending">Pending</strong>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 12, color: "#66738d", fontSize: 14 }}>
          Save your Application ID <strong>{applicationId}</strong> to track
          your application status anytime.
        </p>

        <div className="pl-actions center">
          <Link to="/" className="pl-secondary-btn">← Go to Home</Link>
          <Link
            to={`/track-application/${applicationId}`}
            className="pl-primary-btn"
          >
            Track Application →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ApplicationSuccess;
