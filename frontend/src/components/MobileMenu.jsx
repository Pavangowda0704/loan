// ============================================================
//  MobileMenu.jsx — slide-in drawer with accordion for Loans
// ============================================================
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LOAN_CATEGORIES, NAV_LINKS } from '../data/loanCategories'

// Single accordion for one loan category
function loanPath(catId) {
  return catId === 'vehicle' ? '/loans/vehicle' : '/loans/personal'
}

function AccordionItem({ cat, onClose }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`mob-acc${open ? ' mob-acc--open' : ''}`}>
      <button
        className="mob-acc__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="mob-acc__label-row">
          <span className="mob-acc__icon" style={{ background: cat.bgColor, color: cat.color }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
              dangerouslySetInnerHTML={{ __html: cat.iconPath }} aria-hidden="true" />
          </span>
          <span style={{ color: cat.color, fontWeight: 700 }}>{cat.title}</span>
        </span>
        <span className={`mob-acc__chevron${open ? ' mob-acc__chevron--up' : ''}`} aria-hidden="true">
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      <div className="mob-acc__panel">
        <ul>
          {cat.subLoans.map((s) => (
            <li key={s.label}>
              <Link to={loanPath(cat.id)} onClick={onClose} className="mob-acc__link" style={{ '--dot': cat.color }}>
                <span className="mob-acc__dot" style={{ background: cat.color }} aria-hidden="true" />
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function MobileMenu({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [loansOpen, setLoansOpen] = useState(false)

  const goToSection = (id) => {
    onClose?.()
    if (location.pathname !== '/') navigate('/')
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
  }

  useEffect(() => { if (!isOpen) setLoansOpen(false) }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`mob-overlay${isOpen ? ' mob-overlay--on' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`mob-menu${isOpen ? ' mob-menu--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        id="mobile-menu"
      >
        {/* Header */}
        <div className="mob-menu__hd">
          <Link to="/" className="mob-menu__logo" onClick={onClose}>
            <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="9" fill="#1A56DB"/>
              <path d="M17 5L6 13.5V29H13V20H21V29H28V13.5L17 5Z" fill="white"/>
            </svg>
            LoanEase
          </Link>
          <button className="mob-menu__close" onClick={onClose} aria-label="Close menu">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav body */}
        <nav className="mob-menu__body" aria-label="Mobile navigation links">
          <ul className="mob-menu__list">
            <li>
              <Link to="/" className="mob-menu__link" onClick={onClose}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Home
              </Link>
            </li>

            {/* Loans toggle */}
            <li>
              <button
                className={`mob-menu__link mob-menu__link--btn${loansOpen ? ' mob-menu__link--open' : ''}`}
                onClick={() => setLoansOpen((o) => !o)}
                aria-expanded={loansOpen}
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                </svg>
                Loans
                <span className={`mob-menu__arrow${loansOpen ? ' mob-menu__arrow--up' : ''}`} aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <div className={`mob-loans-panel${loansOpen ? ' mob-loans-panel--open' : ''}`}>
                {LOAN_CATEGORIES.map((cat) => (
                  <AccordionItem key={cat.id} cat={cat} onClose={onClose} />
                ))}
              </div>
            </li>

            <li>
              <button type="button" className="mob-menu__link" onClick={() => goToSection('emi')}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <rect x="4" y="2" width="16" height="20" rx="2"/>
                  <line x1="8" y1="6" x2="16" y2="6"/>
                  <line x1="8" y1="10" x2="16" y2="10"/>
                </svg>
                EMI Calculator
              </button>
            </li>
            <li>
              <button type="button" className="mob-menu__link" onClick={() => goToSection('about')}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                About Us
              </button>
            </li>
            <li>
              <button type="button" className="mob-menu__link" onClick={() => goToSection('contact')}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                Contact Us
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer CTA */}
        <div className="mob-menu__ft">
          <Link to="/loans/personal" className="mob-menu__cta" onClick={onClose}>
            Apply for a Loan →
          </Link>
          <p className="mob-menu__note">Mon–Sat · 9 AM – 7 PM · +91 98765 43210</p>
        </div>
      </div>
    </>
  )
}
