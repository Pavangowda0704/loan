/* ============================================
   Footer.jsx
   Edit FOOTER_LINKS and SOCIAL_LINKS arrays
   ============================================ */
import './Footer.css'

// === EDIT: footer column links ===
const FOOTER_LINKS = [
  {
    heading: 'Loan Products',
    links: [
      { label: 'Home Loan', href: '#loans' },
      { label: 'Vehicle Loan', href: '#loans' },
      { label: 'Business Loan', href: '#loans' },
      { label: 'Personal Loan', href: '#loans' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'FAQs', href: '#faq' },
      { label: 'Contact Us', href: '#contact' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: '+91 98765 43210', href: 'tel:+919876543210' },
      { label: 'support@loanease.com', href: 'mailto:support@loanease.com' },
      { label: 'Mon–Sat: 9 AM – 7 PM', href: '#contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms & Conditions', href: '#terms' },
      { label: 'Refund Policy', href: '#refund' },
    ],
  },
]

// === EDIT: social icons ===
const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
  )},
  { label: 'Twitter', href: '#', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
  )},
  { label: 'Instagram', href: '#', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )},
  { label: 'LinkedIn', href: '#', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
  )},
]

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__inner">

        {/* Brand column */}
        <div className="footer__brand">
          <a href="#" className="footer__logo" aria-label="LoanEase home">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1A56DB"/>
              <path d="M16 6L7 13v13h6v-8h6v8h6V13L16 6z" fill="white"/>
            </svg>
            <span>LoanEase</span>
          </a>
          {/* === EDIT: brand tagline === */}
          <p className="footer__tagline">
            Quick loans with a simple process and trusted support. Easy Loans. Better Life.
          </p>
          <div className="footer__social" aria-label="Social media links">
            {SOCIAL_LINKS.map(s => (
              <a key={s.label} href={s.href} className="social-icon" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {FOOTER_LINKS.map(col => (
          <div className="footer__col" key={col.heading}>
            <h3 className="footer__col-heading">{col.heading}</h3>
            <ul>
              {col.links.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="footer__link">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container">
          {/* === EDIT: copyright year & company name === */}
          <p>© 2024 LoanEase. All Rights Reserved.</p>
          <p>Made with ❤️ for Indian borrowers</p>
        </div>
      </div>
    </footer>
  )
}
