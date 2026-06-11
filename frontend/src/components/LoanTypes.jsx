/* ============================================
   LoanTypes.jsx
   Edit LOAN_TYPES array to add/remove/edit cards
   ============================================ */
import { useNavigate } from 'react-router-dom'
import './LoanTypes.css'

// === EDIT: loan product cards ===
const LOAN_TYPES = [
  {
    id: 'home',
    color: '#EEF3FF',
    iconColor: '#1A56DB',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Home Loan',
    desc: 'Buy, build or renovate your dream home with easy financing.',
    rate: 'From 8.5% p.a.',
  },
  {
    id: 'vehicle',
    color: '#F0FDF4',
    iconColor: '#16A34A',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 5v4h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'Vehicle Loan',
    desc: 'Finance new or used cars and bikes at competitive rates.',
    rate: 'From 9.0% p.a.',
  },
  {
    id: 'business',
    color: '#F0FDF4',
  iconColor: '#234732',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    title: 'Business Loan',
    desc: 'Grow your business with easy financing and minimal documentation.',
    rate: 'From 10.5% p.a.',
  },
  {
    id: 'personal',
    color: '#FDF4FF',
    iconColor: '#9333EA',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: 'Personal Loan',
    desc: 'Meet your personal needs instantly — travel, education, or emergencies.',
    rate: 'From 11.5% p.a.',
  },
]

export default function LoanTypes() {
  const navigate = useNavigate()
  return (
    <section className="loans" id="loans" aria-label="Loan products">
      <div className="container">
        <div className="loans__header">
          {/* === EDIT: section label & heading === */}
          <span className="section-label">Our Loan Products</span>
          <h2 className="section-title">Choose the Loan that <span>Fits Your Needs</span></h2>
          <p className="section-subtitle">Simple options for every life goal — pick what's right for you.</p>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="loans__scroll-wrapper" role="list">
          <div className="loans__grid">
            {LOAN_TYPES.map(loan => (
              <article className="card loan-card" key={loan.id} role="listitem" aria-label={loan.title}>
                <div className="loan-card__icon" style={{ background: loan.color, color: loan.iconColor }}>
                  {loan.icon}
                </div>
                <h3 className="loan-card__title">{loan.title}</h3>
                <p className="loan-card__desc">{loan.desc}</p>
                <div className="loan-card__footer">
                  <span className="loan-card__rate">{loan.rate}</span>
                  <button
                    type="button"
                    className="loan-card__cta"
                    aria-label={`Apply for ${loan.title}`}
                    onClick={() => navigate(`/${loan.id}-loan`)}
                  >
                    view →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
