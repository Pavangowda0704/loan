// ============================================================
//  pages/TrackApplication.jsx — Application Status Tracker
//
//  Works for both Personal Loan (PLN...) and Vehicle Loan (VLN...)
//  Detects loan type from application ID prefix.
//  Route: /track-application/:applicationId
// ============================================================

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPersonalLoanById } from "../api/personalLoanApi.js";
import { getVehicleLoanById }  from "../api/vehicleLoanApi.js";
import "../styles/personalLoan.css";

const TIMELINE_STEPS = [
  "Application Submitted",
  "Pending",
  "Under Review",
  "Document Verification",
  "Approved",
  "Disbursed",
];

const STATUS_ORDER = {
  "Application Submitted":  0,
  "Pending":                1,
  "Under Review":           2,
  "Document Verification":  3,
  "Approved":               4,
  "Rejected":               4,
  "Disbursed":              5,
};

const STATUS_COLOR = {
  Pending:               "#f59e0b",
  "Under Review":        "#3b82f6",
  "Document Verification": "#8b5cf6",
  Approved:              "#10b981",
  Rejected:              "#ef4444",
  Disbursed:             "#059669",
};

function TrackApplication() {
  const { applicationId } = useParams();
  const [searchParams]    = useSearchParams();
  const [app, setApp]     = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isVehicle =
      applicationId.startsWith("VLN") || searchParams.get("type") === "vehicle";

    const fetcher = isVehicle ? getVehicleLoanById : getPersonalLoanById;

    fetcher(applicationId)
      .then((res) => setApp(res.data))
      .catch(() => setError("Application not found. Please check your Application ID."))
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (loading) return <section className="pl-page"><p className="track-loading">Loading…</p></section>;
  if (error)   return <section className="pl-page"><p style={{ color: "red", padding: 32 }}>{error}</p></section>;

  const currentStatus = app.status || "Pending";
  const activeIndex   = STATUS_ORDER[currentStatus] ?? 1;
  const isRejected    = currentStatus === "Rejected";

  const isVehicle = applicationId.startsWith("VLN");
  const loanLabel = isVehicle
    ? app.vehicle_type || "Vehicle Loan"
    : app.loan_product || "Personal Loan";

  return (
    <section className="pl-page">
      <div className="track-card" style={{ maxWidth: 760, margin: "0 auto" }}>
        <span className="pl-tag">Track Application</span>
        <h1>Application Status</h1>

        {/* Summary */}
        <div className="track-summary">
          <div className="track-row">
            <span>Application ID</span>
            <strong>{app.application_id}</strong>
          </div>
          <div className="track-row">
            <span>Applicant Name</span>
            <strong>{app.full_name}</strong>
          </div>
          <div className="track-row">
            <span>Mobile</span>
            <strong>{app.phone || app.mobile}</strong>
          </div>
          <div className="track-row">
            <span>Loan Type</span>
            <strong>{loanLabel}</strong>
          </div>
          <div className="track-row">
            <span>Loan Amount</span>
            <strong>
              ₹{Number(app.loan_amount || app.required_amount || 0).toLocaleString("en-IN")}
            </strong>
          </div>
          <div className="track-row">
            <span>Current Status</span>
            <strong
              className="status-badge"
              style={{ color: STATUS_COLOR[currentStatus] || "#071b46" }}
            >
              {currentStatus}
            </strong>
          </div>
          {app.remarks && (
            <div className="track-row">
              <span>Remarks</span>
              <strong>{app.remarks}</strong>
            </div>
          )}
          <div className="track-row">
            <span>Applied On</span>
            <strong>
              {new Date(app.created_at).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
              })}
            </strong>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline">
          {TIMELINE_STEPS.map((item, index) => {
            const isDone     = index <= activeIndex && !isRejected;
            const isRejStep  = isRejected && index === activeIndex;
            return (
              <div
                key={item}
                className={`timeline-item ${isDone ? "done" : ""} ${isRejStep ? "rejected-step" : ""}`}
              >
                <span className="timeline-circle">
                  {isDone ? "✓" : isRejStep ? "✗" : index + 1}
                </span>
                <div>
                  <h4>{isRejStep ? "Rejected" : item}</h4>
                  <p>
                    {isDone
                      ? "Completed"
                      : isRejStep
                      ? "Application was rejected"
                      : "Pending"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrackApplication;
