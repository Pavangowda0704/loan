/* ============================================
   HowItWorks.jsx
   Edit STEPS array to change the 3-step process
   ============================================ */
import './HowItWorks.css'

// === EDIT: 3 steps ===
const STEPS = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: 'Apply Online',
    desc: 'Fill in your basic details and choose the loan type that suits you best.',
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
        <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
      </svg>
    ),
    title: 'Upload Documents',
    desc: 'Securely upload required documents online in just a few clicks.',
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: 'Get Approval',
    desc: 'We verify and approve your loan quickly. Funds are disbursed directly.',
  },
]

export default function HowItWorks() {
  return (
    <section className="how" id="how-it-works" aria-label="How it works">
      <div className="container">
        <div className="how__header">
          {/* === EDIT: section label & heading === */}
          <span className="section-label">How It Works</span>
          <h2 className="section-title">3 Simple Steps to <span>Get Your Loan</span></h2>
          <p className="section-subtitle">The whole process takes just a few minutes from start to finish.</p>
        </div>

        <ol className="how__steps" aria-label="Loan application steps">
          {STEPS.map((step, i) => (
            <li className="how-step" key={step.num} aria-label={`Step ${i + 1}: ${step.title}`}>
              {/* Connector line (hidden for last) */}
              {i < STEPS.length - 1 && <span className="how-step__connector" aria-hidden="true" />}

              <div className="how-step__bubble" aria-hidden="true">
                <span className="how-step__icon">{step.icon}</span>
              </div>

              <div className="how-step__body">
                <span className="how-step__num">{step.num}</span>
                <h3 className="how-step__title">{step.title}</h3>
                <p className="how-step__desc">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
