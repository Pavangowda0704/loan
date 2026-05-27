// ============================================================
//  Testimonials.jsx
//  Horizontal scrollable review cards — swipeable on mobile
//  Edit REVIEWS array to change testimonials
// ============================================================
import { useRef, useState } from 'react'
import './Testimonials.css'

// === EDIT: review data ===
const REVIEWS = [
  {
    id: 1,
    name: 'Ramesh Kumar',
    location: 'Bengaluru',
    loanType: 'Home Loan',
    loanColor: '#1A56DB',
    loanBg: '#EEF3FF',
    review: 'The process was simple and the team helped me understand the required documents clearly. I was able to apply without any confusion.',
    rating: 5,
    avatar: 'RK',
    avatarBg: '#1A56DB',
  },
  {
    id: 2,
    name: 'Anitha Sharma',
    location: 'Mumbai',
    loanType: 'Business Loan',
    loanColor: '#EA580C',
    loanBg: '#FFF7ED',
    review: 'I applied for business funding and received proper guidance from start to finish. The expert support made the whole process stress-free.',
    rating: 5,
    avatar: 'AS',
    avatarBg: '#EA580C',
  },
  {
    id: 3,
    name: 'Mohan R',
    location: 'Chennai',
    loanType: 'Vehicle Loan',
    loanColor: '#16A34A',
    loanBg: '#F0FDF4',
    review: 'Very easy process and quick support. I could check my EMI and apply without any confusion. Got my car within a week!',
    rating: 5,
    avatar: 'MR',
    avatarBg: '#16A34A',
  },
  {
    id: 4,
    name: 'Priya Nair',
    location: 'Hyderabad',
    loanType: 'Personal Loan',
    loanColor: '#9333EA',
    loanBg: '#FDF4FF',
    review: 'Needed funds for a medical emergency and LoanEase helped me get approved in 24 hours. The team was very responsive and helpful.',
    rating: 5,
    avatar: 'PN',
    avatarBg: '#9333EA',
  },
]

function StarRating({ count = 5 }) {
  return (
    <div className="testi-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 16 16" width="16" height="16" fill={i < count ? '#F59E0B' : '#E5E7EB'} aria-hidden="true">
          <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.7 4.08L8 10.5l-3.7 1.95.7-4.08L2 5.5l4.15-.75L8 1z"/>
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const trackRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const scrollTo = (idx) => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[idx]
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      setActiveIdx(idx)
    }
  }

  // Update active dot on scroll
  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    const cards = Array.from(track.children)
    const scrollLeft = track.scrollLeft
    const cardWidth = cards[0]?.offsetWidth + 20 // gap
    const idx = Math.round(scrollLeft / cardWidth)
    setActiveIdx(Math.min(idx, REVIEWS.length - 1))
  }

  return (
    <section className="testi-section" id="reviews" aria-label="Customer testimonials">
      <div className="container">
        <div className="testi-header">
          <span className="section-label">Happy Customers</span>
          <h2 className="section-title">What Our <span>Customers Say</span></h2>
          <p className="section-subtitle">Real stories from real people who found the right loan with LoanEase.</p>
        </div>

        {/* Scrollable track */}
        <div
          className="testi-track"
          ref={trackRef}
          onScroll={onScroll}
          role="list"
          aria-label="Customer reviews"
        >
          {REVIEWS.map((r, i) => (
            <article
              className="testi-card card"
              key={r.id}
              role="listitem"
              aria-label={`Review by ${r.name}`}
            >
              {/* Quote mark */}
              <span className="testi-card__quote" aria-hidden="true">"</span>

              {/* Stars */}
              <StarRating count={r.rating} />

              {/* Review text */}
              <p className="testi-card__text">{r.review}</p>

              {/* Footer: avatar + name + loan type */}
              <div className="testi-card__footer">
                <div
                  className="testi-card__avatar"
                  style={{ background: r.avatarBg }}
                  aria-hidden="true"
                >
                  {r.avatar}
                </div>
                <div className="testi-card__info">
                  <strong className="testi-card__name">{r.name}</strong>
                  <span className="testi-card__location">{r.location}</span>
                </div>
                <span
                  className="testi-card__loan-tag"
                  style={{ color: r.loanColor, background: r.loanBg }}
                >
                  {r.loanType}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Dot navigation */}
        <div className="testi-dots" role="tablist" aria-label="Review navigation">
          {REVIEWS.map((r, i) => (
            <button
              key={r.id}
              className={`testi-dot${activeIdx === i ? ' testi-dot--active' : ''}`}
              onClick={() => scrollTo(i)}
              aria-label={`Go to review ${i + 1}`}
              role="tab"
              aria-selected={activeIdx === i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
