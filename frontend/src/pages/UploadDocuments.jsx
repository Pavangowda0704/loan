// ============================================================
//  pages/UploadDocuments.jsx — Document Upload UI
//
//  Shows upload cards per document type.
//  On submit, saves document metadata to backend then
//  navigates to success page.
//  Route: /loans/personal/upload/:applicationId
// ============================================================

import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DocumentUploadCard from "../shared/components/DocumentUploadCard";
import { uploadPersonalLoanDocuments } from "../api/personalLoanApi.js";
import "../styles/personalLoan.css";

const salariedDocs = [
  "Aadhaar Card",
  "PAN Card",
  "Latest 3 Salary Slips",
  "6 Months Bank Statement",
  "Form 16 / IT Returns",
  "Employee ID Card",
  "Passport Size Photo",
];

const selfDocs = [
  "Aadhaar Card",
  "PAN Card",
  "GST Registration",
  "Business Proof",
  "Trade License",
  "IT Returns",
  "Business Bank Statements",
  "Company Registration Documents",
  "Passport Size Photo",
];

function UploadDocuments() {
  const { applicationId } = useParams();
  const { state }         = useLocation();
  const navigate          = useNavigate();
  const [loanType, setLoanType] = useState("salaried");
  const [files, setFiles]       = useState({});
  const [submitting, setSubmitting] = useState(false);

  const documents = loanType === "salaried" ? salariedDocs : selfDocs;

  const submitDocuments = async () => {
    setSubmitting(true);
    const documentData = Object.entries(files).map(([name, file]) => ({
      document_name: name,
      file_name:     file.name,
      file_type:     file.type,
    }));

    try {
      await uploadPersonalLoanDocuments(applicationId, documentData);
    } catch {
      // Document save failed silently — don't block success flow
    } finally {
      navigate(
        `/loans/personal/success/${applicationId}`,
        { state: { full_name: state?.full_name, loan_product: state?.loan_product } }
      );
    }
  };

  return (
    <section className="pl-page">
      <div className="pl-apply-card">
        <span className="pl-tag">Upload Documents</span>
        <h1>Upload Required Documents</h1>
        <p style={{ color: "#66738d", marginBottom: 20 }}>
          Application ID: <strong>{applicationId}</strong>
        </p>

        <select
          className="doc-type-select"
          value={loanType}
          onChange={(e) => { setLoanType(e.target.value); setFiles({}); }}
        >
          <option value="salaried">Salaried Personal Loan</option>
          <option value="self-employed">Self-Employed Personal Loan</option>
        </select>

        <div className="document-grid">
          {documents.map((doc) => (
            <DocumentUploadCard
              key={doc}
              title={doc}
              file={files[doc]}
              onChange={(file) => setFiles({ ...files, [doc]: file })}
            />
          ))}
        </div>

        <p style={{ color: "#66738d", fontSize: 13, textAlign: "center", marginTop: 8 }}>
          Documents not uploaded can be submitted later. Click below to continue.
        </p>

        <button
          className="pl-primary-btn full-btn"
          onClick={submitDocuments}
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit Application →"}
        </button>
      </div>
    </section>
  );
}

export default UploadDocuments;
