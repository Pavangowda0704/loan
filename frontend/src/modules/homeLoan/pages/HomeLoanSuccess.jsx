// frontend/src/modules/homeLoan/pages/HomeLoanSuccess.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../homeLoan.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const NEXT_STEPS = [
  {
    title: 'Application Under Review',
    desc: 'Our team will review your application and documents within 24 business hours.',
  },
  {
    title: 'Document Verification',
    desc: 'We will verify your KYC, income, and property documents. You may be contacted for additional information.',
  },
  {
    title: 'In-Principle Approval',
    desc: 'Once documents are verified, you will receive in-principle approval via SMS and email.',
  },
  {
    title: 'Property Valuation & Legal Check',
    desc: 'Our empanelled valuer and legal team will inspect and verify the property within 3–5 working days.',
  },
  {
    title: 'Final Sanction & Disbursement',
    desc: 'After all checks, your loan is sanctioned and disbursed directly to the seller or builder.',
  },
];

const HomeLoanSuccess = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [trackData, setTrackData] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);

  // Try to fetch application status
  useEffect(() => {
    const fetchTrack = async () => {
      if (!applicationId) return;
      setTrackLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/home-loans/${applicationId}`);
        setTrackData(res.data);
      } catch {
        // Backend not connected yet — use local data
        setTrackData({
          application_id: applicationId,
          status: 'Submitted',
          submitted_at: new Date().toISOString(),
        });
      } finally {
        setTrackLoading(false);
      }
    };
    fetchTrack();
  }, [applicationId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(applicationId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const text = `LoanEase Home Loan Application\n\nApplication ID: ${applicationId}\nDate: ${new Date().toLocaleString('en-IN')}\nStatus: Submitted\n\nNext Steps:\n${NEXT_STEPS.map((s, i) => `${i + 1}. ${s.title}: ${s.desc}`).join('\n')}\n\nFor queries, call 1800-123-4567 or email support@loanease.in`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LoanEase_Application_${applicationId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="hl-module">
      {/* MINIMAL NAV */}
      <nav className="hl-nav">
        <Link to="/home-loan" className="hl-nav__logo">
          Loan<span>Ease</span>
        </Link>
        <div className="hl-nav__cta">
          <Link to="/home-loan" className="hl-btn hl-btn--ghost hl-btn--sm">
            Back to Home Loans
          </Link>
        </div>
      </nav>

      {/* SUCCESS CARD */}
      <div className="hl-success-page">
        <div className="hl-success-card">
          {/* TOP BANNER */}
          <div className="hl-success-card__top">
            <div className="hl-success-icon">🎉</div>
            <h1>Application Submitted!</h1>
            <p>Your home loan application has been received successfully. We'll be in touch shortly.</p>
          </div>

          {/* BODY */}
          <div className="hl-success-card__body">
            {/* Application ID */}
            <div style={{ textAlign: 'left', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--c-slate)', fontWeight: '600' }}>
                Your Application ID
              </span>
            </div>
            <div className="hl-app-id-box">
              <div>
                <div className="hl-app-id-box__label">Reference Number</div>
                <div className="hl-app-id-box__id">{applicationId}</div>
              </div>
              <button
                className="hl-btn hl-btn--ghost hl-btn--sm"
                onClick={handleCopy}
                title="Copy Application ID"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>

            {/* Status Badge */}
            {trackData && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(22,163,74,.08)',
                border: '1px solid rgba(22,163,74,.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 16px',
                marginBottom: '24px',
              }}>
                <span style={{ fontSize: '18px' }}>✅</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c-success)' }}>
                    Status: {trackData.status || 'Submitted'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--c-slate)' }}>
                    Submitted on {new Date(trackData.submitted_at || Date.now()).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Info boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {[
                { icon: '📞', label: 'Support', val: '1800-123-4567', note: 'Mon–Sat, 9AM–6PM' },
                { icon: '📧', label: 'Email', val: 'support@loanease.in', note: 'Reply within 4 hours' },
                { icon: '⏱️', label: 'Review Time', val: '24–48 hrs', note: 'For initial approval' },
                { icon: '📱', label: 'SMS & Email', val: 'Alerts Enabled', note: 'Check your inbox' },
              ].map((item) => (
                <div key={item.label} style={{
                  background: 'var(--c-bg-2)',
                  border: '1px solid var(--c-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: '18px', marginBottom: '6px' }}>{item.icon}</div>
                  <div style={{ fontSize: '11px', color: 'var(--c-slate)', marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--c-navy)' }}>{item.val}</div>
                  <div style={{ fontSize: '11px', color: 'var(--c-slate)', marginTop: '2px' }}>{item.note}</div>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div className="hl-next-steps">
              <h3>What Happens Next?</h3>
              <ul className="hl-next-steps__list">
                {NEXT_STEPS.map((step, i) => (
                  <li key={i} className="hl-next-steps__item">
                    <div className="hl-next-steps__num">{i + 1}</div>
                    <div className="hl-next-steps__text">
                      <strong>{step.title}</strong> — {step.desc}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="hl-success-actions">
              <button
                className="hl-btn hl-btn--primary"
                onClick={handleDownload}
              >
                ⬇ Download Summary
              </button>
              <button
                className="hl-btn hl-btn--outline"
                onClick={() => navigate('/home-loan')}
              >
                Browse Other Loans
              </button>
            </div>

            <div style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid var(--c-border)',
              fontSize: '12px',
              color: 'var(--c-slate)',
              lineHeight: '1.6',
              textAlign: 'center',
            }}>
              Save your Application ID <strong>{applicationId}</strong> for future reference.
              You will also receive a confirmation SMS and email.
            </div>
          </div>
        </div>
      </div>

      <footer className="hl-footer">
        <p>© 2025 LoanEase · <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a></p>
        <p style={{ marginTop: '8px', fontSize: '12px', opacity: .6 }}>
          NBFC registered with RBI. All loan approvals are subject to credit assessment and policy norms.
        </p>
      </footer>
    </div>
  );
};

export default HomeLoanSuccess;
