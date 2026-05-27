// ============================================================
//  pages/VehicleLoanSuccess.jsx
//
//  Shown after a vehicle loan application is submitted.
//  Displays real application ID from backend + applicant details.
//  Route: /vehicle-loan/success/:applicationId
// ============================================================

import { Link, useParams, useLocation } from "react-router-dom";
import "../styles/personalLoan.css";
import "../styles/vehicleLoan.css";

function VehicleLoanSuccess() {
  const { applicationId } = useParams();
  const { state } = useLocation();

  const name        = state?.full_name    || "Applicant";
  const vehicleType = state?.vehicle_type || "Vehicle Loan";

  return (
    <section className="pl-page">
      <div className="success-card" style={{ maxWidth: 640, margin: "0 auto" }}>
        <div className="success-icon">✓</div>
        <h1>Application Submitted!</h1>
        <p>
          Your vehicle loan application has been received. Our team will review
          it and contact you within 24–48 hours.
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
            <span>Loan Type</span>
            <strong>{vehicleType}</strong>
          </div>
          <div className="success-detail-row">
            <span>Submitted Date</span>
            <strong>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</strong>
          </div>
          <div className="success-detail-row">
            <span>Status</span>
            <strong className="status-badge pending">Pending</strong>
          </div>
        </div>

        <p className="vl-success-note">
          Save your Application ID <strong>{applicationId}</strong> to track your
          application status.
        </p>

        <div className="pl-actions center">
          <Link to="/" className="pl-secondary-btn">← Go to Home</Link>
          <Link
            to={`/track-application/${applicationId}?type=vehicle`}
            className="pl-primary-btn"
          >
            Track Application →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default VehicleLoanSuccess;
