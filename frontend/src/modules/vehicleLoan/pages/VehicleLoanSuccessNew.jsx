// ============================================================
//  VehicleLoanSuccessNew.jsx — Success Page
//  Route: /vehicle-loan/success/:applicationId
// ============================================================
import { Link, useParams, useLocation } from "react-router-dom";
import "../vehicleLoan.css";

export default function VehicleLoanSuccessNew() {
  const { applicationId } = useParams();
  const { state }         = useLocation();
  const name        = state?.full_name    || "Applicant";
  const vehicleType = state?.vehicle_type || "Vehicle Loan";

  const today = new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});

  const TIMELINE = [
    {label:"Application Submitted",done:true,  date:today},
    {label:"Under Review",         done:false, date:"24–48 hours"},
    {label:"Document Verification",done:false, date:"48–72 hours"},
    {label:"Approved",             done:false, date:"3–5 business days"},
    {label:"Disbursed",            done:false, date:"Within 7 days"},
  ];

  return (
    <div className="vl-page">
      <div className="vl-breadcrumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to="/vehicle-loan">Vehicle Loan</Link><span>›</span>
        <span>Application Submitted</span>
      </div>

      <div style={{maxWidth:680,margin:"32px auto",padding:"0 24px"}}>
        <div className="vl-success-card">
          <div className="vl-success-icon">✓</div>
          <h1>Application Submitted Successfully!</h1>
          <p>Thank you for applying with Plumzo Capital Services. Your vehicle loan application has been received and is being processed.</p>

          <div className="vl-success-id">{applicationId}</div>

          <div className="vl-success-details">
            {[
              ["Applicant Name", name],
              ["Loan Type",      vehicleType],
              ["Submitted On",   today],
              ["Status",         "Submitted"],
              ["Est. Approval",  "Within 24–48 hours"],
            ].map(([l,v])=>(
              <div key={l} className="vl-success-row">
                <span>{l}</span>
                <strong style={l==="Status"?{color:"#f97316",background:"#fff8f3",padding:"2px 10px",borderRadius:999,fontSize:12}:{}}>{v}</strong>
              </div>
            ))}
          </div>

          {/* Mini Timeline */}
          <div style={{textAlign:"left",marginBottom:24}}>
            <h4 style={{fontSize:14,fontWeight:700,color:"#0F1C3F",marginBottom:14}}>Application Journey</h4>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {TIMELINE.map((t,i)=>(
                <div key={t.label} style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:t.done?"#d1fae5":"#f0f4ff",color:t.done?"#059669":"#b0bcd4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0}}>
                    {t.done?"✓":i+1}
                  </div>
                  <div style={{flex:1,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:13.5,fontWeight:t.done?700:500,color:t.done?"#0F1C3F":"#b0bcd4"}}>{t.label}</span>
                    <span style={{fontSize:12,color:t.done?"#059669":"#b0bcd4"}}>{t.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="vl-success-note">
            Save your Application ID <strong>{applicationId}</strong> to track your application status anytime.
          </div>

          <div style={{background:"#fffbeb",border:"1.5px solid #fcd34d",borderRadius:12,padding:"16px 20px",textAlign:"left",marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:18}}>📞</span>
              <strong style={{fontSize:14,color:"#92400e"}}>Next Step — Document Collection</strong>
            </div>
            <p style={{fontSize:13,color:"#78350f",margin:0,lineHeight:1.6}}>
              Our relationship manager will <strong>contact you within 24 hours</strong> to collect any remaining documents in person or guide you through the upload process. Please keep your KYC documents ready.
            </p>
          </div>

          <div className="vl-actions" style={{justifyContent:"center",marginTop:24}}>
            <Link to="/" className="vl-btn-outline">← Go to Home</Link>
            <Link to={`/track-application/${applicationId}?type=vehicle`} className="vl-btn-primary">Track Application →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}