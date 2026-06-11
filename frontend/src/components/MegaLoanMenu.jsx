// frontend/src/components/MegaLoanMenu.jsx
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

function loanPath(catId) {
  const map = {
    home:     '/home-loan',
    business: '/business-loan',
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
    if (cat.id === 'vehicle') navigate('/vehicle-loan/apply')
    else if (cat.id === 'personal') navigate('/personal-loan/salaried/apply')
    else navigate(loanPath(cat.id))
  }

  return (
    <div className="mlm-panel" key={cat.id}>
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

      <ul className="mlm-panel__bullets" aria-label="Key features">
        {cat.bullets.map((b) => (
          <li key={b}>
            <span className="mlm-panel__check" style={{ color: cat.color }} aria-hidden="true">✓</span>
            {b}
          </li>
        ))}
      </ul>

      <div className="mlm-panel__actions">
        <button onClick={handleKnowMore} className="mlm-btn mlm-btn--ghost" style={{ color: cat.color, borderColor: cat.color + '55' }}>
          Know More
        </button>
        <button onClick={handleApply} className="mlm-btn mlm-btn--primary" style={{ background: cat.color }}>
          Apply Now
        </button>
      </div>

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
              <button
                onClick={onClose}
                className="mlm-subloan-link"
                style={{ '--accent': cat.color, background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
              >
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
    </div>
  )
}

export default function MegaLoanMenu({ visible, onClose }) {
  const [activeId, setActiveId] = useState(LOAN_CATEGORIES[0].id)

  useEffect(() => {
    if (visible) setActiveId(LOAN_CATEGORIES[0].id)
  }, [visible])

  // Close on Escape key
  useEffect(() => {
    if (!visible) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, onClose])

  const activeCategory = LOAN_CATEGORIES.find((c) => c.id === activeId) || LOAN_CATEGORIES[0]

  return (
    <div
      className={`mlm-wrapper${visible ? ' mlm-wrapper--open' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-label="Loan categories menu"
      inert={!visible ? "" : undefined}
    >
      <div className="mlm-box">
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
                    <span
                      className="mlm-sidebar__icon"
                      style={isActive ? { background: cat.bgColor, color: cat.color } : { background: '#F3F4F6', color: '#6B7280' }}
                    >
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

        <div className="mlm-content" aria-live="polite" aria-atomic="true">
          <CategoryPanel cat={activeCategory} onClose={onClose} />
        </div>
      </div>

      
    </div>
  )
}