// ============================================================
//  Navbar.jsx — Plumzo Capital Services
//  Sticky navbar with Tata Capital-style mega dropdown
//  React Router based navigation
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NAV_LINKS } from '../data/loanCategories'
import MegaLoanMenu from './MegaLoanMenu'
import MobileMenu from './MobileMenu'
import '../styles/navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setMobileOpen] = useState(false)

  const navbarRef = useRef(null)
  const triggerRef = useRef(null)

  const scrollToSection = (id) => {
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  const handleNav = (link) => {
    setDropdownOpen(false)
    if (link.label === 'Home') {
      navigate('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (link.href?.startsWith('#')) {
      const id = link.href.replace('#', '')
      if (location.pathname !== '/') {
        navigate('/')
        scrollToSection(id)
      } else {
        scrollToSection(id)
      }
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  return (
    <>
      <header ref={navbarRef} className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
        <div className="navbar__container">
          <Link to="/" className="navbar__logo" aria-label="Plumzo Capital Services — home" onClick={() => setDropdownOpen(false)}>
  <img src="/plumzo_logo.jpg" alt="Plumzo Capital Services" height="44" style={{height:'44px', width:'auto'}} />
</Link>

          <nav className="navbar__nav" aria-label="Main navigation">
            <ul className="navbar__nav-list" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.label} className="navbar__nav-item">
                  {link.hasDropdown ? (
                    <button
                      ref={triggerRef}
                      className={`navbar__nav-link navbar__nav-link--btn${isDropdownOpen ? ' navbar__nav-link--active' : ''}`}
                      onClick={() => setDropdownOpen((o) => !o)}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <span className={`navbar__chevron${isDropdownOpen ? ' navbar__chevron--up' : ''}`} aria-hidden="true">
                        <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`navbar__nav-link${link.label === 'Home' && location.pathname === '/' ? ' navbar__nav-link--active' : ''}`}
                      onClick={() => handleNav(link)}
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="navbar__right">
            <button type="button" className="navbar__cta-btn" onClick={() => { setDropdownOpen(false); navigate('/loans/personal') }}>
              Apply Now
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              className={`navbar__hamburger${isMobileMenuOpen ? ' navbar__hamburger--open' : ''}`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="hb-bar" />
              <span className="hb-bar" />
              <span className="hb-bar" />
            </button>
          </div>
        </div>

        <div className="navbar__mega-wrapper">
          <MegaLoanMenu visible={isDropdownOpen} onClose={() => setDropdownOpen(false)} />
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
