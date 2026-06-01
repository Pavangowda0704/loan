// ============================================================
//  BusinessLoanSuccess.jsx
//  Mirrors ApplicationSuccess.jsx / VehicleLoanSuccessNew.jsx
// ============================================================
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../businessLoan.css";

const TIMELINE = [
  { icon: "📨", title: "Application Received",      desc: "Your application has been submitted and assigned to our team.", eta: "Immediate"        },
  { icon: "🔍", title: "Document Verification",     desc: "Our team will verify your submitted documents and contact you if needed.", eta: "Within 4–6 hours"  },
  { icon: "📊", title: "Credit Assessment",          desc: "Business financials, credit score, and loan parameters assessed.", eta: "Within 24 hours"  },
  { icon: "✅", title: "In-Principle Approval",      desc: "You will receive approval confirmation via SMS and email.", eta: "Within 24–48 hours"},
  { icon: "💰", title: "Loan Disbursal",             desc: "Approved funds credited directly to your business bank account.", eta: "Within 48–72 hours"},
];

export default function BusinessLoanSuccess() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const appId = applicationId
    || localStorage.getItem("bl_last_app_id")
    || "BLN" + Date.now();

  const handleCopy = () => {
    navigator.clipboard.writeText(appId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const text = [
      "Plumzo Capital Services",
      "Business Loan Application Confirmation",
      "",
      `Application ID : ${appId}`,
      `Date           : ${new Date().toLocaleString("en-IN")}`,
      "",
      "Thank you for applying. Our team will contact you within 24 hours.",
      "",
      "Support  :  support@plumzo.in",
      "Helpline :  1800-123-4567  (Mon–Sat, 9 AM – 7 PM)",
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `Plumzo_${appId}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>

      {/* ── Hero ── */}
      <section style={{ background: "linear-gradient(135deg, var(--color-navy) 0%, #1a2a5e 100%)", padding: "56px 20px", textAlign: "center" }}>
        <div className="container">
          <div style={{ fontSize: "2.8rem", marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.7rem,3.5vw,2.4rem)", fontWeight: 800, color: "#fff", marginBottom: 10 }}>
            Application Submitted Successfully!
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto" }}>
            Your business loan application has been received. Our team will review it and contact you within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bl-section">
        <div className="container">
          <div style={{ maxWidth: 680, margin: "0 auto" }}>

            {/* App ID Box */}
            <div className="card" style={{ padding: "28px 32px", marginBottom: 24, textAlign: "center", borderTop: "4px solid #00C853" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-muted)", marginBottom: 8 }}>
                Your Application ID
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#00C853", letterSpacing: "0.06em", marginBottom: 12 }}>
                {appId}
              </div>
              <button
                style={{ padding: "7px 18px", border: "1.5px solid var(--color-border)", borderRadius: 20, fontSize: "0.8rem", cursor: "pointer", color: "var(--color-muted)", background: "#fff", fontFamily: "var(--font-body)", transition: "all 0.2s" }}
                onClick={handleCopy}
              >
                {copied ? "✓ Copied!" : "📋 Copy ID"}
              </button>
            </div>

            {/* What happens next */}
            <div className="card" style={{ padding: "28px 28px", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: 24, textAlign: "center" }}>
                What Happens Next?
              </h3>
              <div className="bla-timeline">
                {TIMELINE.map((item, i) => (
                  <div key={i} className="bla-timeline-item">
                    <div className="bla-timeline-dot">{item.icon}</div>
                    <div className="bla-timeline-content">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                      <div className="eta">⏱ {item.eta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
              {[
                { icon: "📞", title: "Helpline",       detail: "1800-123-4567",       sub: "Mon–Sat, 9 AM – 7 PM (Toll-free)" },
                { icon: "✉️", title: "Email Support",  detail: "support@plumzo.in",   sub: "Response within 2 business hours" },
              ].map(c => (
                <div key={c.title} className="card" style={{ padding: "18px 16px" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.88rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: 3 }}>{c.title}</div>
                  <div style={{ fontSize: "0.82rem", color: "#00C853", fontWeight: 600, marginBottom: 2 }}>{c.detail}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-muted)" }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="bla-btn-primary" onClick={handleDownload}>
                ⬇ Download Confirmation
              </button>
              <button
                className="bla-btn-outline"
                onClick={() => navigate(`/business-loan/track/${appId}`)}
              >
                Track Application →
              </button>
              <button
                className="bla-btn-outline"
                onClick={() => navigate("/business-loan")}
              >
                ← Business Loans Home
              </button>
            </div>

            <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--color-muted)", marginTop: 20 }}>
              Keep your Application ID safe for future reference and tracking.
            </p>

          </div>
        </div>
      </section>

    </div>
  );
}
