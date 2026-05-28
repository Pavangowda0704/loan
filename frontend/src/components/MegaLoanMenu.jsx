// ============================================================
//  MegaLoanMenu.jsx — Tata Capital-style mega dropdown
// ============================================================
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LOAN_CATEGORIES } from '../data/loanCategories'

function Icon({ pathData, size = 18, color = 'currentColor' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      style={{ color, flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: pathData }}
      aria-hidden="true"
    />
  )
}

// ── Map category id → its main landing route ────────────────
function loanPath(catId) {
  const map = {
    home:     '/#loans',
    business: '/#loans',
    personal: '/personal-loan',
    vehicle:  '/vehicle-loan',
  }
  return map[catId] || '/'
}

function CategoryPanel({ cat, onClose }) {
  const navigate = useNavigate()

  const handleKnowMore = () => {
    onClose()
    navigate(loanPath(cat.id))
  }

  const handleApply = () => {
    onClose()
    if (cat.id === 'vehicle')  navigate('/vehicle-loan/apply')
    else if (cat.id === 'personal') navigate('/personal-loan/salaried/apply')
    else navigate(loanPath(cat.id))
  }

  return (
    <div className="mlm-panel" key={cat.id}>

      {/* ── Header ── */}
      <div className="mlm-panel__header" style={{ borderColor: cat.color + '22' }}>
        <div>
          <p className="mlm-panel__rate" style={{ color: cat.color }}>
            Starting @ {cat.rate}
          </p>
          <h3 className="mlm-panel__title">{cat.title}</h3>
          <p className="mlm-panel__tagline">{cat.tagline}</p>
        </div>
        <div className="mlm-panel__badge" style={{ background: cat.bgColor, color: cat.color }}>
          <Icon pathData={cat.iconPath} size={22} color={cat.color} />
        </div>
      </div>

      {/* ── Bullets ── */}
      <ul className="mlm-panel__bullets" aria-label="Key features">
        {cat.bullets.map((b) => (
          <li key={b}>
            <span className="mlm-panel__check" style={{ color: cat.color }} aria-hidden="true">✓</span>
            {b}
          </li>
        ))}
      </ul>

      {/* ── Action buttons ── */}
      <div className="mlm-panel__actions">
        <button onClick={handleKnowMore} className="mlm-btn mlm-btn--ghost" style={{ color: cat.color, borderColor: cat.color + '55' }}>
          Know More
        </button>
        <button onClick={handleApply} className="mlm-btn mlm-btn--primary" style={{ background: cat.color }}>
          Apply Now
        </button>
      </div>

      {/* ── Sub-loans ── */}
      <div className="mlm-panel__section-label">Loan Options</div>
      <ul className="mlm-panel__subloans" role="list">
        {cat.subLoans.map((s) => (
          <li key={s.label}>
            {s.href && s.href !== '#' ? (
              <Link to={s.href} onClick={onClose} className="mlm-subloan-link" style={{ '--accent': cat.color }}>
                <span className="mlm-subloan-link__arrow" aria-hidden="true">→</span>
                <span className="mlm-subloan-link__text">
                  <span className="mlm-subloan-link__label">{s.label}</span>
                  {s.desc && <span className="mlm-subloan-link__desc">{s.desc}</span>}
                </span>
              </Link>
            ) : (
              <button onClick={onClose} className="mlm-subloan-link" style={{ '--accent': cat.color, background:'none', border:'none', cursor:'pointer', width:'100%', textAlign:'left' }}>
                <span className="mlm-subloan-link__arrow" aria-hidden="true">→</span>
                <span className="mlm-subloan-link__text">
                  <span className="mlm-subloan-link__label">{s.label}</span>
                  {s.desc && <span className="mlm-subloan-link__desc">{s.desc}</span>}
                </span>
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* ── Calculators ── */}
      {cat.calculators?.length > 0 && (
        <>
          <div className="mlm-panel__section-label">Calculators</div>
          <ul className="mlm-panel__calcs" role="list">
            {cat.calculators.map((c) => (
              <li key={c.label}>
                {c.href?.startsWith('/') ? (
                  <Link to={c.href} onClick={onClose} className="mlm-calc-link" style={{ '--accent': cat.color }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
                    </svg>
                    {c.label}
                  </Link>
                ) : (
                  <a href={c.href} className="mlm-calc-link" style={{ '--accent': cat.color }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
                    </svg>
                    {c.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default function MegaLoanMenu({ visible, onClose }) {
  const [activeId, setActiveId] = useState(LOAN_CATEGORIES[0].id)

  useEffect(() => {
    if (visible) setActiveId(LOAN_CATEGORIES[0].id)
  }, [visible])

  const activeCategory = LOAN_CATEGORIES.find((c) => c.id === activeId) || LOAN_CATEGORIES[0]

  return (
    <div
      className={`mlm-wrapper${visible ? ' mlm-wrapper--open' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-label="Loan categories menu"
      aria-hidden={!visible}
    >
      <div className="mlm-box">

        {/* LEFT SIDEBAR */}
        <nav className="mlm-sidebar" aria-label="Loan category list">
          <p className="mlm-sidebar__heading">All Loans</p>
          <ul role="list">
            {LOAN_CATEGORIES.map((cat) => {
              const isActive = cat.id === activeId
              return (
                <li key={cat.id}>
                  <button
                    className={`mlm-sidebar__item${isActive ? ' mlm-sidebar__item--active' : ''}`}
                    style={isActive ? { '--sidebar-accent': cat.color, '--sidebar-bg': cat.bgColor } : {}}
                    onMouseEnter={() => setActiveId(cat.id)}
                    onClick={() => setActiveId(cat.id)}
                    aria-pressed={isActive}
                    aria-label={`Show ${cat.title} options`}
                  >
                    <span className="mlm-sidebar__icon"
                      style={isActive ? { background: cat.bgColor, color: cat.color } : { background: '#F3F4F6', color: '#6B7280' }}>
                      <Icon pathData={cat.iconPath} size={15} />
                    </span>
                    <span className="mlm-sidebar__label">{cat.title}</span>
                    <span className="mlm-sidebar__arrow" aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="mlm-sidebar__footer">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            All rates are indicative
          </div>
        </nav>

        {/* RIGHT CONTENT PANEL */}
        <div className="mlm-content" aria-live="polite" aria-atomic="true">
          <CategoryPanel cat={activeCategory} onClose={onClose} />
        </div>
      </div>

      {/* BOTTOM CTA STRIP */}
      <div className="mlm-footer">
        <div className="mlm-footer__left">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          <span>Not sure which loan fits you? Our experts are here to help.</span>
        </div>
        <a href="#contact" className="mlm-footer__cta" onClick={onClose}>
          Talk to an Expert →
        </a>
      </div>
    </div>
  )
}