/* ============================================
   Header.jsx
   Edit NAV_LINKS to change navigation items
   ============================================ */
import { useState, useEffect } from 'react'
import './Header.css'

// === EDIT: navigation links ===
const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Loans', href: '#loans' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact Us', href: '#contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="container header__inner">

        {/* === EDIT: Brand name / logo text === */}
        <a href="#" className="header__logo" aria-label="LoanEase Home">
          <span className="logo-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1A56DB"/>
              <path d="M16 6L7 13v13h6v-8h6v8h6V13L16 6z" fill="white"/>
            </svg>
          </span>
          <span className="logo-text">Plumzo</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="header__nav" aria-label="Main navigation">
          <ul className="header__nav-list">
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <a href={link.href} className="header__nav-link">{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Button */}
        <a href="#loans" className="btn btn-primary header__cta">Apply Now</a>

        {/* Mobile Hamburger */}
        <button
          className="header__hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span className={`ham-bar${menuOpen ? ' open' : ''}`}></span>
          <span className={`ham-bar${menuOpen ? ' open' : ''}`}></span>
          <span className={`ham-bar${menuOpen ? ' open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`header__mobile-menu${menuOpen ? ' header__mobile-menu--open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          <ul>
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <a href={link.href} className="mobile-link" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#loans" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
             onClick={() => setMenuOpen(false)}>
            Apply Now
          </a>
        </nav>
      </div>
    </header>
  )
}