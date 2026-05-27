/* ============================================
   Hero.jsx
   Edit TRUST_POINTS to change the 3 badges
   Edit heading/subtext inline below
   ============================================ */
import { Link } from 'react-router-dom'
import './Hero.css'

// === EDIT: 3 trust points under buttons ===
const TRUST_POINTS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    label: '100% Secure',
    sub: 'Your data is safe with us',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 2 13 9 20 9"/><polygon points="22 4 13 9 2 4 13 2 22 4"/>
        <path d="M2 4v14a2 2 0 002 2h16a2 2 0 002-2V4"/>
      </svg>
    ),
    label: 'Quick Approval',
    sub: 'Minimal paperwork & fast process',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    label: 'Expert Support',
    sub: 'We are here to help you',
  },
]

export default function Hero() {
  return (
    <section className="hero" id="home" aria-label="Hero section">
      <div className="container hero__inner">

        {/* Left: Text content */}
        <div className="hero__content">
          {/* === EDIT: eyebrow label === */}
          <span className="section-label">Welcome to LoanEase</span>

          {/* === EDIT: main heading === */}
          <h1 className="hero__heading">
            Simple Loans,<br />
            <span>Better Tomorrow</span>
          </h1>

          {/* === EDIT: subtext === */}
          <p className="hero__sub">
            Apply for Home, Business, Vehicle and Personal Loans with a simple process
            and quick support. Quick approval with minimal paperwork.
          </p>

          {/* CTA Buttons */}
          <div className="hero__buttons">
            <Link to="/loans/personal" className="btn btn-primary">Apply for Loan</Link>
            <Link to="/eligibility/personal" className="btn btn-outline">Check Eligibility</Link>
          </div>

          {/* Trust points */}
          <div className="hero__trust">
            {TRUST_POINTS.map(tp => (
              <div className="trust-item" key={tp.label}>
                <span className="trust-icon" aria-hidden="true">{tp.icon}</span>
                <div>
                  <strong>{tp.label}</strong>
                  <span>{tp.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__illustration">
            {/* House SVG illustration */}
            <svg viewBox="0 0 420 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero__svg">
              {/* Sky blob */}
              <ellipse cx="210" cy="170" rx="190" ry="155" fill="#EEF3FF"/>
              {/* House body */}
              <rect x="95" y="160" width="230" height="160" rx="6" fill="#fff" stroke="#D1D9F0" strokeWidth="2"/>
              {/* Roof */}
              <polygon points="75,165 210,60 345,165" fill="#1A56DB"/>
              <polygon points="90,165 210,72 330,165" fill="#2563EB"/>
              {/* Door */}
              <rect x="178" y="245" width="64" height="75" rx="4" fill="#1A56DB"/>
              <circle cx="234" cy="283" r="4" fill="#fff"/>
              {/* Windows */}
              <rect x="108" y="185" width="58" height="48" rx="4" fill="#C7D9FF" stroke="#A5C0FF" strokeWidth="1.5"/>
              <line x1="137" y1="185" x2="137" y2="233" stroke="#A5C0FF" strokeWidth="1.5"/>
              <line x1="108" y1="209" x2="166" y2="209" stroke="#A5C0FF" strokeWidth="1.5"/>
              <rect x="254" y="185" width="58" height="48" rx="4" fill="#C7D9FF" stroke="#A5C0FF" strokeWidth="1.5"/>
              <line x1="283" y1="185" x2="283" y2="233" stroke="#A5C0FF" strokeWidth="1.5"/>
              <line x1="254" y1="209" x2="312" y2="209" stroke="#A5C0FF" strokeWidth="1.5"/>
              {/* Ground */}
              <rect x="60" y="318" width="300" height="12" rx="6" fill="#D1D9F0"/>
              {/* Tree left */}
              <rect x="58" y="265" width="10" height="55" rx="3" fill="#A5C0FF"/>
              <ellipse cx="63" cy="250" rx="28" ry="32" fill="#4ADE80" opacity="0.7"/>
              {/* Tree right */}
              <rect x="352" y="275" width="10" height="45" rx="3" fill="#A5C0FF"/>
              <ellipse cx="357" cy="262" rx="22" ry="26" fill="#34D399" opacity="0.7"/>
              {/* Badge: Approved */}
              <rect x="292" y="68" width="110" height="40" rx="12" fill="#1A56DB" filter="url(#shadow)"/>
              <text x="347" y="93" textAnchor="middle" fill="#fff" fontFamily="Sora,sans-serif" fontWeight="700" fontSize="13">✓ Approved!</text>
              {/* Badge: Low Rate */}
              <rect x="16" y="145" width="108" height="40" rx="12" fill="#fff" stroke="#D1D9F0" strokeWidth="1.5"/>
              <text x="70" y="163" textAnchor="middle" fill="#1A56DB" fontFamily="Sora,sans-serif" fontWeight="700" fontSize="11">Low Rate</text>
              <text x="70" y="178" textAnchor="middle" fill="#374151" fontFamily="Nunito,sans-serif" fontSize="11">from 8.5% p.a.</text>
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1A56DB" floodOpacity="0.25"/>
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
