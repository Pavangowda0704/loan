// ============================================================
//  VehicleDocumentsNew.jsx — Document Upload Page
//  Route: /vehicle-loan/documents/:applicationId
// ============================================================
import { useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import "../vehicleLoan.css";

// ✅ FIXED: import upload API function
const uploadVehicleDocuments = (applicationId, formData) => {
  const serverBase = (import.meta.env.VITE_API_BASE_URL || 'https://loan-production-fe55.up.railway.app/api')
    .replace(/\/api$/, '')
  return fetch(`${serverBase}/api/vehicle-loans/${applicationId}/documents`, {
    method: 'POST',
    body: formData,
  })
}

const NEW_DOCS = [
  {name:"PAN Card",       desc:"Upload clear scan — JPG/PDF (Max 2MB)"},
  {name:"Aadhaar Card",   desc:"Upload clear scan — JPG/PDF (Max 2MB)"},
  {name:"Income Proof",   desc:"Salary slips / ITR — JPG/PDF (Max 2MB)"},
  {name:"Bank Statement", desc:"Last 6 months — JPG/PDF (Max 2MB)"},
  {name:"Proforma Invoice",desc:"From authorised dealer — PDF (Max 2MB)"},
  {name:"Passport Photo", desc:"Recent photo — JPG/PNG (Max 1MB)"},
];

const USED_DOCS = [
  {name:"PAN Card",       desc:"Upload clear scan — JPG/PDF (Max 2MB)"},
  {name:"Aadhaar Card",   desc:"Upload clear scan — JPG/PDF (Max 2MB)"},
  {name:"Income Proof",   desc:"Salary slips / ITR — JPG/PDF (Max 2MB)"},
  {name:"Bank Statement", desc:"Last 6 months — JPG/PDF (Max 2MB)"},
  {name:"RC Copy",        desc:"Registration certificate of vehicle — PDF"},
  {name:"Form 35 (NOC)",  desc:"No Objection Certificate — PDF (Max 2MB)"},
  {name:"Insurance Copy", desc:"Current insurance policy — PDF (Max 2MB)"},
  {name:"Valuation Report",desc:"From approved evaluator — PDF (Max 2MB)"},
  {name:"Passport Photo", desc:"Recent photo — JPG/PNG (Max 1MB)"},
];

const COMMERCIAL_DOCS = [
  {name:"PAN Card",             desc:"Personal & business PAN — JPG/PDF"},
  {name:"Aadhaar Card",         desc:"Identity proof — JPG/PDF (Max 2MB)"},
  {name:"Business Registration",desc:"GST cert / Trade licence — PDF"},
  {name:"Bank Statement",       desc:"12 months business account — PDF"},
  {name:"ITR with P&L",         desc:"Last 2 years ITR — PDF (Max 5MB)"},
  {name:"Vehicle Quotation",    desc:"Proforma from dealer — PDF"},
  {name:"Transport Licence",    desc:"Commercial vehicle permit — PDF"},
  {name:"Passport Photo",       desc:"Recent photo — JPG/PNG (Max 1MB)"},
];

const USED_BIKE_DOCS = [
  {name:"PAN Card",       desc:"Upload clear scan — JPG/PDF (Max 2MB)"},
  {name:"Aadhaar Card",   desc:"Upload clear scan — JPG/PDF (Max 2MB)"},
  {name:"Income Proof",   desc:"Salary slip / ITR — JPG/PDF (Max 2MB)"},
  {name:"Bank Statement", desc:"3 months statement — JPG/PDF (Max 2MB)"},
  {name:"RC Copy",        desc:"Registration certificate of the bike — PDF"},
  {name:"Insurance Copy", desc:"Current valid insurance policy — PDF"},
  {name:"Form 35 (NOC)",  desc:"If previously financed — PDF (Max 2MB)"},
  {name:"Valuation Report",desc:"From approved evaluator — PDF (Max 2MB)"},
  {name:"Passport Photo", desc:"Recent photo — JPG/PNG (Max 1MB)"},
];

const AGRI_DOCS = [
  {name:"PAN Card",           desc:"Upload clear scan — JPG/PDF (Max 2MB)"},
  {name:"Aadhaar Card",       desc:"Upload clear scan — JPG/PDF (Max 2MB)"},
  {name:"Land Documents",     desc:"7/12 extract or lease agreement — PDF"},
  {name:"Income Proof",       desc:"KCC statement / agricultural income cert — PDF"},
  {name:"Bank Statement",     desc:"6 months KCC/savings account — PDF"},
  {name:"Equipment Quotation",desc:"Proforma invoice from dealer — PDF"},
  {name:"Passport Photo",     desc:"Recent photo — JPG/PNG (Max 1MB)"},
];

const STEPPER_STEPS = ["Personal Details","Loan Details","Upload Documents","Review & Submit"];

export default function VehicleDocumentsNew() {
  const { applicationId } = useParams();
  const { state }         = useLocation();
  const navigate          = useNavigate();
  const [docType, setDocType]     = useState("new");
  const [files, setFiles]         = useState({});
  const [submitting, setSubmitting] = useState(false);

  const docs =
    docType === "commercial"   ? COMMERCIAL_DOCS :
    docType === "used"         ? USED_DOCS :
    docType === "used-bike"    ? USED_BIKE_DOCS :
    docType === "agriculture"  ? AGRI_DOCS :
    NEW_DOCS;

  const setFile = (name, file) => setFiles({...files,[name]:file});

  // ✅ FIXED: actually upload files to the server before navigating
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (Object.keys(files).length > 0) {
        const formData = new FormData();
        Object.entries(files).forEach(([key, file]) => {
          // Use doc name as fieldname (spaces replaced with underscore)
          formData.append(key.replace(/\s+/g, '_').toLowerCase(), file);
        });
        const res = await uploadVehicleDocuments(applicationId, formData);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Upload failed');
        }
      }
      navigate(`/vehicle-loan/success/${applicationId}`, {
        state: { full_name: state?.full_name, vehicle_type: state?.vehicle_type || "Vehicle Loan" }
      });
    } catch (err) {
      alert('Document upload failed: ' + (err.message || 'Please try again.'));
      setSubmitting(false);
    }
  };

  const uploadedCount = Object.keys(files).length;

  return (
    <div className="vl-page">
      <div className="vl-breadcrumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to="/vehicle-loan">Vehicle Loan</Link><span>›</span>
        <span>Upload Documents</span>
      </div>

      <div className="vl-docs-upload-wrapper">
        <div className="vl-apply-header">
          <div className="vl-chip">STEP 3 OF 4</div>
          <h1>Upload Required Documents</h1>
          <p>Application ID: <strong style={{color:"#f97316"}}>{applicationId}</strong></p>
        </div>

        {/* Stepper */}
        <div className="vl-stepper" style={{marginBottom:28}}>
          {STEPPER_STEPS.map((s,i)=>(
            <div key={s} className={`vl-step-new${i===2?" active":i<2?" done":""}`}>
              <div className="vl-step-circle">{i<2?"✓":i+1}</div>
              <span>{s}</span>
              {i<STEPPER_STEPS.length-1&&<div className="vl-step-connector"/>}
            </div>
          ))}
        </div>

        <div className="vl-form-card">
          <h3>Select Vehicle Type to see required documents</h3>
          <select
            value={docType} onChange={e=>{setDocType(e.target.value);setFiles({});}}
            style={{padding:"10px 14px",border:"1.5px solid #d4dcf0",borderRadius:12,fontSize:14,fontFamily:"inherit",marginBottom:22,width:"100%",color:"#0F1C3F"}}>
            <option value="new">New Vehicle (Car / Two-Wheeler)</option>
            <option value="used">Used / Pre-Owned Car</option>
            <option value="used-bike">Used Bike / Two-Wheeler</option>
            <option value="commercial">Commercial Vehicle</option>
            <option value="agriculture">Agriculture Equipment</option>
          </select>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{marginBottom:0}}>Required Documents</h3>
            <span style={{fontSize:13,color:"#6b7280"}}>{uploadedCount}/{docs.length} uploaded</span>
          </div>

          <div className="vl-doc-upload-grid">
            {docs.map(d=>(
              <div key={d.name} className={`vl-doc-upload-card${files[d.name]?" uploaded":""}`}>
                <div className="vl-doc-upload-info">
                  <h5>{d.name}</h5>
                  <p>{files[d.name] ? <span style={{color:"#059669"}}>✓ {files[d.name].name}</span> : d.desc}</p>
                </div>
                <label>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" style={{display:"none"}}
                    onChange={e=>e.target.files[0]&&setFile(d.name,e.target.files[0])}/>
                  <span className={`vl-upload-btn${files[d.name]?" done":""}`}>
                    {files[d.name]?"Uploaded ✓":"Upload"}
                  </span>
                </label>
              </div>
            ))}
          </div>

          <p className="vl-upload-hint">
            Documents not uploaded now can be submitted later. Click below to continue.
          </p>

          <div className="vl-form-actions">
            <button className="vl-btn-primary" onClick={handleSubmit} disabled={submitting}
              style={{minWidth:220,justifyContent:"center"}}>
              {submitting?"Submitting…":"Submit Application →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}