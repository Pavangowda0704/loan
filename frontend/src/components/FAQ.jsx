// ============================================================
//  FAQ.jsx
//  Accordion FAQ section with smooth open/close animation
//  Edit FAQ_ITEMS array to add/remove questions
// ============================================================
import { useState } from 'react'
import './FAQ.css'

// === EDIT: FAQ questions and answers ===
const FAQ_ITEMS = [
  {
    id: 1,
    question: 'What types of loans does LoanEase offer?',
    answer: 'LoanEase offers Home Loans, Business Loans, Personal Loans, and Vehicle Loans. Each category includes multiple sub-types to match your specific requirement — from home purchase to working capital finance.',
  },
  {
    id: 2,
    question: 'What documents are required to apply?',
    answer: 'Basic KYC documents (Aadhaar, PAN), income proof (salary slips or ITR), bank statements for the last 6 months, and loan-specific documents such as property papers for home loans are typically required.',
  },
  {
    id: 3,
    question: 'Can I check my EMI before applying?',
    answer: 'Yes! You can use our EMI Calculator on this page before you apply. Enter your loan amount, interest rate, and tenure to get an instant estimate of your monthly payment.',
  },
  {
    id: 4,
    question: 'Is my document upload secure?',
    answer: 'Absolutely. All documents are uploaded over an encrypted connection and stored securely. Your information is only used for loan verification and processing purposes.',
  },
  {
    id: 5,
    question: 'How do I track my loan application status?',
    answer: 'After submitting your application, you will receive a reference number. You can use this to track your application status through our dashboard. Our team will also keep you updated via SMS and email.',
  },
]

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
      <button
        className="faq-item__trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-question-${item.id}`}
      >
        <span className="faq-item__question">{item.question}</span>
        <span className="faq-item__icon" aria-hidden="true">
          {isOpen ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          )}
        </span>
      </button>
      <div
        className="faq-item__panel"
        id={`faq-answer-${item.id}`}
        role="region"
        aria-labelledby={`faq-question-${item.id}`}
        aria-hidden={!isOpen}
      >
        <p className="faq-item__answer">{item.answer}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <section className="faq-section" id="faq" aria-label="Frequently asked questions">
      <div className="container">
        <div className="faq-layout">
          {/* Left: heading */}
          <div className="faq-heading-col">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Got <span>Questions?</span></h2>
            <p className="faq-desc">
              Everything you need to know about loans and our process.
              Can't find an answer?
            </p>
            <a href="#contact" className="btn btn-outline faq-contact-btn">
              Contact Us
            </a>
          </div>

          {/* Right: accordion */}
          <div className="faq-accordion" role="list">
            {FAQ_ITEMS.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
